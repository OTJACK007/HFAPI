import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

export const validateApiKey = async (req: Request, res: Response, next: NextFunction) => {
  const apiKey = req.headers['x-api-key'];
  const enterpriseId = req.headers['x-enterprise-id'];

  if (!apiKey || !enterpriseId) {
    return res.status(401).json({ 
      error: 'Missing required headers: x-api-key and x-enterprise-id' 
    });
  }

  try {
    // Validate API key and enterprise ID match
    const { data: keyData, error: keyError } = await supabase
      .from('api_keys')
      .select('id, enterprise_id, key_type')
      .eq('key_value', apiKey)
      .eq('enterprise_id', enterpriseId)
      .is('revoked_at', null)
      .gt('expires_at', 'now()')
      .single();

    if (keyError || !keyData) {
      return res.status(401).json({ 
        error: 'Invalid API key or enterprise ID' 
      });
    }

    // Add validated data to request
    req.apiKey = keyData;
    req.enterpriseId = enterpriseId as string;
    
    next();
  } catch (error) {
    console.error('Error validating API key:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};