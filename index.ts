import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateApiKey } from './middleware/validateApiKey';
import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

dotenv.config();

const app = express();

// Initialize Supabase client
const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.VITE_SUPABASE_SERVICE_ROLE_KEY!
);

// Middleware
app.use(cors());
app.use(express.json());

// Root route
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: 'Welcome to HumanFace API',
    version: '1.0.0',
    endpoints: {
      '/api/sessions': {
        description: 'Create and manage KYC sessions',
        methods: ['POST'],
        auth: 'API Key required'
      },
      '/api/verify': {
        description: 'Submit and verify KYC documents',
        methods: ['POST'],
        auth: 'API Key required'
      }
    },
    documentation: 'https://docs.humanface.xyz'
  });
});

// Protected routes
app.use('/api/sessions', validateApiKey);
app.use('/api/verify', validateApiKey);

// Utility function to send webhook
const sendWebhook = async (
  supabase: ReturnType<typeof createClient>,
  enterpriseId: string,
  eventType: string,
  payload: any
) => {
  try {
    // Get enterprise webhooks
    const { data: webhooks, error: webhookError } = await supabase
      .from('kyc_webhooks')
      .select('*')
      .eq('enterprise_id', enterpriseId)
      .eq('is_active', true)
      .contains('events', [eventType]);

    if (webhookError) throw webhookError;
    if (!webhooks?.length) return;

    // Send webhook to all configured endpoints
    await Promise.all(webhooks.map(async (webhook) => {
      try {
        // Generate signature
        const timestamp = Date.now().toString();
        const signaturePayload = `${timestamp}.${JSON.stringify(payload)}`;
        const signature = crypto
          .createHmac('sha256', webhook.secret)
          .update(signaturePayload)
          .digest('hex');

        // Send webhook
        const response = await fetch(webhook.url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-HumanFace-Signature': signature,
            'X-HumanFace-Timestamp': timestamp
          },
          body: JSON.stringify(payload)
        });

        // Log webhook event
        await supabase
          .from('kyc_webhook_events')
          .insert({
            webhook_id: webhook.id,
            event_type: eventType,
            status: response.ok ? 'success' : 'failed',
            payload,
            response: await response.json()
          });

      } catch (error) {
        console.error(`Error sending webhook to ${webhook.url}:`, error);
        
        // Log failed webhook attempt
        await supabase
          .from('kyc_webhook_events')
          .insert({
            webhook_id: webhook.id,
            event_type: eventType,
            status: 'failed',
            payload,
            response: { error: error instanceof Error ? error.message : 'Unknown error' }
          });
      }
    }));
  } catch (error) {
    console.error('Error processing webhooks:', error);
  }
};

// Create KYC session endpoint
app.post('/api/sessions', async (req: Request, res: Response) => {
  try {
    const { customerEmail, customerName } = req.body;
    const apiKey = (req as any).apiKey;
    const enterpriseId = (req as any).enterpriseId;

    if (!apiKey || !enterpriseId) {
      return res.status(401).json({ error: 'Invalid API key or enterprise ID' });
    } 

    // Get enterprise details
    const { data: enterprise, error: enterpriseError } = await supabase
      .from('enterprises')
      .select('name, logo_url')
      .eq('id', enterpriseId)
      .single();

    if (enterpriseError) throw enterpriseError;

    // Create session
    const { data: session, error: sessionError } = await supabase
      .from('kyc_sessions')
      .insert({
        enterprise_id: enterpriseId,
        customer_email: customerEmail,
        customer_name: customerName,
        status: 'pending',
        api_key_id: apiKey.id
      })
      .select()
      .single();

    if (sessionError) throw sessionError;

    // Send webhook
    await sendWebhook(
      supabase,
      enterpriseId,
      'session.created',
      {
        session_id: session.id,
        customer_email: customerEmail,
        customer_name: customerName,
        enterprise_name: enterprise.name,
        created_at: new Date().toISOString()
      }
    );

    // Return session URL
    const sessionUrl = `${process.env.VITE_APP_URL}/kyc?session_id=${session.id}`;
    res.json({
      sessionId: session.id,
      sessionUrl,
      expiresAt: session.expires_at,
      enterprise: {
        name: enterprise.name,
        logo_url: enterprise.logo_url
      }
    });

  } catch (error) {
    console.error('Error creating session:', error);
    res.status(500).json({ error: 'Failed to create session' });
  }
});

// Export for Vercel
export default app;