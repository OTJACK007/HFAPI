# HumanFace SDK

Official SDK for HumanFace KYC/KYB API.

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
  enterpriseId: 'your_enterprise_id'
});

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

## Documentation

For complete documentation, visit [https://humanface.xyz/documentation](https://humanface.xyz/documentation)

## License

MIT