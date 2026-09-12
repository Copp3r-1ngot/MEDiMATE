/**
 * @file ocrRoutes.ts
 * @description API endpoints for document upload, OCR parsing, and abnormal range evaluation.
 */

import { Router, Request, Response } from 'express';
import { OcrService } from '../services/ocrEngine';

const router = Router();

// Scan / Parse document
router.post('/process', (req: Request, res: Response) => {
  const { fileName, rawText } = req.body;
  const result = OcrService.processDocument(fileName || 'prescription_upload.png', rawText);
  return res.json({ success: true, data: result });
});

// Evaluate custom lab value
router.post('/evaluate-lab', (req: Request, res: Response) => {
  const { testName, value } = req.body;
  const evalResult = OcrService.evaluateLabRange(testName, value);
  return res.json({ success: true, data: evalResult });
});

export default router;
