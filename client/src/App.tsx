import React, { useState, useEffect } from 'react';
import {
  Stethoscope,
  Calendar,
  Activity,
  Shield,
  LogOut,
  User as UserIcon,
  Tv,
  Video,
  Pill,
  TestTube,
  AlertTriangle,
  ChevronDown,
  Menu,
  X,
  FileText
} from 'lucide-react';
import { DoctorBooking } from './components/DoctorBooking';
import { LiveQueueTracker } from './components/LiveQueueTracker';
import { DoctorPortal } from './components/DoctorPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { PatientPortal } from './components/PatientPortal';
import { WaitingHallKiosk } from './components/WaitingHallKiosk';
import { TeleconsultRoom } from './components/TeleconsultRoom';
import { PharmacyDispenser } from './components/PharmacyDispenser';
import { DiagnosticsLab } from './components/DiagnosticsLab';
import { EmergencyTraumaDesk } from './components/EmergencyTraumaDesk';
import { AISymptomTriage } from './components/AISymptomTriage';
import { FloatingAIChat } from './components/FloatingAIChat';
import { AuthModal } from './components/AuthModal';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'booking' | 'queue' | 'ai-triage' | 'kiosk' | 'teleconsult' | 'pharmacy' | 'diagnostics' | 'emergency' | 'my-visits' | 'doctor' | 'admin'
  >('booking');
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('careflow_token'));
  const [user, setUser] = useState<any | null>(() => {
    const saved = localStorage.getItem('careflow_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (token) localStorage.setItem('careflow_token', token);
    else localStorage.removeItem('careflow_token');

    if (user) localStorage.setItem('careflow_user', JSON.stringify(user));
    else localStorage.removeItem('careflow_user');
  }, [token, user]);

  const handleLoginSuccess = (authUser: any, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    setShowAuthModal(false);

    if (authUser.role === 'DOCTOR') setActiveTab('doctor');
    else if (authUser.role === 'ADMIN') setActiveTab('admin');
    else setActiveTab('booking');
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    setActiveTab('booking');
  };

  const isHospitalServiceActive = ['kiosk', 'teleconsult', 'pharmacy', 'diagnostics'].includes(activeTab);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Sleek Enterprise Top Navigation Bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <div
            onClick={() => setActiveTab('booking')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition">
              <Stethoscope className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-black text-slate-900 text-lg tracking-tight">CareFlow</span>
                <span className="text-[9px] uppercase font-extrabold bg-sky-100 text-sky-700 px-1.5 py-0.5 rounded tracking-wider">
                  Health OS
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">Enterprise Clinical Suite</p>
            </div>
          </div>

          {/* Desktop Clean Segmented Navigation */}
          <nav className="hidden lg:flex items-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl border border-slate-200/60">
            {/* Primary Action 1: Book Doctor */}
            <button
              onClick={() => {
                setActiveTab('booking');
                setServicesDropdown(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'booking'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" /> Book Doctor
            </button>

            {/* Primary Action 2: Live Queue */}
            <button
              onClick={() => {
                setActiveTab('queue');
                setServicesDropdown(false);
              }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === 'queue'
                  ? 'bg-white text-sky-700 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" /> Live Queue
            </button>

            {/* Clean Dropdown for Specialized Hospital Clinical Services */}
            <div className="relative">
              <button
                onClick={() => setServicesDropdown(!servicesDropdown)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1 ${
                  isHospitalServiceActive
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>Clinical Services</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {servicesDropdown && (
                <div
                  onMouseLeave={() => setServicesDropdown(false)}
                  className="absolute left-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-1.5 z-50 divide-y divide-slate-100 animate-in fade-in slide-in-from-top-2 duration-150"
                >
                  <div className="p-1">
                    <button
                      onClick={() => {
                        setActiveTab('teleconsult');
                        setServicesDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-slate-900"
                    >
                      <Video className="w-4 h-4 text-emerald-600" />
                      <div>
                        <div>TeleHealth Video</div>
                        <span className="text-[10px] text-slate-400 font-normal">Remote WebRTC consultation</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('pharmacy');
                        setServicesDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-slate-900"
                    >
                      <Pill className="w-4 h-4 text-amber-600" />
                      <div>
                        <div>Pharmacy & Formulary</div>
                        <span className="text-[10px] text-slate-400 font-normal">500+ medicines & e-Rx</span>
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('diagnostics');
                        setServicesDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-slate-900"
                    >
                      <TestTube className="w-4 h-4 text-teal-600" />
                      <div>
                        <div>Diagnostics & Lab</div>
                        <span className="text-[10px] text-slate-400 font-normal">Blood, ECG & radiology</span>
                      </div>
                    </button>
                  </div>

                  <div className="p-1">
                    <button
                      onClick={() => {
                        setActiveTab('kiosk');
                        setServicesDropdown(false);
                      }}
                      className="w-full px-3 py-2 text-left text-xs font-semibold rounded-xl hover:bg-slate-50 flex items-center gap-2.5 text-slate-700 hover:text-slate-900"
                    >
                      <Tv className="w-4 h-4 text-indigo-600" />
                      <div>
                        <div>Waiting Lounge TV Kiosk</div>
                        <span className="text-[10px] text-slate-400 font-normal">Audio voice callouts</span>
                      </div>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Patient Logged In Tab: My Visits */}
            {user?.role === 'PATIENT' && (
              <button
                onClick={() => {
                  setActiveTab('my-visits');
                  setServicesDropdown(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'my-visits'
                    ? 'bg-white text-sky-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-sky-600" /> My Visits & Rx
              </button>
            )}

            {/* Doctor Logged In Tab: Suite */}
            {user?.role === 'DOCTOR' && (
              <button
                onClick={() => {
                  setActiveTab('doctor');
                  setServicesDropdown(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'doctor'
                    ? 'bg-white text-emerald-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5 text-emerald-600" /> Doctor Suite
              </button>
            )}

            {/* Admin Logged In Tab: Dashboard */}
            {user?.role === 'ADMIN' && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setServicesDropdown(false);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-white text-purple-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Shield className="w-3.5 h-3.5 text-purple-600" /> Admin Command
              </button>
            )}
          </nav>

          {/* Right Header Area: Emergency Pill + User Auth */}
          <div className="flex items-center gap-3">
            {/* Highlighted Emergency SOS Pill */}
            <button
              onClick={() => setActiveTab('emergency')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 border ${
                activeTab === 'emergency'
                  ? 'bg-red-600 text-white border-red-600 shadow-md shadow-red-500/20'
                  : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-red-600 shrink-0" />
              <span>SOS 108</span>
            </button>

            {/* User Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-slate-800 leading-tight">
                    {user.firstName} {user.lastName}
                  </p>
                  <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">
                    {user.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3.5 py-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl shadow-sm transition flex items-center gap-1.5"
              >
                <UserIcon className="w-3.5 h-3.5" /> Sign In
              </button>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-lg animate-in slide-in-from-top-2">
            <button
              onClick={() => {
                setActiveTab('booking');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
            >
              <Calendar className="w-4 h-4 text-sky-600" /> Book Doctor
            </button>

            <button
              onClick={() => {
                setActiveTab('queue');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
            >
              <Activity className="w-4 h-4 text-sky-600" /> Live Queue Board
            </button>

            <button
              onClick={() => {
                setActiveTab('teleconsult');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
            >
              <Video className="w-4 h-4 text-emerald-600" /> TeleHealth Video Clinic
            </button>

            <button
              onClick={() => {
                setActiveTab('pharmacy');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
            >
              <Pill className="w-4 h-4 text-amber-600" /> Pharmacy Hub (500+ SKUs)
            </button>

            <button
              onClick={() => {
                setActiveTab('diagnostics');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
            >
              <TestTube className="w-4 h-4 text-teal-600" /> Diagnostics & Lab
            </button>

            <button
              onClick={() => {
                setActiveTab('kiosk');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2 text-slate-700"
            >
              <Tv className="w-4 h-4 text-indigo-600" /> Waiting Lounge TV Kiosk
            </button>

            {user?.role === 'PATIENT' && (
              <button
                onClick={() => {
                  setActiveTab('my-visits');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sky-700"
              >
                <FileText className="w-4 h-4 text-sky-600" /> My Consultations & Rx
              </button>
            )}

            {user?.role === 'DOCTOR' && (
              <button
                onClick={() => {
                  setActiveTab('doctor');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2 text-emerald-700"
              >
                <Stethoscope className="w-4 h-4 text-emerald-600" /> Doctor Clinical Suite
              </button>
            )}

            {user?.role === 'ADMIN' && (
              <button
                onClick={() => {
                  setActiveTab('admin');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 px-3 text-xs font-semibold rounded-lg hover:bg-slate-50 flex items-center gap-2 text-purple-700"
              >
                <Shield className="w-4 h-4 text-purple-600" /> Hospital Admin Dashboard
              </button>
            )}
          </div>
        )}
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'booking' && (
          <DoctorBooking token={token} onBookingComplete={() => setActiveTab('my-visits')} />
        )}
        {activeTab === 'queue' && <LiveQueueTracker />}
        {activeTab === 'ai-triage' && (
          <AISymptomTriage onSelectDepartment={() => setActiveTab('booking')} />
        )}
        {activeTab === 'kiosk' && <WaitingHallKiosk />}
        {activeTab === 'teleconsult' && (
          <TeleconsultRoom
            doctorName="Dr. Marcus Vance"
            patientName={user ? `${user.firstName} ${user.lastName}` : 'Guest Patient'}
            roomNumber="TeleConsult Suite 302"
            onEndCall={() => setActiveTab('my-visits')}
          />
        )}
        {activeTab === 'pharmacy' && <PharmacyDispenser />}
        {activeTab === 'diagnostics' && <DiagnosticsLab />}
        {activeTab === 'emergency' && <EmergencyTraumaDesk />}
        {activeTab === 'my-visits' && (
          <PatientPortal token={token || ''} onNavigateToBooking={() => setActiveTab('booking')} />
        )}
        {activeTab === 'doctor' && user?.role === 'DOCTOR' && (
          <DoctorPortal user={user} token={token || ''} />
        )}
        {activeTab === 'admin' && user?.role === 'ADMIN' && (
          <AdminDashboard token={token || ''} />
        )}
      </main>

      {/* Floating AI Clinical Triage Chat Widget */}
      <FloatingAIChat onBookSpecialist={() => setActiveTab('booking')} />

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal onSuccess={handleLoginSuccess} onClose={() => setShowAuthModal(false)} />
      )}
    </div>
  );
};

export default App;
