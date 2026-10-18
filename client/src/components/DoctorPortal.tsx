import React, { useState, useEffect } from 'react';
import { PhoneCall, CheckCircle2, FileText, Bell, SkipForward, Download } from 'lucide-react';
import { api } from '../services/api';
import { getSocket } from '../services/socket';
import { generatePrescriptionPDF } from '../utils/prescriptionPdf';

interface DoctorPortalProps {
  user: any;
  token: string;
}

export const DoctorPortal: React.FC<DoctorPortalProps> = ({ user, token }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [selectedAppt, setSelectedAppt] = useState<any | null>(null);
  const [loading, setLoading] = useState(false);

  // EMR & Prescription form state
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [clinicalNotes, setClinicalNotes] = useState('');
  const [prescription, setPrescription] = useState('');
  const [labOrders, setLabOrders] = useState('');
  const [savingNote, setSavingNote] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadDoctorAppointments();

    const socket = getSocket();
    if (user.doctorProfile?.id) {
      socket.emit('join_doctor_queue', user.doctorProfile.id);
      socket.on('queue_updated', loadDoctorAppointments);
    }

    return () => {
      socket.off('queue_updated', loadDoctorAppointments);
    };
  }, []);

  const loadDoctorAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments/my', token);
      if (res.success) {
        setAppointments(res.data);
        if (res.data.length > 0 && !selectedAppt) {
          selectAppointment(res.data[0]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const selectAppointment = (appt: any) => {
    setSelectedAppt(appt);
    if (appt.consultationNote) {
      setChiefComplaint(appt.consultationNote.chiefComplaint || '');
      setDiagnosis(appt.consultationNote.diagnosis || '');
      setClinicalNotes(appt.consultationNote.clinicalNotes || '');
      setPrescription(appt.consultationNote.prescription || '');
      setLabOrders(appt.consultationNote.labOrders || '');
    } else {
      setChiefComplaint(appt.reason || '');
      setDiagnosis('');
      setClinicalNotes('');
      setPrescription('');
      setLabOrders('');
    }
  };

  const updateTokenStatus = async (tokenId: string, status: string) => {
    try {
      const res = await api.patch(`/queue/token/${tokenId}/status`, { status }, token);
      if (res.success) {
        setMessage(`Status updated to ${status}`);
        loadDoctorAppointments();
      }
    } catch (err: any) {
      setMessage(err.message || 'Failed to update token status');
    }
  };

  const handleSaveConsultation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAppt) return;
    setSavingNote(true);
    setMessage('');

    try {
      const payload = {
        appointmentId: selectedAppt.id,
        chiefComplaint,
        diagnosis,
        clinicalNotes,
        prescription,
        labOrders,
      };

      const res = await api.post('/consultations', payload, token);
      if (res.success) {
        setMessage('✅ Consultation clinical notes & prescription recorded. Patient status set to Completed!');
        loadDoctorAppointments();
      }
    } catch (err: any) {
      setMessage(err.message || 'Failed to save notes');
    } finally {
      setSavingNote(false);
    }
  };

  const handleDownloadPDF = () => {
    if (!selectedAppt) return;
    generatePrescriptionPDF({
      doctorName: `${user.firstName} ${user.lastName}`,
      doctorSpecialty: user.doctorProfile?.specialization || 'Consultant',
      doctorQualification: user.doctorProfile?.qualification || 'MD',
      roomNumber: user.doctorProfile?.roomNumber || 'Room 101',
      patientName: `${selectedAppt.patient.user.firstName} ${selectedAppt.patient.user.lastName}`,
      tokenNumber: selectedAppt.queueToken?.tokenNumber || 'N/A',
      appointmentDate: new Date(selectedAppt.appointmentDate).toISOString().split('T')[0],
      chiefComplaint,
      diagnosis,
      clinicalNotes,
      prescription,
      labOrders,
    });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Doctor Clinical Suite</span>
          <h2 className="text-xl font-bold text-slate-900">
            Welcome, Dr. {user.firstName} {user.lastName} ({user.doctorProfile?.department?.name || 'OPD'})
          </h2>
          <p className="text-xs text-slate-500">
            Room: {user.doctorProfile?.roomNumber} • Standard Slot: 15 mins
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Clinic Active
          </span>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-medium flex items-center gap-2">
          <Bell className="w-4 h-4 text-sky-600" />
          <span>{message}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Queue / Appointments */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm">Consultation Roster</h3>
            <span className="text-xs text-slate-500 font-semibold">{appointments.length} patients</span>
          </div>

          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {appointments.length === 0 && !loading && (
              <p className="text-xs text-slate-400 py-8 text-center">No appointments scheduled for you yet.</p>
            )}

            {appointments.map((appt) => {
              const isSelected = selectedAppt?.id === appt.id;
              const tokenStatus = appt.queueToken?.status || appt.status;

              return (
                <div
                  key={appt.id}
                  onClick={() => selectAppointment(appt)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'border-sky-500 bg-sky-50/50 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                      #{appt.queueToken?.tokenNumber || 'NO-TOKEN'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-500">{appt.startTime}</span>
                  </div>

                  <p className="font-bold text-slate-900 text-sm mt-1.5">
                    {appt.patient.user.firstName} {appt.patient.user.lastName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{appt.reason || 'General Visit'}</p>

                  <div className="mt-2.5 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px]">
                    <span
                      className={`font-semibold px-2 py-0.5 rounded-full ${
                        tokenStatus === 'CALLED'
                          ? 'bg-amber-100 text-amber-800'
                          : tokenStatus === 'COMPLETED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {tokenStatus}
                    </span>
                    <span className="text-slate-400">{appt.consultationType}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Columns: Live Examination & Electronic Medical Record (EMR) Note */}
        <div className="lg:col-span-2 space-y-6">
          {selectedAppt ? (
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6">
              {/* Patient Banner & Queue Triggers */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      {selectedAppt.patient.user.firstName} {selectedAppt.patient.user.lastName}
                    </h3>
                    <span className="text-xs font-black px-2 py-0.5 rounded bg-sky-600 text-white">
                      Token #{selectedAppt.queueToken?.tokenNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">
                    Blood Group: {selectedAppt.patient.bloodGroup || 'Not provided'} • Phone: {selectedAppt.patient.user.phone || 'N/A'}
                  </p>
                  {selectedAppt.patient.medicalAlerts && (
                    <p className="text-xs font-semibold text-rose-600 mt-1">
                      ⚠️ Medical Alert: {selectedAppt.patient.medicalAlerts}
                    </p>
                  )}
                </div>

                {/* Queue Control Buttons */}
                <div className="flex items-center gap-2">
                  {selectedAppt.queueToken && (
                    <>
                      <button
                        type="button"
                        onClick={() => updateTokenStatus(selectedAppt.queueToken.id, 'CALLED')}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                      >
                        <PhoneCall className="w-3.5 h-3.5" /> Call Patient
                      </button>
                      <button
                        type="button"
                        onClick={() => updateTokenStatus(selectedAppt.queueToken.id, 'SKIPPED')}
                        className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-xl transition flex items-center gap-1.5"
                      >
                        <SkipForward className="w-3.5 h-3.5" /> Mark No-Show
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
                    title="Generate and Download official PDF prescription"
                  >
                    <Download className="w-3.5 h-3.5" /> Export PDF Rx
                  </button>
                </div>
              </div>

              {/* Clinical Documentation Form */}
              <form onSubmit={handleSaveConsultation} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Chief Complaint</label>
                    <input
                      required
                      type="text"
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                      value={chiefComplaint}
                      onChange={(e) => setChiefComplaint(e.target.value)}
                      placeholder="e.g. Chest pain radiating to left arm for 2 days"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Clinical Diagnosis</label>
                    <input
                      required
                      type="text"
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                      value={diagnosis}
                      onChange={(e) => setDiagnosis(e.target.value)}
                      placeholder="e.g. Stable Angina / Mild Hypertension"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Doctor's Examination & Clinical Notes
                  </label>
                  <textarea
                    rows={3}
                    className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                    value={clinicalNotes}
                    onChange={(e) => setClinicalNotes(e.target.value)}
                    placeholder="Physical examination observations, vitals, heart sounds, ECG findings..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Prescription / Rx Medications
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none font-mono"
                      value={prescription}
                      onChange={(e) => setPrescription(e.target.value)}
                      placeholder="Tab. Amlodipine 5mg OD x 30 days&#10;Tab. Aspirin 75mg post-lunch"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">
                      Diagnostic Lab Orders & Investigations
                    </label>
                    <textarea
                      rows={3}
                      className="w-full border border-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                      value={labOrders}
                      onChange={(e) => setLabOrders(e.target.value)}
                      placeholder="Lipid Profile, HbA1c, 2D Echocardiogram..."
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3">
                  <button
                    type="button"
                    onClick={handleDownloadPDF}
                    className="text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1.5"
                  >
                    <Download className="w-4 h-4" /> Download Official Prescription (.PDF)
                  </button>

                  <button
                    type="submit"
                    disabled={savingNote}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition shadow-md flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {savingNote ? 'Finalizing EMR Record...' : 'Complete Visit & Save Medical Note'}
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-400">
              <FileText className="w-10 h-10 mx-auto text-slate-300 mb-2" />
              <p className="text-sm">Select an outpatient from the roster to view record and conduct consultation.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
