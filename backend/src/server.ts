/**
 * @file server.ts
 * @description Main Express Server for MEDiMATE v0.1 Prototype API.
 * Provides endpoints for clinical history taking, OCR processing, ABDM simulation,
 * and the physician workstation.
 */

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import historyRoutes from './routes/historyRoutes';
import ocrRoutes from './routes/ocrRoutes';
import abdmRoutes from './routes/abdmRoutes';
import doctorRoutes from './routes/doctorRoutes';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Health check & branding
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ONLINE',
    project: 'MEDiMATE',
    version: '0.1.0-prototype',
    tagline: 'Your health, heard clearly before you walk in.',
    hackathonProblem: 'Smart India Hackathon #26047 (Ministry of Ayush / AIIA)',
    timestamp: new Date().toISOString(),
  });
});

import path from 'path';

// Mount Routes
app.use('/api/history', historyRoutes);
app.use('/api/ocr', ocrRoutes);
app.use('/api/abdm', abdmRoutes);
app.use('/api/doctor', doctorRoutes);

// Serve Frontend static assets
const frontendDistPath = path.join(__dirname, '../../frontend/dist');
app.use(express.static(frontendDistPath));

app.get('*', (req: Request, res: Response, next: express.NextFunction) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// Global Error Handler
app.use((err: Error, _req: Request, res: Response, _next: express.NextFunction) => {
  console.error('[MEDiMATE Server Error]:', err);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message || 'Unknown server error',
  });
});

app.listen(PORT, () => {
  console.log(`=======================================================`);
  console.log(`🏥 MEDiMATE v0.1 API Server listening on port ${PORT}`);
  console.log(`🚀 Smart India Hackathon #26047 Prototype`);
  console.log(`🌐 Health endpoint: http://localhost:${PORT}/api/health`);
  console.log(`=======================================================`);
});
