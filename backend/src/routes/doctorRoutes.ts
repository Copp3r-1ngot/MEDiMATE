/**
 * @file doctorRoutes.ts
 * @description API endpoints for the Physician's OPD Workstation (Queue, SOAP review, Sign-off).
 */

import { Router, Request, Response } from 'express';
import { patientDatabase, PatientRecord } from '../services/mockStore';

const router = Router();

// Get active OPD Doctor Queue
router.get('/queue', (_req: Request, res: Response) => {
  const queue = Array.from(patientDatabase.values()).sort((a, b) => {
    const priorityOrder = { EMERGENCY: 1, PRIORITY: 2, ROUTINE: 3 };
    return priorityOrder[a.triagePriority] - priorityOrder[b.triagePriority];
  });

  return res.json({ success: true, count: queue.length, data: queue });
});

// Get specific patient case detail
router.get('/case/:id', (req: Request, res: Response) => {
  const patient = patientDatabase.get(req.params.id);
  if (!patient) {
    return res.status(404).json({ success: false, error: 'Patient case not found' });
  }
  return res.json({ success: true, data: patient });
});

// Physician sign-off / Prescription generation
router.post('/sign-off', (req: Request, res: Response) => {
  const { patientId, physicianName, physicianNotes, finalDiagnosis, prescription, action } = req.body;
  
  const patient = patientDatabase.get(patientId);
  if (!patient) {
    return res.status(404).json({ success: false, error: 'Patient case not found' });
  }

  patient.physicianReview = {
    physicianName: physicianName || 'Dr. Ananya Roy, MD, DNB',
    physicianNotes: physicianNotes || '',
    finalDiagnosis: finalDiagnosis || patient.clinicalHistory.chiefComplaint,
    prescription: prescription || [],
    status: action === 'Reject' ? 'Rejected' : action === 'Modify' ? 'Modified' : 'Accepted',
    signedAt: new Date().toISOString(),
  };

  if (patient.generatedSummary) {
    patient.generatedSummary.status = 'reviewed_by_physician';
  }

  patientDatabase.set(patient.id, patient);

  return res.json({
    success: true,
    message: `Case sheet successfully ${action || 'Accepted'} and signed by ${physicianName || 'Dr. Ananya Roy'}`,
    data: patient,
  });
});

export default router;
