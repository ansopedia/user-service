import express from 'express';
import authRoutes from './auth';

export const routes = express.Router();

routes.use(authRoutes);
