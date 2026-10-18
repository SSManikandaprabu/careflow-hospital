import React, { useState, useEffect } from 'react';
import { Search, Calendar, MapPin, CheckCircle, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';
import { PaymentCheckoutModal } from './PaymentCheckoutModal';

interface DoctorBookingProps {
  token: string | null;
  onBookingComplete: (appointment: any) => void;
}

export const DoctorBooking: React.FC<DoctorBookingProps> = ({ token, onBookingComplete }) => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCampus, setSelectedCampus] = useState('ALL');
  const [search, setSearch] = useState('');
  
  // Selection state
  const [selectedDoctor, setSelectedDoctor] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [slots, setSlots] = useState<{ time: string; isAvailable: boolean }[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [reason, setReason] = useState('');
  const [consultationType, setConsultationType] = useState('IN_PERSON');
  
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'error' | 'success'; message: string } | null>(null);

  useEffect(() => {
    fetchDepartments();
    fetchDoctors();
  }, [selectedDept, search]);

  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      loadSlots(selectedDoctor.id, selectedDate);
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDepartments = async () => {
    const res = await api.get('/departments');
    if (res.success) setDepartments(res.data);
  };

  const fetchDoctors = async () => {
    let query = '';
    const params: string[] = [];
    if (selectedDept) params.push(`departmentId=${selectedDept}`);
    if (search) params.push(`search=${encodeURIComponent(search)}`);
    if (params.length) query = `?${params.join('&')}`;

    const res = await api.get(`/doctors${query}`);
    if (res.success) setDoctors(res.data);
  };

  const loadSlots = async (docId: string, date: string) => {
    setLoadingSlots(true);
    setSelectedSlot(null);
    try {
      const res = await api.get(`/doctors/${docId}/slots?date=${date}`);
      if (res.success) {
        setSlots(res.slots || []);
      }
    } finally {
      setLoadingSlots(false);
    }
  };

  const handleInitiateBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setFeedback({ type: 'error', message: 'Please sign in to confirm an appointment.' });
      return;
    }
    if (!selectedDoctor || !selectedSlot) {
      setFeedback({ type: 'error', message: 'Please choose an available time slot.' });
      return;
    }
    setShowPayment(true);
  };

  const executeBooking = async () => {
    setShowPayment(false);
    setBookingLoading(true);
    setFeedback(null);
    try {
      const payload = {
        doctorId: selectedDoctor.id,
        appointmentDate: selectedDate,
        startTime: selectedSlot,
        reason: reason || 'Routine Checkup / Consultation',
        consultationType,
      };

      const res = await api.post('/appointments', payload, token || undefined);
      if (res.success) {
        setFeedback({
          type: 'success',
          message: `Appointment Confirmed! Assigned Live Queue Token: #${res.data.queueToken?.tokenNumber}`,
        });
        onBookingComplete(res.data);
        loadSlots(selectedDoctor.id, selectedDate);
      } else {
        setFeedback({ type: 'error', message: res.message || 'Could not complete booking' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Booking failed' });
    } finally {
      setBookingLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search & Multi-Campus Hospital Filter */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search doctor name, specialty, or condition..."
              className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Hospital Branch / Campus selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500">Hospital Branch:</span>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-medium focus:ring-2 focus:ring-sky-500 outline-none"
            >
              <option value="ALL">All Hospital Campuses</option>
              <option value="MAIN">CareFlow Central Medical Center</option>
              <option value="NORTH">CareFlow North Pavilion & Trauma</option>
              <option value="WEST">CareFlow West Outpatient Clinic</option>
            </select>
          </div>
        </div>

        {/* Specialty Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <button
            onClick={() => setSelectedDept('')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedDept === '' ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Specialties
          </button>
          {departments.map((dept) => (
            <button
              key={dept.id}
              onClick={() => setSelectedDept(dept.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                selectedDept === dept.id ? 'bg-sky-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {dept.name}
            </button>
          ))}
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-3 text-sm border ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Doctor Grid & Slot Booking Engine */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Doctor List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
            Available Physicians ({doctors.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {doctors.map((doc) => {
              const isSelected = selectedDoctor?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoctor(doc)}
                  className={`p-5 rounded-2xl border transition cursor-pointer relative bg-white ${
                    isSelected
                      ? 'border-sky-500 ring-2 ring-sky-500/20 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 border border-sky-100">
                        {doc.department.name}
                      </span>
                      <h3 className="font-bold text-slate-900 mt-2 text-base">
                        Dr. {doc.user.firstName} {doc.user.lastName}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{doc.specialization}</p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                      {doc.user.firstName[0]}
                      {doc.user.lastName[0]}
                    </div>
                  </div>

                  <p className="mt-3 text-xs text-slate-600 line-clamp-2">{doc.biography}</p>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span>{doc.roomNumber}</span>
                    </div>
                    <div className="flex items-center gap-1 font-semibold text-slate-900">
                      <span className="font-bold text-emerald-600 text-sm">₹</span>
                      <span>₹{doc.consultationFee}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Interactive Booking Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm sticky top-24">
            <h3 className="font-bold text-slate-900 text-base mb-1 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-sky-600" /> Appointment Slot Picker
            </h3>
            <p className="text-xs text-slate-500 mb-4">Select consultation date & reserved slot</p>

            {selectedDoctor ? (
              <form onSubmit={handleInitiateBooking} className="space-y-4">
                <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100">
                  <p className="text-xs text-slate-500">Physician Selected:</p>
                  <p className="text-sm font-bold text-sky-950">
                    Dr. {selectedDoctor.user.firstName} {selectedDoctor.user.lastName}
                  </p>
                  <p className="text-xs text-sky-800">{selectedDoctor.department.name} • {selectedDoctor.roomNumber}</p>
                </div>

                {/* Date Picker */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Select Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-slate-200 rounded-xl p-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />
                </div>

                {/* Available Slots Grid */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-semibold text-slate-700">Available Slots</label>
                    {loadingSlots && <span className="text-[10px] text-sky-600 animate-pulse">Checking slots...</span>}
                  </div>

                  <div className="grid grid-cols-3 gap-2 max-h-44 overflow-y-auto pr-1">
                    {slots.length === 0 && !loadingSlots ? (
                      <p className="col-span-3 text-xs text-slate-400 py-3 text-center">
                        No working slots on this date.
                      </p>
                    ) : (
                      slots.map((slot) => {
                        const isChosen = selectedSlot === slot.time;
                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={!slot.isAvailable}
                            onClick={() => setSelectedSlot(slot.time)}
                            className={`py-1.5 px-1 text-xs rounded-lg font-medium transition text-center ${
                              !slot.isAvailable
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed line-through'
                                : isChosen
                                ? 'bg-sky-600 text-white font-bold shadow-sm'
                                : 'bg-slate-50 text-slate-700 hover:bg-sky-50 hover:text-sky-700 border border-slate-200'
                            }`}
                          >
                            {slot.time}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* Consultation Type */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Consultation Mode</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setConsultationType('IN_PERSON')}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition ${
                        consultationType === 'IN_PERSON'
                          ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      🏥 In-Person OPD
                    </button>
                    <button
                      type="button"
                      onClick={() => setConsultationType('TELECONSULT')}
                      className={`py-1.5 text-xs font-medium rounded-lg border transition ${
                        consultationType === 'TELECONSULT'
                          ? 'border-sky-600 bg-sky-50 text-sky-700 font-bold'
                          : 'border-slate-200 text-slate-600'
                      }`}
                    >
                      💻 Teleconsult
                    </button>
                  </div>
                </div>

                {/* Reason */}
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Reason / Symptoms</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of your health concern..."
                    className="w-full border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-sky-500 outline-none"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading || !selectedSlot}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-semibold rounded-xl text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  {bookingLoading ? 'Reserving...' : selectedSlot ? `Proceed to Billing & Pay (₹${selectedDoctor.consultationFee})` : 'Select a Slot'}
                </button>
              </form>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Calendar className="w-8 h-8 mx-auto text-slate-300" />
                <p className="text-xs">Click on any doctor card to open their schedule calendar.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Payment Gateway Modal */}
      {showPayment && selectedDoctor && selectedSlot && (
        <PaymentCheckoutModal
          doctor={selectedDoctor}
          slot={selectedSlot}
          date={selectedDate}
          onSuccess={executeBooking}
          onCancel={() => setShowPayment(false)}
        />
      )}
    </div>
  );
};
