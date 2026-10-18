import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  X,
  Minimize2,
  Maximize2,
  Stethoscope,
  ArrowRight,
  User,
  RotateCcw,
  TestTube,
  FileCheck
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'ai' | 'user';
  text: string;
  timestamp: string;
  triageCard?: {
    specialty: string;
    departmentCode: string;
    urgency: 'EMERGENCY' | 'HIGH' | 'MODERATE' | 'LOW';
    differentialDiagnosis: string;
    recommendedDiagnostics: string[];
    immediateAction: string;
    doctorName: string;
    roomNumber: string;
    consultationFeeINR: number;
  };
}

interface FloatingAIChatProps {
  onBookSpecialist: (departmentCode: string) => void;
}

export const FloatingAIChat: React.FC<FloatingAIChatProps> = ({ onBookSpecialist }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'm-init',
      sender: 'ai',
      text: 'Greetings. I am Dr. CareAI, your Clinical Triage & Diagnostic Intelligence Specialist. Describe any symptoms, pain location, onset duration, or lab abnormalities in natural language. I will conduct a multi-system differential triage and recommend appropriate clinical specialists and lab workups.',
      timestamp: 'Just now',
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadCount(0);
    }
  }, [messages, isOpen]);

  const advancedQuickPrompts = [
    'Crushing retrosternal chest pain with left shoulder radiation & diaphoresis',
    'Severe unilateral throbbing migraine with scintillating scotoma & nausea',
    'Crepitus and deep medial joint pain in right knee during stair descent',
    'Persistent dry cough, nocturnal wheezing & SpO2 dropping to 92%',
    'Epigastric burning pain, postprandial dyspepsia & acid regurgitation',
    'Pruritic erythematous plaques with silvery scales on extensor elbows',
    'Polydipsia, polyuria, unexplained 4kg weight loss & random glucose 260 mg/dL',
    'Sudden unilateral facial droop, slurred speech & arm weakness',
  ];

  // Advanced Clinical Diagnostic Knowledge Engine
  const advancedClinicalInference = (query: string): ChatMessage => {
    const q = query.toLowerCase();
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. STROKE / CEREBROVASCULAR ACCIDENT (FAST PROTOCOL)
    if (
      q.includes('droop') ||
      q.includes('slur') ||
      q.includes('facial') ||
      q.includes('stroke') ||
      (q.includes('arm') && q.includes('weakness'))
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'CRITICAL ALERT: Your symptoms match the BE-FAST acute stroke algorithm (unilateral facial paresis, speech dysarthria, motor deficit). This is a time-critical neurological emergency where every minute preserves brain tissue.',
        timestamp: time,
        triageCard: {
          specialty: 'Neurology & Neurovascular Stroke Care',
          departmentCode: 'NEUR',
          urgency: 'EMERGENCY',
          differentialDiagnosis: 'Acute Ischemic Stroke / Transient Ischemic Attack (TIA)',
          recommendedDiagnostics: ['Brain CT/MRI with Angiogram', 'Carotid Doppler', 'ECG for Atrial Fibrillation'],
          immediateAction: 'Immediately alert CareFlow Emergency (SOS 108) for thrombolysis window evaluation within 4.5 hours.',
          doctorName: 'Dr. Vikram Singhania / Dr. Elena Rostova',
          roomNumber: 'Neuro Critical Bay / Suite 418',
          consultationFeeINR: 1800,
        },
      };
    }

    // 2. ACUTE CORONARY SYNDROME / CARDIAC ISCHEMIA
    if (
      q.includes('retrosternal') ||
      q.includes('chest') ||
      q.includes('angina') ||
      q.includes('heart') ||
      q.includes('diaphoresis') ||
      (q.includes('left') && (q.includes('arm') || q.includes('jaw')))
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Clinical analysis indicates acute myocardial ischemia or unstable angina. The presence of radiation and diaphoresis (cold sweats) strongly signals coronary hypoperfusion requiring urgent rule-out.',
        timestamp: time,
        triageCard: {
          specialty: 'Interventional Cardiology & Coronary Care',
          departmentCode: 'CARD',
          urgency: 'EMERGENCY',
          differentialDiagnosis: 'Acute Coronary Syndrome (STEMI / NSTEMI) vs Microvascular Angina',
          recommendedDiagnostics: ['12-Lead ECG Stat', 'High-Sensitivity Serum Troponin-I', '2D Echocardiogram with EF%'],
          immediateAction: 'Refrain from physical strain. Take Aspirin 300mg chewable if advised and proceed to ER Bay immediately.',
          doctorName: 'Dr. Marcus Vance',
          roomNumber: 'Cardiology Clinic Suite 302',
          consultationFeeINR: 1200,
        },
      };
    }

    // 3. RESPIRATORY & PULMONARY DISTRESS
    if (
      q.includes('spo2') ||
      q.includes('wheez') ||
      q.includes('breath') ||
      q.includes('asthma') ||
      q.includes('cough') ||
      q.includes('copd') ||
      q.includes('lung')
    ) {
      const isHypoxic = q.includes('92') || q.includes('90') || q.includes('8') || q.includes('breathless');
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Differential diagnosis flags acute reactive bronchospasm, asthma exacerbation, or interstitial pulmonary parenchymal involvement. Oxygenation saturation must be vigilantly monitored.',
        timestamp: time,
        triageCard: {
          specialty: 'Pulmonology & Interventional Respiratory Medicine',
          departmentCode: 'PULM',
          urgency: isHypoxic ? 'HIGH' : 'MODERATE',
          differentialDiagnosis: 'Bronchial Asthma Flare / COPD with Bronchospasm',
          recommendedDiagnostics: ['Spirometry (PFT)', 'High-Resolution Chest CT', 'Digital Chest X-Ray PA View'],
          immediateAction: 'Initiate prescribed rescue bronchodilator (Levosalbutamol/Ipratropium). If SpO2 remains < 93%, seek oxygenation.',
          doctorName: 'Dr. Siddharth Menon',
          roomNumber: 'Pulmonology Suite 220',
          consultationFeeINR: 950,
        },
      };
    }

    // 4. NEUROLOGY: COMPLEX MIGRAINE / CEPHALALGIA
    if (
      q.includes('scotoma') ||
      q.includes('migraine') ||
      q.includes('headache') ||
      q.includes('aura') ||
      q.includes('seizure') ||
      q.includes('photophobia')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Findings align with classical migraine with visual aura (scintillating scotoma) or trigeminal autonomic cephalalgia. Intracranial vascular spasms often precede the throbbing hemicrania.',
        timestamp: time,
        triageCard: {
          specialty: 'Clinical Neurology & Epilepsy Care',
          departmentCode: 'NEUR',
          urgency: 'MODERATE',
          differentialDiagnosis: 'Migraine with Cortical Spreading Aura vs Cervicogenic Cephalalgia',
          recommendedDiagnostics: ['Electroencephalogram (EEG)', 'MRI Brain with Contrast', 'Fundoscopy for Papilledema'],
          immediateAction: 'Rest in a darkened, sound-damped room. Hydrate and avoid triptans if uncontrolled hypertension exists.',
          doctorName: 'Dr. Elena Rostova',
          roomNumber: 'Neurology Suite 415',
          consultationFeeINR: 1500,
        },
      };
    }

    // 5. ORTHOPEDICS: ARTHRITIS & LIGAMENTOUS INJURY
    if (
      q.includes('crepitus') ||
      q.includes('knee') ||
      q.includes('joint') ||
      q.includes('acl') ||
      q.includes('meniscus') ||
      q.includes('spine') ||
      q.includes('cartilage')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'The presence of articular crepitus, pain during eccentric loading (stair descent), and joint line tenderness points to degenerative knee osteoarthritis (Kellgren-Lawrence Grade II-III) or meniscal tear.',
        timestamp: time,
        triageCard: {
          specialty: 'Orthopedics & Joint Reconstruction Surgery',
          departmentCode: 'ORTH',
          urgency: 'MODERATE',
          differentialDiagnosis: 'Tibiofemoral Osteoarthritis / Medial Meniscus Fraying',
          recommendedDiagnostics: ['Weight-bearing Bilateral Knee X-Rays', 'High-Tesla Knee Joint MRI', 'Serum Uric Acid / ESR'],
          immediateAction: 'Avoid deep squats and stairs. Apply cold compression for 15 minutes and consider knee bracing.',
          doctorName: 'Dr. David Chen',
          roomNumber: 'Orthopedic Suite 108',
          consultationFeeINR: 1000,
        },
      };
    }

    // 6. GASTROENTEROLOGY & ACID-PEPTIC DISORDERS
    if (
      q.includes('epigastric') ||
      q.includes('postprandial') ||
      q.includes('acid') ||
      q.includes('reflux') ||
      q.includes('heartburn') ||
      q.includes('dyspepsia') ||
      q.includes('stomach')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Symptom constellation indicates chronic Gastroesophageal Reflux Disease (GERD) with reflux esophagitis or Helicobacter pylori-associated gastritis with impaired gastric emptying.',
        timestamp: time,
        triageCard: {
          specialty: 'Medical Gastroenterology & Endoscopy',
          departmentCode: 'GAST',
          urgency: 'MODERATE',
          differentialDiagnosis: 'Reflux Esophagitis (Los Angeles Grade B) / Peptic Ulcer Disease',
          recommendedDiagnostics: ['Upper GI Video Endoscopy (OGD)', 'H. Pylori Stool Antigen', 'Liver Function Panel (LFT)'],
          immediateAction: 'Elevate head of bed by 15 cm. Avoid late meals within 3 hours of sleep and high-fat foods.',
          doctorName: 'Dr. Rajesh Iyer',
          roomNumber: 'Gastroenterology Suite 310',
          consultationFeeINR: 1300,
        },
      };
    }

    // 7. ENDOCRINOLOGY & DIABETOLOGY
    if (
      q.includes('glucose') ||
      q.includes('polydipsia') ||
      q.includes('polyuria') ||
      q.includes('sugar') ||
      q.includes('diabet') ||
      q.includes('thyroid') ||
      q.includes('hba1c')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Osmotic polyuria, polydipsia, and marked weight loss in the presence of random blood sugar > 200 mg/dL represents frank secondary insulin deficiency or uncontrolled Type 2 Diabetes Mellitus.',
        timestamp: time,
        triageCard: {
          specialty: 'Endocrinology & Diabetology',
          departmentCode: 'ENDO',
          urgency: 'HIGH',
          differentialDiagnosis: 'Decompensated Type 2 Diabetes Mellitus / Diabetic Ketoacidosis rule-out',
          recommendedDiagnostics: ['HbA1c Glycated Hemoglobin', 'Fasting & Post-Prandial Blood Sugar', 'Urine Ketone Body Test'],
          immediateAction: 'Maintain liberal oral hydration. Avoid refined carbohydrates and check urine ketones if nauseated.',
          doctorName: 'Dr. Neha Verma',
          roomNumber: 'Endocrinology Suite 315',
          consultationFeeINR: 1200,
        },
      };
    }

    // 8. DERMATOLOGY: CHRONIC PLAQUE PSORIASIS / ECZEMA
    if (
      q.includes('silvery') ||
      q.includes('erythematous') ||
      q.includes('plaque') ||
      q.includes('psoriasis') ||
      q.includes('eczema') ||
      q.includes('rash') ||
      q.includes('itch')
    ) {
      return {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: 'Erythematous plaques with distinct micaceous silvery scales on extensor surfaces (elbows, knees) are pathognomonic for Chronic Plaque Psoriasis (Psoriasis vulgaris).',
        timestamp: time,
        triageCard: {
          specialty: 'Dermatology & Dermatosurgery',
          departmentCode: 'DERM',
          urgency: 'LOW',
          differentialDiagnosis: 'Psoriasis Vulgaris vs Lichen Planus vs Nummular Eczema',
          recommendedDiagnostics: ['Dermoscopy Examination', 'Skin Punch Biopsy (if atypical)', 'Serum Uric Acid & Lipid Panel'],
          immediateAction: 'Apply bland liquid paraffin or ceramide moisturizer immediately post-bath. Do not mechanically peel scales.',
          doctorName: 'Dr. Sneha Kulkarni',
          roomNumber: 'Dermatology Suite 115',
          consultationFeeINR: 850,
        },
      };
    }

    // DEFAULT: GENERAL INTERNAL MEDICINE
    return {
      id: `ai-${Date.now()}`,
      sender: 'ai',
      text: 'Your reported clinical symptoms suggest a systemic medical state requiring a comprehensive multisystem physical exam, core metabolic profile, and vital triage.',
      timestamp: time,
      triageCard: {
        specialty: 'General Medicine & Primary Health Triage',
        departmentCode: 'GENM',
        urgency: 'MODERATE',
        differentialDiagnosis: 'Acute Febrile Syndrome / Systemic Viral Illness',
        recommendedDiagnostics: ['Complete Blood Count (CBC) with ESR', 'Urine Routine & Microscopic', 'Basic Metabolic Panel (KFT)'],
        immediateAction: 'Record temperature log morning and night. Ensure adequate oral rehydration fluids and rest.',
        doctorName: 'Dr. Arjun Patel',
        roomNumber: 'Internal Medicine Suite 102',
        consultationFeeINR: 650,
      },
    };
  };

  const handleSend = (presetQuery?: string) => {
    const text = presetQuery || input;
    if (!text.trim()) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: time,
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!presetQuery) setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const inference = advancedClinicalInference(text);
      setMessages((prev) => [...prev, inference]);
      setIsTyping(false);
    }, 700);
  };

  const resetChat = () => {
    setMessages([
      {
        id: 'm-init',
        sender: 'ai',
        text: 'Greetings. I am Dr. CareAI. How can I assist you with your clinical diagnosis or department matching today?',
        timestamp: 'Just now',
      },
    ]);
  };

  return (
    <>
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 text-white p-4 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 border-2 border-white/20 ring-4 ring-sky-500/20"
        >
          <div className="relative">
            <Bot className="w-6 h-6 animate-pulse" />
            {unreadCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-500 text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                1
              </span>
            )}
          </div>
          <span className="font-bold text-xs pr-1 hidden sm:inline-block">Dr. CareAI Triage</span>
        </button>
      )}

      {/* Floating Interactive Chat Modal */}
      {isOpen && (
        <div
          className={`fixed bottom-6 right-6 z-50 bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col transition-all duration-200 ease-out ${
            isMinimized
              ? 'w-80 h-16'
              : 'w-[94vw] sm:w-[440px] h-[600px] max-h-[88vh]'
          }`}
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-blue-700 p-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                <Bot className="w-5 h-5 text-sky-200" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="font-bold text-sm">Dr. CareAI Clinical Engine</h3>
                  <span className="text-[8px] bg-emerald-400 text-emerald-950 font-black px-1.5 py-0.5 rounded-full uppercase">
                    PRO v4.5
                  </span>
                </div>
                <p className="text-[10px] text-sky-100">Differential Triage & Doctor Referral</p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              <button
                onClick={resetChat}
                title="Reset Conversation"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsMinimized(!isMinimized)}
                title={isMinimized ? 'Expand' : 'Minimize'}
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                title="Close"
                className="p-1.5 hover:text-white hover:bg-white/10 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Chat Body */}
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-slate-50/70 text-xs">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 mb-1 px-1">
                      {msg.sender === 'ai' ? (
                        <span className="font-bold text-sky-600 flex items-center gap-1">
                          <Bot className="w-3 h-3" /> Dr. CareAI
                        </span>
                      ) : (
                        <span className="font-bold text-slate-600 flex items-center gap-1">
                          <User className="w-3 h-3" /> You
                        </span>
                      )}
                      <span>• {msg.timestamp}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl max-w-[90%] leading-relaxed ${
                        msg.sender === 'user'
                          ? 'bg-sky-600 text-white rounded-tr-none shadow-sm'
                          : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-none shadow-xs'
                      }`}
                    >
                      <p>{msg.text}</p>

                      {/* Advanced Diagnostic Triage Card */}
                      {msg.triageCard && (
                        <div className="mt-3 p-3.5 bg-slate-50/90 rounded-2xl border border-slate-200 space-y-2.5">
                          {/* Specialty & Urgency Badge */}
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <span className="text-[10px] text-slate-400 font-bold uppercase block">Recommended Branch</span>
                              <span className="font-bold text-slate-900 text-xs flex items-center gap-1">
                                <Stethoscope className="w-3.5 h-3.5 text-sky-600 shrink-0" />
                                {msg.triageCard.specialty}
                              </span>
                            </div>
                            <span
                              className={`text-[9px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                                msg.triageCard.urgency === 'EMERGENCY'
                                  ? 'bg-red-100 text-red-800 border border-red-200 animate-pulse'
                                  : msg.triageCard.urgency === 'HIGH'
                                  ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {msg.triageCard.urgency} PRIORITY
                            </span>
                          </div>

                          {/* Differential Diagnosis */}
                          <div className="p-2.5 bg-white rounded-xl border border-slate-100 text-[11px]">
                            <span className="font-bold text-slate-900 block flex items-center gap-1">
                              <FileCheck className="w-3.5 h-3.5 text-indigo-600" /> Differential Diagnosis:
                            </span>
                            <span className="text-slate-700 font-medium">{msg.triageCard.differentialDiagnosis}</span>
                          </div>

                          {/* Recommended Diagnostics */}
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1 mb-1">
                              <TestTube className="w-3 h-3 text-teal-600" /> Recommended Lab Workup:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {msg.triageCard.recommendedDiagnostics.map((lab, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] bg-white border border-slate-200 text-slate-700 px-2 py-0.5 rounded-md font-medium"
                                >
                                  {lab}
                                </span>
                              ))}
                            </div>
                          </div>

                          {/* Immediate Action advice */}
                          <div className="text-[11px] text-slate-600 bg-sky-50/70 p-2 rounded-xl border border-sky-100">
                            <span className="font-bold text-sky-950 block">Clinical Guidance:</span>
                            <span>{msg.triageCard.immediateAction}</span>
                          </div>

                          {/* Doctor Match & 1-Click Scheduling */}
                          <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                            <div>
                              <span className="font-bold text-slate-900 block">{msg.triageCard.doctorName}</span>
                              <span className="text-slate-500 text-[10px]">{msg.triageCard.roomNumber} • Fee: ₹{msg.triageCard.consultationFeeINR}</span>
                            </div>
                            <button
                              onClick={() => {
                                onBookSpecialist(msg.triageCard!.departmentCode);
                                setIsOpen(false);
                              }}
                              className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-[11px] rounded-xl transition flex items-center gap-1 shadow-sm"
                            >
                              <span>Book Slot</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isTyping && (
                  <div className="flex items-center gap-2 p-2.5 bg-white border border-slate-200 rounded-xl w-36 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-sky-500 animate-bounce"></span>
                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]"></span>
                    <span className="text-[10px] text-slate-400 font-semibold ml-1">Differential Run...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Advanced Clinical Chips */}
              <div className="p-2 border-t border-slate-100 bg-white overflow-x-auto flex gap-1.5 shrink-0 scrollbar-none">
                {advancedQuickPrompts.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(chip)}
                    className="whitespace-nowrap px-2.5 py-1 rounded-full bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-[10px] font-medium text-slate-600 border border-slate-200 transition"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Bar */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="p-3 border-t border-slate-200 bg-white flex gap-2 shrink-0"
              >
                <input
                  type="text"
                  placeholder="Describe medical complaints, pain, vitals..."
                  className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-sky-500 text-slate-800"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="p-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl transition shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          )}
        </div>
      )}
    </>
  );
};
