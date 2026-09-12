/**
 * @file ConsultScreen.tsx
 * @description Screen 5: Physician OPD Workstation & Clinical Governance Console.
 * Features:
 * 1. Live OPD Patient Queue with triaged severity badges (Emergency Red-Flag, Priority, Routine).
 * 2. Structured SOAP clinical case sheet viewer.
 * 3. Physician Governance Controls: Accept / Modify / Reject intake draft.
 * 4. Clinical Impression & Prescription Pad editor.
 * 5. Sign-off & Printable OPD Consultation Slip generation.
 */

import React, { useState } from 'react';
import { 
  Stethoscope, 
  CheckCircle, 
  Edit3, 
  XCircle, 
  Printer, 
  FileText, 
  Siren, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  ArrowLeft,
  Flame,
  AlertCircle
} from 'lucide-react';
import { usePatient } from '../../context/PatientContext';
import { DEMO_PRESETS } from '../../data/demoPresets';
import { ApiService } from '../../services/apiService';

export const ConsultScreen: React.FC = () => {
  const { patient, setCurrentScreen, setPatient, loadDemoPreset } = usePatient();

  const [governanceAction, setGovernanceAction] = useState<'Accepted' | 'Modified' | 'Rejected'>('Accepted');
  const [physicianName] = useState<string>('Dr. Ananya Roy, MD (Medicine), DNB');
  const [physicianNotes, setPhysicianNotes] = useState<string>(
    patient.clinicalHistory.redFlagTriggered
      ? 'Patient presents with acute chest discomfort radiating to left arm. Stat 12-lead ECG and Troponin-I advised immediately. Referred to Emergency Cardiology Desk.'
      : 'Intake history reviewed. Vital signs stable. Adjusting oral hypoglycemic regimen based on elevated HbA1c (9.4%). Advised lifestyle modification.'
  );
  const [finalDiagnosis, setFinalDiagnosis] = useState<string>(
    patient.clinicalHistory.redFlagTriggered
      ? 'Suspected Acute Coronary Syndrome (ACS) / Unstable Angina'
      : 'Uncontrolled Type 2 Diabetes Mellitus with Peripheral Neuropathy'
  );

  const [prescriptionList, setPrescriptionList] = useState<Array<{ drug: string; dosage: string; timing: string; instructions: string }>>([
    { drug: 'Tab Telmisartan', dosage: '40mg', timing: '1-0-0', instructions: 'Once daily morning after breakfast' },
    { drug: 'Tab Metformin', dosage: '1000mg', timing: '1-0-1', instructions: 'Twice daily after meals' },
  ]);

  const [newDrug, setNewDrug] = useState<string>('');
  const [newDosage, setNewDosage] = useState<string>('');
  const [newTiming] = useState<string>('1-0-0');
  const [isSignedOff, setIsSignedOff] = useState<boolean>(false);

  const handleAddMedication = () => {
    if (!newDrug) return;
    setPrescriptionList(prev => [
      ...prev,
      { drug: newDrug, dosage: newDosage || 'Standard', timing: newTiming, instructions: 'As directed' }
    ]);
    setNewDrug('');
    setNewDosage('');
  };

  const handleRemoveMedication = (index: number) => {
    setPrescriptionList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSignOff = async (action: 'Accepted' | 'Modified' | 'Rejected') => {
    setGovernanceAction(action);
    setIsSignedOff(true);

    const apiAction = action === 'Accepted' ? 'Accept' : action === 'Modified' ? 'Modify' : 'Reject';

    await ApiService.physicianSignOff({
      patientId: patient.id,
      physicianName,
      physicianNotes,
      finalDiagnosis,
      prescription: prescriptionList,
      action: apiAction,
    });

    setPatient(prev => ({
      ...prev,
      physicianReview: {
        physicianName,
        physicianNotes,
        finalDiagnosis,
        prescription: prescriptionList,
        status: action,
        signedAt: new Date().toISOString(),
      }
    }));
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const s = patient.clinicalHistory.socrates;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in duration-300">
      
      {/* Physician Workstation Header */}
      <div className="glass-panel p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-teal-500/30">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-semibold uppercase">
            <Stethoscope className="w-4 h-4 text-teal-400" />
            <span>चरण 5: चिकित्सक ओपीडी कंसोल (Physician OPD Workstation)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            डॉक्टर कंसल्टेशन एवं क्लिनिकल साइन-ऑफ
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm">
            AI-assisted pre-consultation intake. The registered medical practitioner retains 100% final clinical governance.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setCurrentScreen(1)}
            className="touch-target px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>कियोस्क पर लौटें (Kiosk View)</span>
          </button>
        </div>
      </div>

      {/* OPD Waiting Queue & Demo Switcher Bar */}
      <div className="p-4 rounded-2xl bg-slate-850 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            🏥 सक्रिय ओपीडी कतार (Live OPD Triage Queue):
          </span>
          <span className="text-[11px] text-teal-400 font-medium">Click patient to inspect record</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {DEMO_PRESETS.map((p) => {
            const isCurrent = patient.name === p.data.name;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => loadDemoPreset(p.id)}
                className={`touch-target p-3 rounded-xl border text-left transition-all ${
                  isCurrent
                    ? 'bg-teal-950/60 border-teal-400 shadow-md ring-1 ring-teal-400'
                    : 'bg-slate-800/80 hover:bg-slate-800 border-slate-700 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-sm text-white">{p.data.name} ({p.data.age}y/{p.data.gender})</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${p.badgeColor}`}>
                    {p.badge}
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 truncate">
                  CC: {p.data.clinicalHistory.chiefComplaint}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Doctor Review Grid: Left SOAP Inspection, Right Rx & Governance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Structured SOAP Clinical Sheet */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-6 space-y-5 border-slate-700">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-400" />
                  <span>क्लिनिकल केस शीट (SOAP Case Sheet)</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">Patient: {patient.name} • ABHA: {patient.abhaId}</span>
              </div>

              {patient.clinicalHistory.redFlagTriggered ? (
                <span className="px-3 py-1 rounded-full bg-red-600 text-white font-bold text-xs flex items-center gap-1.5 animate-pulse shadow-md">
                  <Siren className="w-4 h-4" />
                  EMERGENCY RED-FLAG
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30 font-semibold text-xs">
                  ROUTINE OPD
                </span>
              )}
            </div>

            {/* Red Flag Warning Box */}
            {patient.clinicalHistory.redFlagTriggered && (
              <div className="p-4 rounded-xl bg-red-950/60 border border-red-500 text-red-200 text-xs space-y-1">
                <div className="font-bold text-sm text-red-100 flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-red-400" />
                  <span>Clinical Red-Flag Triggered:</span>
                </div>
                <p>{patient.clinicalHistory.redFlagDetails}</p>
              </div>
            )}

            {/* SOAP: S (Subjective) */}
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold uppercase text-teal-400 tracking-wider">
                [S] SUBJECTIVE (रोगी द्वारा बताए गए लक्षण):
              </span>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs leading-relaxed space-y-2 text-slate-200">
                <div>
                  <span className="text-slate-400 font-semibold">Chief Complaint:</span>{' '}
                  <span className="font-bold text-white">{patient.clinicalHistory.chiefComplaint}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">SOCRATES Breakdown:</span>
                  <div className="grid grid-cols-2 gap-1 pt-1 text-[11px] text-slate-300">
                    <div>• Site: {s.site || 'N/A'}</div>
                    <div>• Onset: {s.onset || 'N/A'}</div>
                    <div>• Character: {s.character || 'N/A'}</div>
                    <div>• Radiation: {s.radiation || 'N/A'}</div>
                    <div>• Associations: {s.associations?.join(', ') || 'None'}</div>
                    <div>• Severity: {s.severity ? `${s.severity}/10` : 'N/A'}</div>
                  </div>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">PMHx:</span>{' '}
                  {patient.clinicalHistory.pastMedicalHistory.join(', ') || 'None reported'}
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Allergies:</span>{' '}
                  <span className="text-red-300 font-semibold">
                    {patient.clinicalHistory.drugAllergies.join(', ') || 'NKDA'}
                  </span>
                </div>
              </div>
            </div>

            {/* SOAP: O (Objective) - Scanned Labs & Prior Rx */}
            <div className="space-y-1.5">
              <span className="text-xs font-extrabold uppercase text-teal-400 tracking-wider">
                [O] OBJECTIVE (डिजिटाइज़ रिपोर्ट व जांच परिणाम):
              </span>
              <div className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/80 text-xs space-y-2">
                {patient.scannedDocuments.length === 0 ? (
                  <span className="text-slate-400 italic">No prior physical documents digitized in this session.</span>
                ) : (
                  patient.scannedDocuments.map((doc) => (
                    <div key={doc.id} className="space-y-1.5">
                      <div className="font-bold text-slate-200 text-[11px]">
                        📄 {doc.fileName}
                      </div>
                      <div className="grid grid-cols-2 gap-1.5">
                        {doc.extractedLabValues.map((lab, i) => (
                          <div 
                            key={i} 
                            className={`p-1.5 rounded text-[11px] font-mono flex items-center justify-between ${
                              lab.isAbnormal ? 'bg-red-950/60 text-red-300 font-bold border border-red-500/40' : 'bg-slate-750 text-slate-300'
                            }`}
                          >
                            <span>{lab.testName}</span>
                            <span>{lab.value} {lab.unit} {lab.isAbnormal ? `[${lab.abnormalFlag}]` : ''}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* AYUSH Dashavidha Box (If enabled) */}
            {patient.ayushMode && patient.clinicalHistory.ayushAssessment && (
              <div className="space-y-1.5">
                <span className="text-xs font-extrabold uppercase text-amber-400 tracking-wider flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>AYUSH DASHIVIDHA PARIKSHA FINDINGS:</span>
                </span>
                <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs grid grid-cols-3 gap-2 text-slate-200">
                  <div><span className="text-amber-300 font-bold">प्रकृति:</span> {patient.clinicalHistory.ayushAssessment.prakriti || 'N/A'}</div>
                  <div><span className="text-amber-300 font-bold">अग्नि:</span> {patient.clinicalHistory.ayushAssessment.agni || 'N/A'}</div>
                  <div><span className="text-amber-300 font-bold">कोष्ठ:</span> {patient.clinicalHistory.ayushAssessment.koshtha || 'N/A'}</div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Physician Governance Controls & Rx Pad */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 space-y-5 border-teal-500/30">
            
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-teal-400" />
              <span>चिकित्सक निर्णय एवं प्रिस्क्रिप्शन (Physician Rx)</span>
            </h2>

            {/* Governance Action Switcher */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">
                1. क्लिनिकल केस ड्राफ्ट निर्णय (Governance Decision):
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setGovernanceAction('Accepted')}
                  className={`touch-target p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    governanceAction === 'Accepted'
                      ? 'bg-teal-500 text-slate-950 ring-2 ring-teal-300 shadow-md'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Accept</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGovernanceAction('Modified')}
                  className={`touch-target p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    governanceAction === 'Modified'
                      ? 'bg-amber-500 text-slate-950 ring-2 ring-amber-300 shadow-md'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <Edit3 className="w-4 h-4" />
                  <span>Modify</span>
                </button>

                <button
                  type="button"
                  onClick={() => setGovernanceAction('Rejected')}
                  className={`touch-target p-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                    governanceAction === 'Rejected'
                      ? 'bg-red-600 text-white ring-2 ring-red-300 shadow-md'
                      : 'bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <XCircle className="w-4 h-4" />
                  <span>Reject</span>
                </button>
              </div>
            </div>

            {/* Final Clinical Impression & Diagnosis */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">
                2. अंतिम निदान (Final Physician Diagnosis):
              </label>
              <input
                type="text"
                value={finalDiagnosis}
                onChange={(e) => setFinalDiagnosis(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:border-teal-400 focus:outline-none"
              />
            </div>

            {/* Physician Notes & Plan */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase text-slate-400">
                3. डॉक्टर की क्लिनिकल टिप्पणी (Doctor's Notes & Advice):
              </label>
              <textarea
                rows={3}
                value={physicianNotes}
                onChange={(e) => setPhysicianNotes(e.target.value)}
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 focus:border-teal-400 focus:outline-none"
              />
            </div>

            {/* Prescription Pad */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase text-teal-400">
                  4. दवा पर्चा (Prescription Pad):
                </span>
              </div>

              <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                {prescriptionList.map((item, idx) => (
                  <div key={idx} className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="font-bold text-white">{item.drug}</span> {item.dosage}{' '}
                      <span className="text-teal-400 font-mono">[{item.timing}]</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedication(idx)}
                      className="text-slate-500 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Drug Mini-Form */}
              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  placeholder="दवा का नाम (उदा. Tab Pantocid)"
                  value={newDrug}
                  onChange={(e) => setNewDrug(e.target.value)}
                  className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                />
                <input
                  type="text"
                  placeholder="Dose"
                  value={newDosage}
                  onChange={(e) => setNewDosage(e.target.value)}
                  className="w-20 bg-slate-800 border border-slate-700 rounded-xl px-2 py-1.5 text-xs text-white"
                />
                <button
                  type="button"
                  onClick={handleAddMedication}
                  className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Doctor Signature & Sign-Off Button */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              <div className="text-xs text-slate-400">
                हस्ताक्षरकर्ता: <span className="font-bold text-white">{physicianName}</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleSignOff(governanceAction)}
                  className="touch-target flex-1 py-3.5 bg-gradient-to-r from-teal-500 to-teal-400 hover:from-teal-400 text-slate-950 font-extrabold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-teal-500/25 transition-all hover:scale-105"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span>{isSignedOff ? 'साइन-ऑफ अपडेटेड ✓' : 'स्वीकार व साइन-ऑफ करें (Sign-Off)'}</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintSlip}
                  className="touch-target px-4 py-3.5 bg-slate-800 hover:bg-slate-750 text-teal-300 border border-teal-500/40 font-bold text-sm rounded-xl flex items-center justify-center gap-1.5 shadow-md"
                  title="Print OPD Consultation Slip"
                >
                  <Printer className="w-5 h-5" />
                  <span>Print Slip</span>
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>

      {/* Printable OPD Consultation Slip Modal / Print Component */}
      {isSignedOff && (
        <div className="p-6 rounded-2xl bg-white text-slate-950 shadow-2xl space-y-4 border border-slate-300 print:block">
          <div className="flex items-start justify-between pb-4 border-b-2 border-slate-900">
            <div>
              <div className="text-xl font-extrabold text-teal-900">
                ALL INDIA INSTITUTE OF AYURVEDA (AIIA)
              </div>
              <div className="text-xs text-slate-600">
                Ministry of Ayush, Govt. of India • OPD Case Record Slip
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold font-mono">OPD Slip #: {patient.id}</div>
              <div>Date: {new Date().toLocaleDateString()}</div>
              <div>ABHA ID: {patient.abhaId}</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-2 text-xs py-2 border-b border-slate-200">
            <div><strong>Patient:</strong> {patient.name}</div>
            <div><strong>Age/Gender:</strong> {patient.age}Y / {patient.gender}</div>
            <div><strong>Phone:</strong> {patient.phone}</div>
            <div><strong>Triage:</strong> {patient.triagePriority}</div>
          </div>

          <div className="space-y-2 text-xs">
            <div><strong>Chief Complaint:</strong> {patient.clinicalHistory.chiefComplaint}</div>
            <div><strong>Final Diagnosis:</strong> <span className="font-bold text-sm text-teal-950">{finalDiagnosis}</span></div>
            <div><strong>Physician Clinical Plan:</strong> {physicianNotes}</div>
          </div>

          <div className="pt-2">
            <div className="text-xs font-bold uppercase mb-1">Rx (Prescription):</div>
            <table className="w-full text-left text-xs border border-slate-300">
              <thead className="bg-slate-100 font-bold">
                <tr>
                  <th className="p-1.5 border border-slate-300">Medicine</th>
                  <th className="p-1.5 border border-slate-300">Dosage</th>
                  <th className="p-1.5 border border-slate-300">Timing</th>
                  <th className="p-1.5 border border-slate-300">Instructions</th>
                </tr>
              </thead>
              <tbody>
                {prescriptionList.map((rx, idx) => (
                  <tr key={idx}>
                    <td className="p-1.5 border border-slate-300 font-semibold">{rx.drug}</td>
                    <td className="p-1.5 border border-slate-300">{rx.dosage}</td>
                    <td className="p-1.5 border border-slate-300 font-mono">{rx.timing}</td>
                    <td className="p-1.5 border border-slate-300">{rx.instructions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-between items-end pt-6 text-xs text-slate-600">
            <div>
              <div className="text-[10px]">Digitally signed via MEDiMATE Clinical Intake Hub</div>
              <div className="text-[10px] text-slate-500">Notice: AI assisted pre-intake. Final clinical sign-off by registered practitioner.</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-slate-900">{physicianName}</div>
              <div className="text-[11px]">Consultant Physician, OPD AIIA</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
