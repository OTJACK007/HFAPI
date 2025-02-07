import express from 'express';
import { movieRouter } from './routes';

const api = express();

// API specific middlewares can be added here
api.use('/movies', movieRouter);

export default api;