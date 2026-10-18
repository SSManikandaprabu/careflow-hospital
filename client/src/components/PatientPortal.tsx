import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, Download, XCircle } from 'lucide-react';
import { api } from '../services/api';
import { generatePrescriptionPDF } from '../utils/prescriptionPdf';

interface PatientPortalProps {
  token: string;
  onNavigateToBooking: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({ token, onNavigateToBooking }) => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const res = await api.get('/appointments/my', token);
      if (res.success) {
        setAppointments(res.data);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    setCancellingId(id);
    try {
      const res = await api.patch(`/appointments/${id}/cancel`, {}, token);
      if (res.success) {
        setFeedback('Appointment cancelled successfully.');
        loadAppointments();
      }
    } catch (err: any) {
      setFeedback(err.message || 'Failed to cancel appointment');
    } finally {
      setCancellingId(null);
    }
  };

  const downloadRx = (appt: any) => {
    if (!appt.consultationNote) return;
    generatePrescriptionPDF({
      doctorName: `${appt.doctor.user.firstName} ${appt.doctor.user.lastName}`,
      doctorSpecialty: appt.doctor.specialization,
      doctorQualification: appt.doctor.qualification,
      roomNumber: appt.doctor.roomNumber,
      patientName: `${appt.patient.user.firstName} ${appt.patient.user.lastName}`,
      tokenNumber: appt.queueToken?.tokenNumber || 'N/A',
      appointmentDate: new Date(appt.appointmentDate).toISOString().split('T')[0],
      chiefComplaint: appt.consultationNote.chiefComplaint,
      diagnosis: appt.consultationNote.diagnosis,
      clinicalNotes: appt.consultationNote.clinicalNotes,
      prescription: appt.consultationNote.prescription,
      labOrders: appt.consultationNote.labOrders,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">Patient Health Records & Visits</span>
          <h2 className="text-xl font-bold text-slate-900">My Medical Appointments & Prescriptions</h2>
          <p className="text-xs text-slate-500">
            Track past visits, active OPD tokens, and download authorized digital prescriptions.
          </p>
        </div>

        <button
          onClick={onNavigateToBooking}
          className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
        >
          <Calendar className="w-4 h-4" /> Book New Consultation
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-sky-50 text-sky-800 border border-sky-200 rounded-xl text-xs font-medium">
          {feedback}
        </div>
      )}

      {/* Appointment History List */}
      <div className="space-y-4">
        {loading && (
          <div className="py-12 text-center text-slate-400">
            <Clock className="w-8 h-8 mx-auto animate-spin text-sky-500 mb-2" />
            <p className="text-xs">Loading your consultations...</p>
          </div>
        )}

        {!loading && appointments.length === 0 && (
          <div className="bg-white rounded-2xl p-12 border border-slate-200 text-center text-slate-400">
            <Calendar className="w-10 h-10 mx-auto text-slate-300 mb-2" />
            <h3 className="font-bold text-slate-800 text-base">No Appointments Found</h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">You have not scheduled any doctor appointments yet.</p>
            <button
              onClick={onNavigateToBooking}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-md transition"
            >
              Find a Doctor & Reserve Slot
            </button>
          </div>
        )}

        {!loading &&
          appointments.map((appt) => {
            const isCompleted = appt.status === 'COMPLETED';
            const isCancelled = appt.status === 'CANCELLED';

            return (
              <div
                key={appt.id}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-lg bg-sky-600 text-white">
                      Token #{appt.queueToken?.tokenNumber || 'WAIT'}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Ref: {appt.appointmentNumber}</span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isCancelled
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-900 text-base">
                      Dr. {appt.doctor.user.firstName} {appt.doctor.user.lastName}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {appt.doctor.specialization} • {appt.doctor.department.name}
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{new Date(appt.appointmentDate).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appt.startTime} - {appt.endTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{appt.doctor.roomNumber}</span>
                    </div>
                    <div className="font-semibold text-slate-800">
                      Fee Paid: ₹{appt.doctor.consultationFee}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t md:border-t-0 pt-3 md:pt-0">
                  {appt.consultationNote && (
                    <button
                      onClick={() => downloadRx(appt)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl transition shadow-sm flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" /> Download Rx (.PDF)
                    </button>
                  )}

                  {!isCompleted && !isCancelled && (
                    <button
                      disabled={cancellingId === appt.id}
                      onClick={() => handleCancel(appt.id)}
                      className="px-3.5 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl transition border border-rose-200 flex items-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      {cancellingId === appt.id ? 'Cancelling...' : 'Cancel'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
};
