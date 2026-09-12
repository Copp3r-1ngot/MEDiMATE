/**
 * @file abdmRoutes.ts
 * @description API endpoints for Ayushman Bharat Digital Mission (ABDM) / ABHA validation and mock FHIR bundle sync.
 */

import { Router, Request, Response } from 'express';
import { patientDatabase, PatientRecord } from '../services/mockStore';

const router = Router();

// Validate ABHA ID or Address
router.post('/verify-abha', (req: Request, res: Response) => {
  const { abhaId } = req.body;
  
  if (!abhaId) {
    return res.status(400).json({ success: false, error: 'ABHA ID is required' });
  }

  // Plausible ABHA patterns: 14-digit number (with/without hyphens) or username@abdm
  const is14Digit = /^\d{2}-\d{4}-\d{4}-\d{4}$/.test(abhaId) || /^\d{14}$/.test(abhaId);
  const isAbhaAddress = /^[a-zA-Z0-9._-]+@(abdm|sbx|abdm-gov)$/.test(abhaId) || abhaId.includes('@');

  if (is14Digit || isAbhaAddress) {
    return res.json({
      success: true,
      data: {
        isValid: true,
        abhaNumber: is14Digit ? abhaId : '91-8842-1092-3341',
        abhaAddress: isAbhaAddress ? abhaId : `${abhaId.replace(/-/g, '')}@abdm`,
        fullName: 'Rajesh Sharma',
        gender: 'Male',
        dateOfBirth: '14-08-1972',
        kycStatus: 'VERIFIED',
        linkedHospitals: ['All India Institute of Ayurveda, New Delhi', 'AIIMS New Delhi'],
      }
    });
  }

  return res.json({
    success: false,
    error: 'Invalid ABHA ID format. Please use 14-digit ID (e.g. 91-8472-9103-4821) or handle (e.g. rajesh@abdm)',
  });
});

// Mock Push pre-consultation summary to ABDM / HIS
router.post('/push-summary', (req: Request, res: Response) => {
  const { patientData } = req.body;
  if (!patientData || !patientData.id) {
    return res.status(400).json({ success: false, error: 'Valid patient record required' });
  }

  const txnId = `ABDM-TXN-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 10000)}`;
  const patient = patientData as PatientRecord;
  patient.generatedSummary = {
    ...patient.generatedSummary,
    summaryText: patient.generatedSummary?.summaryText || '',
    soapFormat: patient.generatedSummary?.soapFormat || { subjective: '', objective: '', assessment: '', plan: '' },
    status: 'pushed_to_abdm',
    pushedAt: new Date().toISOString(),
    abdmTxnId: txnId,
  };

  patientDatabase.set(patient.id, patient);

  return res.json({
    success: true,
    data: {
      transactionId: txnId,
      pushedAt: new Date().toISOString(),
      fhirBundleType: 'OPD-PreConsultation-Record',
      hipId: 'IN.GOV.AYUSH.AIIA.DELHI.01',
      hipName: 'All India Institute of Ayurveda OPD Hub',
      abhaLinked: patient.abhaId || 'ANONYMOUS_TOKEN',
      status: 'LINKED_AND_DISPATCHED',
    }
  });
});

export default router;
