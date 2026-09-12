/**
 * @file historyRoutes.ts
 * @description API endpoints for clinical dialogue, SOCRATES questions, red-flag screening, and summary generation.
 */

import { Router, Request, Response } from 'express';
import { ClinicalAiEngine, SocratesStep } from '../services/aiEngine';
import { patientDatabase, PatientRecord } from '../services/mockStore';

const router = Router();

// Evaluate red flags
router.post('/red-flag-check', (req: Request, res: Response) => {
  const { inputText, chiefComplaint, pastHx } = req.body;
  const result = ClinicalAiEngine.evaluateRedFlags(inputText || '', chiefComplaint || '', pastHx || []);
  return res.json({ success: true, data: result });
});

// Get next SOCRATES question
router.post('/socrates-next', (req: Request, res: Response) => {
  const { symptom, currentStep } = req.body;
  const stepOrder: SocratesStep['stepKey'][] = [
    'site', 'onset', 'character', 'radiation', 'associations', 'timeCourse', 'exacerbatingRelieving', 'severity'
  ];

  const currentIndex = stepOrder.indexOf(currentStep);
  const nextStepKey = currentIndex >= 0 && currentIndex < stepOrder.length - 1 ? stepOrder[currentIndex + 1] : 'site';
  const question = ClinicalAiEngine.getSocratesQuestion(symptom || 'pain', nextStepKey);

  return res.json({
    success: true,
    data: {
      stepKey: nextStepKey,
      stepIndex: stepOrder.indexOf(nextStepKey) + 1,
      totalSteps: stepOrder.length,
      question,
    }
  });
});

// Generate clinical summary & SOAP note
router.post('/generate-summary', (req: Request, res: Response) => {
  const { patientData } = req.body;
  if (!patientData) {
    return res.status(400).json({ success: false, error: 'patientData is required' });
  }

  const generated = ClinicalAiEngine.generateClinicalSummary(patientData as PatientRecord);
  return res.json({ success: true, data: generated });
});

export default router;
