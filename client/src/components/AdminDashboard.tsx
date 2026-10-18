import React, { useState, useEffect } from 'react';
import { Building, Users, CalendarCheck, TrendingUp, Plus, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

interface AdminDashboardProps {
  token: string;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ token }) => {
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [departments, setDepartments] = useState<any[]>([]);
  const [showAddDept, setShowAddDept] = useState(false);
  const [newDeptName, setNewDeptName] = useState('');
  const [newDeptCode, setNewDeptCode] = useState('');
  const [newDeptDesc, setNewDeptDesc] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadAnalytics();
    loadDepartments();
  }, []);

  const loadAnalytics = async () => {
    const res = await api.get('/admin/analytics', token);
    if (res.success) {
      setAnalytics(res.data);
    }
  };

  const loadDepartments = async () => {
    const res = await api.get('/departments');
    if (res.success) {
      setDepartments(res.data);
    }
  };

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post(
        '/departments',
        { name: newDeptName, code: newDeptCode, description: newDeptDesc },
        token
      );
      if (res.success) {
        setMessage('✅ Department added successfully!');
        setShowAddDept(false);
        setNewDeptName('');
        setNewDeptCode('');
        setNewDeptDesc('');
        loadDepartments();
        loadAnalytics();
      }
    } catch (err: any) {
      setMessage(err.message || 'Failed to create department');
    }
  };

  return (
    <div className="space-y-6">
      {/* Admin Title */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-purple-600 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Hospital Administration & Operations
          </span>
          <h2 className="text-xl font-bold text-slate-900">Hospital Command Center</h2>
          <p className="text-xs text-slate-500">
            Real-time throughput analytics, clinical departments, and medical staff oversight.
          </p>
        </div>

        <button
          onClick={() => setShowAddDept(!showAddDept)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Add Medical Department
        </button>
      </div>

      {message && (
        <div className="p-3 bg-purple-50 text-purple-800 border border-purple-200 rounded-xl text-xs font-medium">
          {message}
        </div>
      )}

      {/* Add Department Modal / Form */}
      {showAddDept && (
        <div className="bg-white p-5 rounded-2xl border border-purple-200 shadow-sm">
          <h3 className="font-bold text-slate-900 text-sm mb-3">Onboard New Hospital Department</h3>
          <form onSubmit={handleCreateDepartment} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Department Name</label>
              <input
                required
                type="text"
                placeholder="e.g. Oncology"
                className="w-full border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                value={newDeptName}
                onChange={(e) => setNewDeptName(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Department Code</label>
              <input
                required
                type="text"
                placeholder="e.g. ONCO"
                className="w-full border border-slate-200 rounded-xl p-2 text-xs uppercase focus:ring-2 focus:ring-purple-500 outline-none"
                value={newDeptCode}
                onChange={(e) => setNewDeptCode(e.target.value)}
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Description</label>
              <input
                type="text"
                placeholder="Cancer diagnosis and chemotherapy care"
                className="w-full border border-slate-200 rounded-xl p-2 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
                value={newDeptDesc}
                onChange={(e) => setNewDeptDesc(e.target.value)}
              />
            </div>
            <div className="md:col-span-3 flex justify-end gap-2 mt-2">
              <button
                type="button"
                onClick={() => setShowAddDept(false)}
                className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl"
              >
                Save Department
              </button>
            </div>
          </form>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2.5 w-10 h-10 rounded-xl bg-sky-50 text-sky-600 mb-3 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Registered Patients</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {analytics?.summary?.totalPatients ?? 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2.5 w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 mb-3 flex items-center justify-center">
            <Building className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Doctors On Staff</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {analytics?.summary?.totalDoctors ?? 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2.5 w-10 h-10 rounded-xl bg-purple-50 text-purple-600 mb-3 flex items-center justify-center">
            <CalendarCheck className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Total Appointments</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {analytics?.summary?.totalAppointments ?? 0}
          </h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="p-2.5 w-10 h-10 rounded-xl bg-amber-50 text-amber-600 mb-3 flex items-center justify-center">
            <TrendingUp className="w-5 h-5" />
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase">Completed Today</p>
          <h3 className="text-2xl font-black text-slate-900 mt-1">
            {analytics?.summary?.completedToday ?? 0}
          </h3>
        </div>
      </div>

      {/* Hospital Departments Directory */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
        <h3 className="font-bold text-slate-900 text-sm mb-4">Hospital Specialty Departments</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {departments.map((dep) => (
            <div key={dep.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-purple-700 bg-purple-100 px-2 py-0.5 rounded">
                  {dep.code}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {dep._count?.doctors ?? 0} Physicians
                </span>
              </div>
              <h4 className="font-bold text-slate-900 text-sm mt-2">{dep.name}</h4>
              <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                {dep.description || 'Specialized clinical branch'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
