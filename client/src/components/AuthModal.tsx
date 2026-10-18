import React, { useState } from 'react';
import { Stethoscope, Lock, Mail, UserPlus, LogIn, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

interface AuthModalProps {
  onSuccess: (user: any, token: string) => void;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onSuccess, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<'PATIENT' | 'DOCTOR' | 'ADMIN'>('PATIENT');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isRegister ? '/auth/register' : '/auth/login';
      const payload = isRegister
        ? { email, password, firstName, lastName, phone, role }
        : { email, password };

      const res = await api.post(endpoint, payload);
      if (res.success) {
        onSuccess(res.user, res.token);
      } else {
        setError(res.message || 'Authentication failed');
      }
    } catch (err: any) {
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = (demoRole: 'PATIENT' | 'DOCTOR' | 'ADMIN') => {
    setIsRegister(false);
    if (demoRole === 'PATIENT') {
      setEmail('john.doe@gmail.com');
      setPassword('Password123!');
    } else if (demoRole === 'DOCTOR') {
      setEmail('dr.marcus@careflow.com');
      setPassword('Password123!');
    } else if (demoRole === 'ADMIN') {
      setEmail('admin@careflow.com');
      setPassword('Password123!');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-6 py-5 text-white flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/10 rounded-xl">
              <Stethoscope className="w-6 h-6 text-sky-200" />
            </div>
            <div>
              <h3 className="font-bold text-lg">CareFlow Health Access</h3>
              <p className="text-xs text-sky-100">Role-Based Medical Authentication</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white text-xl font-bold">✕</button>
        </div>

        <div className="p-6">
          {/* Quick Demo Fill Buttons */}
          <div className="mb-5 bg-sky-50 border border-sky-200/60 rounded-xl p-3">
            <p className="text-xs font-semibold text-sky-900 mb-2">⚡ Quick 1-Click Demo Profiles:</p>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => fillDemoAccount('PATIENT')}
                className="text-xs bg-white text-sky-700 font-medium py-1.5 px-2 rounded-lg border border-sky-200 hover:bg-sky-100 transition shadow-sm text-center"
              >
                👤 Patient
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('DOCTOR')}
                className="text-xs bg-white text-emerald-700 font-medium py-1.5 px-2 rounded-lg border border-emerald-200 hover:bg-emerald-50 transition shadow-sm text-center"
              >
                🩺 Doctor
              </button>
              <button
                type="button"
                onClick={() => fillDemoAccount('ADMIN')}
                className="text-xs bg-white text-purple-700 font-medium py-1.5 px-2 rounded-lg border border-purple-200 hover:bg-purple-50 transition shadow-sm text-center"
              >
                ⚙️ Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-xs bg-red-50 text-red-700 border border-red-200 p-2.5 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {isRegister && (
              <>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-xs font-medium text-slate-700">First Name</label>
                    <input
                      required
                      type="text"
                      className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-700">Last Name</label>
                    <input
                      required
                      type="text"
                      className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-700">Account Role</label>
                  <select
                    className="mt-1 w-full border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                    value={role}
                    onChange={(e: any) => setRole(e.target.value)}
                  >
                    <option value="PATIENT">Patient (Outpatient)</option>
                    <option value="DOCTOR">Consulting Doctor</option>
                    <option value="ADMIN">Hospital Administrator</option>
                  </select>
                </div>
              </>
            )}

            <div>
              <label className="text-xs font-medium text-slate-700">Email Address</label>
              <div className="mt-1 relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  required
                  type="email"
                  placeholder="name@careflow.com"
                  className="w-full pl-9 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-700">Password</label>
              <div className="mt-1 relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  required
                  type="password"
                  placeholder="••••••••"
                  className="w-full pl-9 border border-slate-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-sky-500 outline-none"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full mt-2 bg-sky-600 hover:bg-sky-700 text-white font-medium py-2.5 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              {loading ? (
                <span>Authenticating...</span>
              ) : isRegister ? (
                <>
                  <UserPlus className="w-4 h-4" /> Create Medical Account
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Secure Sign In
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs text-sky-600 hover:underline font-medium inline-flex items-center gap-1"
            >
              {isRegister ? 'Already registered? Sign in here' : 'Need an outpatient account? Sign up here'}
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
