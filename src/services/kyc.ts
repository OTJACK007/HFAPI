import { supabase } from '../lib/supabase';
import type { KYCSession, KYCVerificationRequest, KYCVerificationResponse } from '../types/kyc';

const KYC_API_URL = import.meta.env.VITE_KYC_API_URL || 'https://api.humanface.xyz';

export const createKYCSession = async (
  apiKey: string,
  customerEmail: string,
  customerName: string
): Promise<KYCSession> => {
  try {
    const response = await fetch(`${KYC_API_URL}/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        customerEmail,
        customerName
      })
    });

    if (!response.ok) {
      throw new Error('Failed to create KYC session');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating KYC session:', error);
    throw error;
  }
};

export const getKYCSession = async (sessionId: string): Promise<KYCSession> => {
  try {
    const response = await fetch(`${KYC_API_URL}/sessions/${sessionId}`);
    if (!response.ok) {
      throw new Error('Failed to get KYC session');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting KYC session:', error);
    throw error;
  }
};

export const saveKYCSettings = async (enterpriseId: string, settings: any) => {
  try {
    const { data, error } = await supabase
      .from('kyc_settings')
      .upsert({
        enterprise_id: enterpriseId,
        ...settings
      }, {
        onConflict: 'enterprise_id'
      });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving KYC settings:', error);
    throw error;
  }
};

export const submitKYCVerification = async (
  request: KYCVerificationRequest
): Promise<KYCVerificationResponse> => {
  try {
    // First upload files to Supabase storage
    const { data: docData, error: docError } = await supabase.storage
      .from('kyc-documents')
      .upload(
        `${request.sessionId}/document.${request.documentData.split(';')[0].split('/')[1]}`,
        request.documentData,
        { contentType: request.documentData.split(';')[0].split(':')[1] }
      );

    if (docError) throw docError;

    let livenessUrl = null;
    if (request.livenessData) {
      const { data: livenessData, error: livenessError } = await supabase.storage
        .from('kyc-liveness')
        .upload(
          `${request.sessionId}/liveness.${request.livenessData.split(';')[0].split('/')[1]}`,
          request.livenessData,
          { contentType: request.livenessData.split(';')[0].split(':')[1] }
        );

      if (livenessError) throw livenessError;
      livenessUrl = livenessData.path;
    }

    // Submit verification request to API
    const response = await fetch(`${KYC_API_URL}/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        sessionId: request.sessionId,
        documentType: request.documentType,
        documentUrl: docData.path,
        livenessUrl
      })
    });

    if (!response.ok) {
      throw new Error('Failed to submit KYC verification');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting KYC verification:', error);
    throw error;
  }
};

export const getVerificationStatus = async (verificationId: string) => {
  try {
    const response = await fetch(`${KYC_API_URL}/verify/${verificationId}/status`);
    if (!response.ok) {
      throw new Error('Failed to get verification status');
    }
    return await response.json();
  } catch (error) {
    console.error('Error getting verification status:', error);
    throw error;
  }
};

export const getVerificationHistory = async (customerId: string) => {
  try {
    const { data, error } = await supabase
      .from('kyc_verifications')
      .select(`
        *,
        documents:kyc_documents(*),
        liveness_checks(*)
      `)
      .eq('customer_id', customerId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting verification history:', error);
    throw error;
  }
};