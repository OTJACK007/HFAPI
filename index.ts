import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { validateApiKey } from './middleware/validateApiKey';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
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

// Protected routes
app.use('/api/sessions', validateApiKey);
app.use('/api/verify', validateApiKey);

// Utility function to send webhook
const sendWebhook = async (
  supabase: SupabaseClient,
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
            response: { error: error.message }
          });
      }
    }));
  } catch (error) {
    console.error('Error processing webhooks:', error);
  }
};

// Create KYC session endpoint
app.post('/api/sessions', async (req, res) => {
  try {
    const { customerEmail, customerName } = req.body;
    const { apiKey, enterpriseId } = req;

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

// Get session status endpoint
app.get('/api/sessions/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: session, error } = await supabase
      .from('kyc_sessions')
      .select(`
        *,
        enterprise:enterprises(name),
        verification:kyc_verifications(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    res.json(session);

  } catch (error) {
    console.error('Error getting session:', error);
    res.status(500).json({ error: 'Failed to get session' });
  }
});

// Submit verification endpoint
app.post('/api/verify', async (req, res) => {
  try {
    const { sessionId, documentType, documentUrl, livenessUrl } = req.body;

    // Get session
    const { data: session, error: sessionError } = await supabase
      .from('kyc_sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (sessionError || !session) {
      return res.status(404).json({ error: 'Session not found' });
    }

    // Create document record
    const { data: document, error: docError } = await supabase
      .from('kyc_documents')
      .insert({
        type: documentType,
        url: documentUrl,
        verification_method: 'ai'
      })
      .select()
      .single();

    if (docError) throw docError;

    // Create verification record
    const { data: verification, error: verifyError } = await supabase
      .from('kyc_verifications')
      .insert({
        session_id: sessionId,
        document_id: document.id,
        status: 'processing'
      })
      .select()
      .single();

    if (verifyError) throw verifyError;

    // Update session status
    await supabase
      .from('kyc_sessions')
      .update({
        status: 'processing',
        verification_id: verification.id
      })
      .eq('id', sessionId);

    // Return verification ID
    res.json({
      verificationId: verification.id,
      status: 'processing'
    });

  } catch (error) {
    console.error('Error submitting verification:', error);
    res.status(500).json({ error: 'Failed to submit verification' });
  }
});

// Get verification status endpoint
app.get('/api/verify/:id/status', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: verification, error } = await supabase
      .from('kyc_verifications')
      .select(`
        *,
        document:kyc_documents(*),
        liveness_check:liveness_checks(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!verification) {
      return res.status(404).json({ error: 'Verification not found' });
    }

    // Get session and enterprise info
    const { data: session } = await supabase
      .from('kyc_sessions')
      .select(`
        *,
        enterprise:enterprises(id, name)
      `)
      .eq('verification_id', id)
      .single();

    if (session?.enterprise) {
      // Send webhook
      await sendWebhook(
        supabase,
        session.enterprise.id,
        'verification.status_update',
        {
          verification_id: verification.id,
          session_id: session.id,
          status: verification.status,
          document_status: verification.document?.status,
          liveness_status: verification.liveness_check?.status,
          risk_score: verification.risk_score,
          updated_at: new Date().toISOString()
        }
      );
    }

    res.json({
      status: verification.status,
      documentStatus: verification.document?.status,
      livenessStatus: verification.liveness_check?.status,
      riskScore: verification.risk_score
    });

  } catch (error) {
    console.error('Error getting verification status:', error);
    res.status(500).json({ error: 'Failed to get verification status' });
  }
});

// Export for Vercel
export default app;