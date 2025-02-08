export interface HumanFaceConfig {
  apiKey: string;
  enterpriseId: string;
  baseUrl?: string;
}

export interface KYCSession {
  id: string;
  sessionUrl: string;
  expiresAt: string;
  enterprise: {
    name: string;
    logo_url: string | null;
  };
}

export interface VerificationRequest {
  sessionId: string;
  documentType: 'passport' | 'drivers_license' | 'national_id';
  documentData: string;
  livenessData?: string;
}

export interface VerificationResponse {
  status: 'success' | 'error';
  verificationId?: string;
  message?: string;
}

export interface WebhookEvent {
  type: string;
  data: any;
  timestamp: string;
  signature: string;
}