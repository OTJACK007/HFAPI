import axios, { AxiosInstance } from 'axios';
import { HumanFaceConfig, KYCSession, VerificationRequest, VerificationResponse } from './types';
import { validateWebhookSignature } from './utils';

export class HumanFaceClient {
  private client: AxiosInstance;
  private config: HumanFaceConfig;

  constructor(config: HumanFaceConfig) {
    this.config = config;
    this.client = axios.create({
      baseURL: config.baseUrl || 'https://api.humanface.xyz',
      headers: {
        'x-api-key': config.apiKey,
        'x-enterprise-id': config.enterpriseId,
        'Content-Type': 'application/json'
      }
    });
  }

  /**
   * Create a new KYC session
   */
  async createSession(customerEmail: string, customerName: string): Promise<KYCSession> {
    try {
      const response = await this.client.post('/api/sessions', {
        customerEmail,
        customerName
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Submit documents for verification
   */
  async submitVerification(request: VerificationRequest): Promise<VerificationResponse> {
    try {
      const response = await this.client.post('/api/verify', request);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Get verification status
   */
  async getVerificationStatus(verificationId: string): Promise<string> {
    try {
      const response = await this.client.get(`/api/verify/${verificationId}/status`);
      return response.data.status;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  /**
   * Validate webhook signature
   */
  validateWebhook(
    payload: string,
    signature: string,
    webhookSecret: string
  ): boolean {
    return validateWebhookSignature(payload, signature, webhookSecret);
  }

  private handleError(error: any): Error {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.error || error.message;
      return new Error(`HumanFace API Error: ${message}`);
    }
    return error;
  }
}