import crypto from 'crypto-js';

/**
 * Validate webhook signature
 */
export function validateWebhookSignature(
  payload: string,
  signature: string,
  secret: string
): boolean {
  const timestamp = signature.split('.')[0];
  const expectedSignature = signature.split('.')[1];

  const signaturePayload = `${timestamp}.${payload}`;
  const calculatedSignature = crypto.HmacSHA256(signaturePayload, secret).toString();

  return calculatedSignature === expectedSignature;
}