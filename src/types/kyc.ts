export interface KYCSession {
  id: string;
  enterpriseId: string;
  customerId: string;
  customerEmail: string;
  customerName: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  createdAt: string;
  expiresAt: string;
}

export interface KYCVerificationRequest {
  sessionId: string;
  documentType: string;
  documentData: string;
  livenessData?: string;
}

export interface KYCVerificationResponse {
  status: 'success' | 'error';
  verificationId?: string;
  message?: string;
  data?: any;
}

export interface KYCWebhook {
  id: string;
  enterpriseId: string;
  url: string;
  secret: string;
  events: string[];
  isActive: boolean;
  createdAt: string;
}

export interface KYCSettings {
  id: string;
  enterpriseId: string;
  requiredDocuments: string[];
  allowedDocumentTypes: string[];
  livenessCheckRequired: boolean;
  manualReviewThreshold: number;
  expiryNotificationDays: number;
  autoRejectRules: {
    maxAttempts: number;
    documentQualityThreshold: number;
    livenessScoreThreshold: number;
  };
}