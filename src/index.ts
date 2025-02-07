import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import api from './api';

// Initialize environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Global middlewares
app.use(cors());
app.use(express.json());

// API routes
app.use('/api/v1', api);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Start server
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}

// Export for Vercel
export default app;