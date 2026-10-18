import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Maximize2, Radio, BellRing, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { getSocket } from '../services/socket';

export const WaitingHallKiosk: React.FC = () => {
  const [doctors, setDoctors] = useState<any[]>([]);
  const [queues, setQueues] = useState<{ [docId: string]: any }>({});
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastAnnouncement, setLastAnnouncement] = useState<string>('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    fetchActiveRooms();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const socket = getSocket();

    const handleUpdate = (data: any) => {
      fetchActiveRooms();

      // Trigger Voice Chime & Speech Synthesizer on token call
      if (data?.type === 'TOKEN_STATUS_UPDATED' && data.status === 'CALLED') {
        const announcement = `Attention please: Token number ${data.tokenNumber}, please proceed to Consultation Room.`;
        setLastAnnouncement(announcement);
        if (soundEnabled && 'speechSynthesis' in window) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(announcement);
          utterance.rate = 0.9;
          utterance.pitch = 1.0;
          window.speechSynthesis.speak(utterance);
        }
      }
    };

    socket.on('queue_updated', handleUpdate);
    socket.on('global_queue_updated', handleUpdate);

    return () => {
      socket.off('queue_updated', handleUpdate);
      socket.off('global_queue_updated', handleUpdate);
    };
  }, [soundEnabled]);

  const fetchActiveRooms = async () => {
    const res = await api.get('/doctors');
    if (res.success) {
      setDoctors(res.data);
      for (const doc of res.data) {
        const qRes = await api.get(`/queue/doctor/${doc.id}`);
        if (qRes.success) {
          setQueues((prev) => ({ ...prev, [doc.id]: qRes.data }));
        }
      }
    }
  };

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-6">
      {/* Kiosk Display Header */}
      <div className="flex flex-col md:flex-row items-center justify-between pb-6 border-b border-slate-800/80 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/30">
            <Radio className="w-6 h-6 animate-pulse text-sky-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl md:text-2xl font-black tracking-tight text-white">
                CareFlow OPD KIOSK & TV DISPLAY
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                LIVE BROADCAST
              </span>
            </div>
            <p className="text-xs text-slate-400">Waiting Lounge Digital Token Callout System</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-xl font-mono font-bold text-sky-400">
              {currentTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </div>
            <div className="text-[11px] text-slate-400">
              {currentTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              title={soundEnabled ? 'Mute Audio Announcements' : 'Enable Audio Chimes'}
              className={`p-2.5 rounded-xl border transition ${
                soundEnabled
                  ? 'bg-sky-600/30 text-sky-300 border-sky-500/40'
                  : 'bg-slate-800 text-slate-500 border-slate-700'
              }`}
            >
              {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </button>

            <button
              onClick={toggleFullScreen}
              title="Full Screen Waiting TV Mode"
              className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition"
            >
              <Maximize2 className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Voice Notification Banner */}
      {lastAnnouncement && (
        <div className="p-3 bg-sky-950/70 border border-sky-800/80 rounded-2xl flex items-center gap-3 text-sky-200 text-xs">
          <BellRing className="w-4 h-4 text-sky-400 animate-bounce shrink-0" />
          <span className="font-semibold">Last Live Announcement:</span>
          <span className="font-mono text-sky-300 truncate">"{lastAnnouncement}"</span>
        </div>
      )}

      {/* Grid of Doctor Consultation Rooms & Active Tokens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {doctors.map((doc) => {
          const q = queues[doc.id];
          const current = q?.currentServing;
          const waitingTokens = q?.tokens?.filter((t: any) => t.status === 'WAITING') || [];

          return (
            <div
              key={doc.id}
              className="bg-slate-900/90 rounded-2xl p-5 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                      {doc.roomNumber}
                    </span>
                    <h3 className="font-bold text-white text-base mt-2">
                      Dr. {doc.user.firstName} {doc.user.lastName}
                    </h3>
                    <p className="text-xs text-slate-400">{doc.department.name} • {doc.specialization}</p>
                  </div>

                  <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse mt-1"></span>
                </div>

                {/* Big Token Display Box */}
                <div className="my-6 p-4 rounded-2xl bg-slate-950 border border-slate-800/80 text-center">
                  <span className="text-[10px] tracking-widest uppercase font-bold text-slate-500">
                    NOW CONSULTING
                  </span>

                  {current ? (
                    <div className="mt-2">
                      <div className="text-4xl md:text-5xl font-black text-emerald-400 tracking-wider animate-pulse">
                        {current.tokenNumber}
                      </div>
                      <p className="text-xs font-semibold text-slate-300 mt-1 truncate">
                        {current.appointment.patient.user.firstName} {current.appointment.patient.user.lastName}
                      </p>
                    </div>
                  ) : (
                    <div className="py-3 text-slate-600 text-sm font-semibold">
                      NO PATIENT IN ROOM
                    </div>
                  )}
                </div>
              </div>

              {/* Waiting Tokens Pill Sequence */}
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-2 font-medium">
                  <span>Up Next in Line:</span>
                  <span className="text-slate-500">{waitingTokens.length} waiting</span>
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                  {waitingTokens.length === 0 ? (
                    <span className="text-[11px] text-slate-600 italic">Queue clear</span>
                  ) : (
                    waitingTokens.slice(0, 5).map((t: any) => (
                      <span
                        key={t.id}
                        className="px-2.5 py-1 rounded-lg bg-slate-800 text-sky-300 text-xs font-mono font-bold border border-slate-700/60"
                      >
                        {t.tokenNumber}
                      </span>
                    ))
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="pt-2 text-center text-slate-500 text-xs flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-sky-400" />
        Audio chime and text-to-speech synthesize automatically when a doctor calls the next token from their suite.
      </div>
    </div>
  );
};
