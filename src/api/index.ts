import express from 'express';
import { validateApiKey } from '../middleware/validateApiKey';

const api = express();

// API specific middlewares can be added here
api.use('/sessions', validateApiKey);
api.use('/verify', validateApiKey);

export default api;