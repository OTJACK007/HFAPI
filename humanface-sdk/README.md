# HumanFace SDK

Official SDK for HumanFace's Identity Verification Platform. HumanFace provides a comprehensive suite of KYC (Know Your Customer) and KYB (Know Your Business) solutions to help businesses verify customer identities securely and efficiently.

Our platform offers:
- Document Verification (ID cards, passports, driver's licenses)
- Liveness Detection
- Face Matching
- AI-Powered Fraud Prevention
- Global Coverage with 150+ Countries Support
- Real-time Identity Verification
- Customizable Verification Workflows

## Getting Started

Before installing the SDK, you'll need to:

1. Create a HumanFace account at [humanface.xyz](https://humanface.xyz)
2. Set up your enterprise in the dashboard
3. Generate an API key from the API Keys section
4. Note your Enterprise ID from the Company Settings page

These credentials will be required to initialize the SDK.

## Installation

```bash
npm install @humanface/sdk
```

## Quick Start

```typescript
import { HumanFaceClient } from '@humanface/sdk';

// Initialize client
const client = new HumanFaceClient({
  apiKey: 'your_api_key',
  enterpriseId: 'your_enterprise_id',
  baseUrl: 'https://api.humanface.xyz', // Optional, defaults to this value
  kycUrl: 'https://kyc.humanface.xyz'  // Optional, defaults to this value
});

// Test connection
const isConnected = await client.testConnection();
if (!isConnected) {
  console.error('Failed to connect to HumanFace API');
  return;
}

// Create a KYC session
const session = await client.createSession(
  'customer@example.com',
  'John Doe'
);

// Submit verification
const verification = await client.submitVerification({
  sessionId: session.id,
  documentType: 'passport',
  documentData: 'base64_document_data',
  livenessData: 'base64_liveness_data'
});

// Check verification status
const status = await client.getVerificationStatus(verification.verificationId);
```

## Webhook Handling

```typescript
// Validate webhook signature
const isValid = client.validateWebhook(
  JSON.stringify(webhookPayload),
  signature,
  webhookSecret
);
```

## KYC Flow

When a customer needs to complete KYC verification:

1. Create a session using `createSession()`
2. Redirect the customer to the returned `sessionUrl`
3. The customer will be taken to the HumanFace KYC interface at kyc.humanface.xyz
4. After completion, they'll be redirected back to your success/failure URLs

```typescript
// Example KYC flow
const session = await client.createSession(
  'customer@example.com',
  'John Doe'
);

// Redirect customer to the KYC interface
window.location.href = session.sessionUrl;
```

## Documentation

For complete documentation, visit [www.humanface.xyz./documentation](https://humanface.xyz./documentation)

## Support

If you need help:
- Email: support@humanface.xyz
- Documentation: [www.humanface.xyz./documentation](https://humanface.xyz./documentation)
- Discord Community: [Join our Discord](https://discord.gg/humanface)

## License

MIT