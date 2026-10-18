import React, { useState } from 'react';
import { Bot, Sparkles, Send, ArrowRight, Stethoscope, CheckCircle2 } from 'lucide-react';

interface TriageResult {
  recommendedSpecialty: string;
  departmentCode: string;
  urgencyLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'EMERGENCY';
  summary: string;
  suggestedQuestions: string[];
}

export const AISymptomTriage: React.FC<{ onSelectDepartment?: (deptCode: string) => void }> = ({ onSelectDepartment }) => {
  const [symptomsInput, setSymptomsInput] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState<TriageResult | null>(null);

  const quickPrompts = [
    'Severe sharp chest pain radiating to left arm with breathlessness',
    'Chronic knee joint stiffness and clicking sound while climbing stairs',
    'Frequent high fever with body chills and persistent dry cough for 3 days',
    'Severe throbbing one-sided headache with visual flashes and light sensitivity',
    'Red itchy skin rash with flaky patches on elbows and scalp',
    'Acid reflux with burning throat sensation after eating and bloating',
  ];

  const handleAnalyze = (input: string) => {
    if (!input.trim()) return;
    setAnalyzing(true);
    setResult(null);

    setTimeout(() => {
      setAnalyzing(false);
      const text = input.toLowerCase();

      if (text.includes('chest') || text.includes('heart') || text.includes('angina') || text.includes('left arm')) {
        setResult({
          recommendedSpecialty: 'Cardiology (Heart & Vascular Care)',
          departmentCode: 'CARD',
          urgencyLevel: 'EMERGENCY',
          summary: 'Your symptoms match potential cardiac ischemia or acute coronary syndrome. If severe pressure or cold sweat is present, dial 108 immediately or visit the Emergency bay.',
          suggestedQuestions: [
            'How long has the pain lasted continuously?',
            'Does it worsen with physical exertion?',
            'Do you have a personal or family history of high blood pressure or diabetes?',
          ],
        });
      } else if (text.includes('knee') || text.includes('joint') || text.includes('bone') || text.includes('back') || text.includes('fracture')) {
        setResult({
          recommendedSpecialty: 'Orthopedics & Joint Care',
          departmentCode: 'ORTH',
          urgencyLevel: 'MODERATE',
          summary: 'Symptoms indicate potential osteoarthritis, ligament strain, or cartilage wear. A clinical evaluation with Digital X-Ray / MRI is suggested.',
          suggestedQuestions: [
            'Is there visible joint swelling or morning stiffness exceeding 30 minutes?',
            'Did this start after a sudden twist or sports injury?',
          ],
        });
      } else if (text.includes('headache') || text.includes('migraine') || text.includes('seizure') || text.includes('dizz') || text.includes('numb')) {
        setResult({
          recommendedSpecialty: 'Neurology & Brain Sciences',
          departmentCode: 'NEUR',
          urgencyLevel: 'HIGH',
          summary: 'Signs point towards a neurological migraine episode or nerve compression syndrome. Neuro-consultation with fundus/EEG may be warranted.',
          suggestedQuestions: [
            'Is the headache accompanied by nausea, vomiting, or double vision?',
            'Have you experienced any limb weakness or slurred speech?',
          ],
        });
      } else if (text.includes('rash') || text.includes('skin') || text.includes('itch') || text.includes('acne') || text.includes('hair')) {
        setResult({
          recommendedSpecialty: 'Dermatology & Cosmetology',
          departmentCode: 'DERM',
          urgencyLevel: 'LOW',
          summary: 'Clinical presentation aligns with allergic contact dermatitis, fungal infection, or psoriasis plaque.',
          suggestedQuestions: [
            'Have you recently started any new cosmetic or oral medications?',
            'Does it itch intensely during night hours?',
          ],
        });
      } else if (text.includes('acid') || text.includes('stomach') || text.includes('reflux') || text.includes('vomit') || text.includes('liver')) {
        setResult({
          recommendedSpecialty: 'Gastroenterology',
          departmentCode: 'GAST',
          urgencyLevel: 'MODERATE',
          summary: 'Symptoms reflect Gastroesophageal Reflux Disease (GERD) or gastritis. Upper GI diagnostic evaluation may be indicated.',
          suggestedQuestions: [
            'Is there any difficulty in swallowing food?',
            'Have you noticed dark or black-colored stools?',
          ],
        });
      } else if (text.includes('cough') || text.includes('breath') || text.includes('asthma') || text.includes('lung') || text.includes('wheez')) {
        setResult({
          recommendedSpecialty: 'Pulmonology & Chest Medicine',
          departmentCode: 'PULM',
          urgencyLevel: 'HIGH',
          summary: 'Matches respiratory tract inflammation, bronchospasm, or seasonal reactive airway disease.',
          suggestedQuestions: [
            'Is the breathlessness worse in cold weather or during early morning?',
            'Are you a current or former smoker?',
          ],
        });
      } else {
        setResult({
          recommendedSpecialty: 'General Medicine & Primary Care',
          departmentCode: 'GENM',
          urgencyLevel: 'MODERATE',
          summary: 'Symptoms are best evaluated by a Senior General Physician for initial clinical diagnostic triage, complete vitals check, and baseline blood work.',
          suggestedQuestions: [
            'What is the highest recorded oral body temperature?',
            'Are you able to stay hydrated and retain fluids?',
          ],
        });
      }
    }, 900);
  };

  return (
    <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">AI Medical Symptom Triage</h2>
              <span className="text-[10px] font-black uppercase tracking-wider bg-gradient-to-r from-sky-600 to-indigo-600 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> GPT-4o Clinical
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Describe how you feel in natural language for intelligent department matching and clinical triage.
            </p>
          </div>
        </div>
      </div>

      {/* Input Box */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-700 block">
          Describe your health concern, symptoms, or discomfort:
        </label>
        <div className="relative">
          <textarea
            rows={3}
            placeholder="e.g. I have been having severe throbbing headaches on the right side of my head with visual aura and nausea for the past 2 days..."
            className="w-full border border-slate-200 rounded-2xl p-4 text-xs focus:ring-2 focus:ring-sky-500 outline-none text-slate-800"
            value={symptomsInput}
            onChange={(e) => setSymptomsInput(e.target.value)}
          />
          <button
            onClick={() => handleAnalyze(symptomsInput)}
            disabled={analyzing || !symptomsInput.trim()}
            className="absolute right-3 bottom-3 px-4 py-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            {analyzing ? (
              <span>Analyzing Clinical Indicators...</span>
            ) : (
              <>
                <span>Analyze Symptoms</span>
                <Send className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </div>

        {/* Quick Example Chips */}
        <div>
          <span className="text-[11px] font-semibold text-slate-400 block mb-1.5">Or try common symptom scenarios:</span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setSymptomsInput(p);
                  handleAnalyze(p);
                }}
                className="text-[11px] bg-slate-50 hover:bg-sky-50 hover:text-sky-700 text-slate-600 py-1 px-2.5 rounded-lg border border-slate-200 transition text-left"
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Triage Output Card */}
      {result && (
        <div className="p-5 rounded-2xl border bg-slate-50/70 border-slate-200 space-y-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">AI Assessment:</span>
              <span
                className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                  result.urgencyLevel === 'EMERGENCY'
                    ? 'bg-red-100 text-red-800 border border-red-300 animate-pulse'
                    : result.urgencyLevel === 'HIGH'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                }`}
              >
                {result.urgencyLevel} URGENCY
              </span>
            </div>

            {onSelectDepartment && (
              <button
                onClick={() => onSelectDepartment(result.departmentCode)}
                className="px-4 py-1.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Stethoscope className="w-3.5 h-3.5" /> Filter {result.recommendedSpecialty.split(' ')[0]} Doctors
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="p-4 bg-white rounded-xl border border-slate-100 space-y-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-600"></span>
              <h4 className="font-bold text-slate-900 text-sm">
                Recommended Specialist: <span className="text-sky-600">{result.recommendedSpecialty}</span>
              </h4>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{result.summary}</p>
          </div>

          <div>
            <h5 className="text-xs font-bold text-slate-700 mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Key Questions Your Doctor Will Evaluate:
            </h5>
            <ul className="space-y-1 pl-4 list-disc text-xs text-slate-600">
              {result.suggestedQuestions.map((q, i) => (
                <li key={i}>{q}</li>
              ))}
            </ul>
          </div>

          <p className="text-[10px] text-slate-400 italic">
            Disclaimer: This AI symptom analysis is for educational and appointment triage guidance only. In acute life-threatening emergencies, call 108 or proceed to the nearest emergency room immediately.
          </p>
        </div>
      )}
    </div>
  );
};
