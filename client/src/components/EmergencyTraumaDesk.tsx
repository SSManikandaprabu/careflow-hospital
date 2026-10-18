import React, { useState } from 'react';
import { Ambulance, PhoneCall, AlertTriangle, ShieldAlert, HeartPulse, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmergencyRequest {
  id: string;
  patientName: string;
  phone: string;
  emergencyType: string;
  location: string;
  status: 'DISPATCHED' | 'EN_ROUTE' | 'ARRIVED';
  etaMinutes: number;
  ambulanceUnit: string;
}

export const EmergencyTraumaDesk: React.FC = () => {
  const [patientName, setPatientName] = useState('John Doe');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [emergencyType, setEmergencyType] = useState('Chest Pain / Suspected Cardiac Arrest');
  const [pickupAddress, setPickupAddress] = useState('Flat 402, Green Glen Heights, Ring Road, South City');
  const [activeSOS, setActiveSOS] = useState<EmergencyRequest | null>(null);
  const [loading, setLoading] = useState(false);

  // Active hospital fleet units
  const [fleet] = useState([
    { unit: 'CareFlow ALS Unit-01', base: 'Main Trauma Center', driver: 'Ramesh K.', doctorOnboard: 'Paramedic Dr. Priya', status: 'AVAILABLE' },
    { unit: 'CareFlow Cardiac Unit-02', base: 'North Pavilion', driver: 'Suresh V.', doctorOnboard: 'ER Specialist Dr. Ajay', status: 'ON_CALL' },
    { unit: 'CareFlow BLS Unit-03', base: 'West Outpatient Clinic', driver: 'Manoj T.', doctorOnboard: 'EMT Staff Nurse Anjali', status: 'AVAILABLE' },
  ]);

  const handleTriggerSOS = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setActiveSOS({
        id: `SOS-TRAUMA-${Date.now().toString().slice(-5)}`,
        patientName,
        phone,
        emergencyType,
        location: pickupAddress,
        status: 'DISPATCHED',
        etaMinutes: 8,
        ambulanceUnit: 'CareFlow Advanced Cardiac Life Support (ALS-01)',
      });

      confetti({
        particleCount: 80,
        spread: 80,
        origin: { y: 0.5 },
      });
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Critical Emergency Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-700 to-red-800 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center text-white ring-4 ring-white/20 animate-pulse">
            <HeartPulse className="w-8 h-8 text-rose-200" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded-full">
                24x7 CODE RED CRITICAL RESPONSE
              </span>
              <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping"></span>
            </div>
            <h2 className="text-xl md:text-2xl font-black mt-1">Hospital Emergency & Ambulance SOS Desk</h2>
            <p className="text-xs text-rose-100">
              Immediate Advanced Cardiac Life Support (ACLS) & Trauma Resuscitation Unit Dispatch.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="tel:108"
            className="px-5 py-3 bg-white text-red-700 hover:bg-rose-50 font-black text-sm rounded-2xl shadow-lg transition flex items-center gap-2 shrink-0"
          >
            <PhoneCall className="w-4 h-4 animate-bounce text-red-600" /> Dial 108 / 112 (Instant)
          </a>
        </div>
      </div>

      {/* Active Dispatched SOS Tracker */}
      {activeSOS && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-5 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-red-600 text-white flex items-center justify-center font-bold">
                <Ambulance className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-red-600 uppercase">Emergency Code: {activeSOS.id}</span>
                <h3 className="font-black text-slate-900 text-base">Ambulance Dispatched & En Route</h3>
                <p className="text-xs text-slate-600">{activeSOS.ambulanceUnit}</p>
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs text-slate-500 font-bold block">Estimated Arrival (GPS ETA)</span>
              <span className="text-2xl font-black text-red-600 animate-pulse">~{activeSOS.etaMinutes} Minutes</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-white rounded-xl border border-red-100 text-xs text-slate-700">
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Patient / Caller</span>
              <span className="font-bold text-slate-900">{activeSOS.patientName} ({activeSOS.phone})</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">Chief Emergency Condition</span>
              <span className="font-bold text-red-700">{activeSOS.emergencyType}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-semibold text-[10px] uppercase">GPS Pickup Location</span>
              <span className="font-bold text-slate-900 truncate block">{activeSOS.location}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
            <span className="flex items-center gap-1.5 text-emerald-600 font-bold">
              <Radio className="w-4 h-4 animate-spin text-emerald-600" /> Paramedic Live Telemetry Connected to ER Command
            </span>
            <button
              onClick={() => setActiveSOS(null)}
              className="text-xs text-slate-400 hover:text-slate-600 underline font-semibold"
            >
              Dismiss Alert
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: 1-Click SOS Dispatcher & Fleet Monitor */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 1-Click Emergency SOS Dispatch Form */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2 text-red-600 font-bold text-sm">
            <ShieldAlert className="w-5 h-5 text-red-600" /> Quick Ambulance Dispatch Request
          </div>
          <p className="text-xs text-slate-500">
            Transmits real-time GPS coordinates directly to the closest hospital paramedic bay.
          </p>

          <form onSubmit={handleTriggerSOS} className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Patient Name</label>
              <input
                required
                type="text"
                className="w-full border border-slate-200 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-red-500"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Emergency Contact Number</label>
              <input
                required
                type="tel"
                className="w-full border border-slate-200 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-red-500 font-mono"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Emergency Nature</label>
              <select
                value={emergencyType}
                onChange={(e) => setEmergencyType(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-red-500 bg-slate-50"
              >
                <option value="Chest Pain / Suspected Cardiac Arrest">Chest Pain / Suspected Cardiac Arrest</option>
                <option value="Severe Road Traffic Accident / Trauma">Severe Road Traffic Accident / Trauma</option>
                <option value="Stroke / Sudden Facial Droop / Paralysis">Stroke / Sudden Facial Droop / Paralysis</option>
                <option value="Severe Respiratory Distress / Asthma Attack">Severe Respiratory Distress / Asthma Attack</option>
                <option value="Obstetric / Labor & Maternity Emergency">Obstetric / Labor & Maternity Emergency</option>
                <option value="Unconscious / Seizure in Progress">Unconscious / Seizure in Progress</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Pickup Address & Landmark</label>
              <textarea
                required
                rows={3}
                className="w-full border border-slate-200 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-red-500"
                value={pickupAddress}
                onChange={(e) => setPickupAddress(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:bg-slate-300 text-white font-black text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2 tracking-wide uppercase"
            >
              <AlertTriangle className="w-4 h-4 animate-bounce" />
              {loading ? 'Transmitting to Emergency Bay...' : '🚨 Request Emergency Ambulance SOS'}
            </button>
          </form>
        </div>

        {/* Live Hospital Emergency Fleet Status */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Ambulance className="w-4 h-4 text-red-600" /> Hospital Emergency Fleet Monitor
            </h3>
            <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> GPS Telematics Active
            </span>
          </div>

          <div className="space-y-3">
            {fleet.map((unit, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-slate-900">{unit.unit}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        unit.status === 'AVAILABLE'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {unit.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Stationed at: <span className="font-semibold text-slate-700">{unit.base}</span>
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Crew: {unit.driver} (Driver) • {unit.doctorOnboard}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href="tel:108"
                    className="px-3 py-1.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-red-600" /> Contact Bay
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Triage Protocols Box */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-1.5">
            <p className="font-bold flex items-center gap-1">
              <AlertTriangle className="w-4 h-4 text-amber-600" /> Hospital Emergency Triage Protocol:
            </p>
            <p className="text-amber-800">
              For acute cardiac arrests or severe trauma, the ER resuscitation team is pre-notified 5 minutes prior to patient arrival via telemetric vitals broadcast.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
