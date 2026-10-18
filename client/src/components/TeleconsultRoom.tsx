import React, { useState } from 'react';
import { Video, Mic, MicOff, VideoOff, MessageSquare, PhoneOff, Send, Shield, User } from 'lucide-react';

interface TeleconsultRoomProps {
  doctorName?: string;
  patientName?: string;
  roomNumber?: string;
  onEndCall: () => void;
}

export const TeleconsultRoom: React.FC<TeleconsultRoomProps> = ({
  doctorName = 'Dr. Marcus Vance',
  patientName = 'John Doe',
  roomNumber = 'Room 302',
  onEndCall,
}) => {
  const [micOn, setMicOn] = useState(true);
  const [videoOn, setVideoOn] = useState(true);
  const [chatOpen, setChatOpen] = useState(true);
  const [messages, setMessages] = useState<Array<{ sender: string; text: string; time: string }>>([
    {
      sender: doctorName,
      text: 'Hello! I can see your vital history. How are you feeling today?',
      time: '10:16 AM',
    },
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const newMsg = {
      sender: 'You',
      text: inputText.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Doctor mock reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          sender: doctorName,
          text: 'Understood. Let me note this in your clinical record and update the prescription.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    }, 1200);
  };

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-6 shadow-2xl border border-slate-800 space-y-4">
      {/* Teleconsult Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Video className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-base md:text-lg text-white">CareFlow TeleHealth HD Video Suite</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                ENCRYPTED WEBRTC
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Consultation between {doctorName} and {patientName} • {roomNumber}
            </p>
          </div>
        </div>

        <button
          onClick={onEndCall}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-md shadow-rose-600/30"
        >
          <PhoneOff className="w-4 h-4" /> End Call
        </button>
      </div>

      {/* Main Video & Live Chat Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Remote & Local Video Feeds */}
        <div className="lg:col-span-2 relative aspect-video bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
          {videoOn ? (
            <div className="w-full h-full bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 flex flex-col items-center justify-center p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-sky-600 to-emerald-500 flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-sky-500/30 mb-3 animate-pulse">
                {doctorName.split(' ')[1]?.[0] || 'D'}
              </div>
              <h3 className="text-lg font-bold text-white">{doctorName}</h3>
              <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span> Live HD Audio & Video Stream (720p 30fps)
              </p>
            </div>
          ) : (
            <div className="text-center text-slate-500">
              <VideoOff className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Doctor's camera feed paused</p>
            </div>
          )}

          {/* Self-view Picture-in-Picture PIP */}
          <div className="absolute bottom-4 right-4 w-36 h-24 bg-slate-950 rounded-xl border border-slate-700 shadow-xl overflow-hidden flex flex-col items-center justify-center p-2 text-center">
            <User className="w-6 h-6 text-sky-400 mb-1" />
            <span className="text-[10px] font-bold text-slate-300 truncate w-full">{patientName} (You)</span>
            <span className="text-[9px] text-emerald-400 font-mono">1080p WebRTC</span>
          </div>

          {/* Video Control Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/80 shadow-2xl">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`p-2.5 rounded-xl transition ${
                micOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
              }`}
              title={micOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {micOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setVideoOn(!videoOn)}
              className={`p-2.5 rounded-xl transition ${
                videoOn ? 'bg-slate-800 text-white hover:bg-slate-700' : 'bg-rose-600 text-white'
              }`}
              title={videoOn ? 'Turn Off Camera' : 'Turn On Camera'}
            >
              {videoOn ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setChatOpen(!chatOpen)}
              className={`p-2.5 rounded-xl transition ${
                chatOpen ? 'bg-sky-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
              }`}
              title="Toggle Clinical Chat"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Real-time Consultation Chat & Notes */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[340px] lg:h-auto">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-sky-400" /> Consultation Messages
            </span>
            <span className="text-[10px] text-slate-500 flex items-center gap-1">
              <Shield className="w-3 h-3 text-emerald-400" /> HIPAA / E2E
            </span>
          </div>

          {/* Message List */}
          <div className="flex-1 p-3 space-y-3 overflow-y-auto">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'You' ? 'items-end' : 'items-start'}`}
              >
                <span className="text-[10px] text-slate-500 mb-0.5">{m.sender} • {m.time}</span>
                <div
                  className={`p-2.5 rounded-2xl text-xs max-w-[85%] ${
                    m.sender === 'You'
                      ? 'bg-sky-600 text-white rounded-tr-none'
                      : 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700/60'
                  }`}
                >
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="p-2 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Type message, symptoms, or medicine..."
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 outline-none focus:ring-1 focus:ring-sky-500"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              className="p-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
