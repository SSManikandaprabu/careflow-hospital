import React, { useState, useEffect } from 'react';
import { Users, Clock, Radio, Activity, Search } from 'lucide-react';
import { api } from '../services/api';
import { getSocket } from '../services/socket';

export const LiveQueueTracker: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>('');
  const [queueData, setQueueData] = useState<any | null>(null);
  const [tokenLookup, setTokenLookup] = useState<string>('');
  const [searchedToken, setSearchedToken] = useState<any | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchDoctors();
  }, []);

  useEffect(() => {
    if (selectedDoctorId) {
      loadQueue(selectedDoctorId);

      // Join socket room for live updates
      const socket = getSocket();
      socket.emit('join_doctor_queue', selectedDoctorId);

      const handleQueueUpdate = () => {
        loadQueue(selectedDoctorId);
      };

      socket.on('queue_updated', handleQueueUpdate);
      socket.on('global_queue_updated', handleQueueUpdate);

      return () => {
        socket.emit('leave_doctor_queue', selectedDoctorId);
        socket.off('queue_updated', handleQueueUpdate);
        socket.off('global_queue_updated', handleQueueUpdate);
      };
    }
  }, [selectedDoctorId]);

  const fetchDoctors = async () => {
    const res = await api.get('/doctors');
    if (res.success && res.data.length > 0) {
      setDoctors(res.data);
      setSelectedDoctorId(res.data[0].id);
    }
  };

  const loadQueue = async (docId: string) => {
    try {
      const res = await api.get(`/queue/doctor/${docId}`);
      if (res.success) {
        setQueueData(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLookupToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenLookup.trim()) return;
    setError('');
    setSearchedToken(null);

    try {
      const res = await api.get(`/queue/token/${tokenLookup.trim().toUpperCase()}`);
      if (res.success) {
        setSearchedToken(res.data);
      } else {
        setError(res.message || 'Token not found');
      }
    } catch (err: any) {
      setError(err.message || 'Error checking token');
    }
  };

  const selectedDoctor = doctors.find((d) => d.id === selectedDoctorId);

  return (
    <div className="space-y-6">
      {/* Header & Token Search Widget */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Doctor Selector */}
        <div className="md:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-sky-600 font-semibold text-xs tracking-wider uppercase mb-1">
              <Radio className="w-4 h-4 animate-pulse text-emerald-500" />
              Real-Time Outpatient Department (OPD) Queue
            </div>
            <h2 className="text-lg font-bold text-slate-900">Live Hospital Waiting Room Board</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Select a clinic room to monitor active turn callouts, estimated wait times, and queue flow.
            </p>
          </div>

          <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
            {doctors.map((doc) => (
              <button
                key={doc.id}
                onClick={() => setSelectedDoctorId(doc.id)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition border ${
                  selectedDoctorId === doc.id
                    ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Dr. {doc.user.lastName} ({doc.department.code} - {doc.roomNumber})
              </button>
            ))}
          </div>
        </div>

        {/* Quick Token Checker */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-5 rounded-2xl text-white shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm text-sky-300 flex items-center gap-1.5">
              <Search className="w-4 h-4" /> Patient Token Lookup
            </h3>
            <p className="text-xs text-slate-300 mt-1">Check your personal queue position & estimated arrival</p>
          </div>

          <form onSubmit={handleLookupToken} className="mt-3">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. CARD-01"
                className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-400 uppercase"
                value={tokenLookup}
                onChange={(e) => setTokenLookup(e.target.value)}
              />
              <button
                type="submit"
                className="bg-sky-500 hover:bg-sky-600 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition shrink-0"
              >
                Track
              </button>
            </div>
          </form>

          {error && <p className="text-[11px] text-rose-300 mt-2">{error}</p>}
        </div>
      </div>

      {/* Searched Token Banner */}
      {searchedToken && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg">
              {searchedToken.token.tokenNumber}
            </div>
            <div>
              <p className="text-xs font-semibold text-emerald-900">
                Patient: {searchedToken.token.appointment.patient.user.firstName} {searchedToken.token.appointment.patient.user.lastName}
              </p>
              <p className="text-xs text-emerald-700">
                With Dr. {searchedToken.token.appointment.doctor.user.firstName} {searchedToken.token.appointment.doctor.user.lastName} • {searchedToken.token.appointment.doctor.roomNumber}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="text-center">
              <span className="text-[11px] text-slate-500 uppercase font-bold block">Status</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                {searchedToken.token.status}
              </span>
            </div>
            <div className="text-center">
              <span className="text-[11px] text-slate-500 uppercase font-bold block">Ahead of You</span>
              <span className="text-base font-black text-slate-900">{searchedToken.waitingAhead}</span>
            </div>
            <div className="text-center">
              <span className="text-[11px] text-slate-500 uppercase font-bold block">Estimated Wait</span>
              <span className="text-base font-black text-emerald-600">{searchedToken.estimatedWaitMinutes} mins</span>
            </div>
          </div>
        </div>
      )}

      {/* Real-time Display Board */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Currently Serving Big Monitor */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center">
          <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">NOW SERVING IN CONSULTATION</span>

          {queueData?.currentServing ? (
            <div className="my-3">
              <div className="text-5xl md:text-6xl font-black text-sky-600 tracking-tight animate-bounce">
                {queueData.currentServing.tokenNumber}
              </div>
              <p className="mt-3 text-sm font-bold text-slate-800">
                {queueData.currentServing.appointment.patient.user.firstName} {queueData.currentServing.appointment.patient.user.lastName}
              </p>
              <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 rounded-full text-xs font-semibold border border-amber-200">
                <Activity className="w-3.5 h-3.5 animate-spin" /> In Doctor Examination Room
              </div>
            </div>
          ) : (
            <div className="my-6">
              <div className="text-3xl font-bold text-slate-300">-- NONE --</div>
              <p className="text-xs text-slate-400 mt-2">Waiting for next patient to be called</p>
            </div>
          )}

          <div className="w-full mt-6 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-medium">In Queue</p>
              <p className="text-lg font-bold text-slate-800">{queueData?.waitingCount ?? 0}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-medium">Completed</p>
              <p className="text-lg font-bold text-emerald-600">{queueData?.completedCount ?? 0}</p>
            </div>
            <div>
              <p className="text-[11px] text-slate-400 uppercase font-medium">Est. Velocity</p>
              <p className="text-lg font-bold text-slate-800">15m / pt</p>
            </div>
          </div>
        </div>

        {/* Live Sequence List */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-600" /> Patient Line-up Sequence ({selectedDoctor?.roomNumber})
            </h3>
            <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live Socket Sync
            </span>
          </div>

          <div className="space-y-2 max-h-96 overflow-y-auto pr-1">
            {(!queueData?.tokens || queueData.tokens.length === 0) && (
              <div className="py-12 text-center text-slate-400">
                <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs">No active queue tokens registered for this doctor today.</p>
              </div>
            )}

            {queueData?.tokens?.map((t: any, index: number) => {
              const isCurrent = t.status === 'CALLED' || t.status === 'IN_PROGRESS';
              const isWaiting = t.status === 'WAITING';

              return (
                <div
                  key={t.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between transition ${
                    isCurrent
                      ? 'bg-sky-50 border-sky-300 shadow-sm'
                      : isWaiting
                      ? 'bg-white border-slate-200'
                      : 'bg-slate-50/70 border-slate-100 opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-400 w-5">#{index + 1}</span>
                    <div
                      className={`px-3 py-1 rounded-lg font-black text-sm ${
                        isCurrent
                          ? 'bg-sky-600 text-white'
                          : isWaiting
                          ? 'bg-slate-100 text-slate-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {t.tokenNumber}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {t.appointment.patient.user.firstName} {t.appointment.patient.user.lastName}
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Slot: {t.appointment.startTime} • {t.appointment.consultationType}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                        isCurrent
                          ? 'bg-sky-200 text-sky-900'
                          : isWaiting
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {t.status}
                    </span>

                    {isWaiting && (
                      <span className="text-xs font-semibold text-slate-500">
                        ~{t.estimatedWaitMinutes}m wait
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
