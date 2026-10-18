import React, { useState } from 'react';
import { TestTube, Search, CheckCircle2, Clock } from 'lucide-react';
import confetti from 'canvas-confetti';

interface LabTest {
  id: string;
  name: string;
  department: string;
  sampleType: string;
  turnaroundTime: string;
  fastingRequired: boolean;
  priceINR: number;
}

const LAB_CATALOG: LabTest[] = [
  { id: 'LAB-01', name: 'Complete Blood Count (CBC) with ESR', department: 'Hematology', sampleType: 'Whole Blood (EDTA)', turnaroundTime: '4 Hours', fastingRequired: false, priceINR: 350 },
  { id: 'LAB-02', name: 'Comprehensive Lipid Profile (Cholesterol, HDL, LDL, Triglycerides)', department: 'Biochemistry', sampleType: 'Serum', turnaroundTime: '6 Hours', fastingRequired: true, priceINR: 650 },
  { id: 'LAB-03', name: 'HbA1c (Glycosylated Hemoglobin)', department: 'Biochemistry', sampleType: 'Whole Blood', turnaroundTime: '4 Hours', fastingRequired: false, priceINR: 450 },
  { id: 'LAB-04', name: 'Liver Function Test (LFT) with Enzymes', department: 'Biochemistry', sampleType: 'Serum', turnaroundTime: '6 Hours', fastingRequired: false, priceINR: 750 },
  { id: 'LAB-05', name: 'Kidney Function Test (KFT / RFT - Urea, Creatinine, Electrolytes)', department: 'Biochemistry', sampleType: 'Serum', turnaroundTime: '5 Hours', fastingRequired: false, priceINR: 700 },
  { id: 'LAB-06', name: 'Thyroid Profile Total (T3, T4, TSH)', department: 'Endocrinology', sampleType: 'Serum', turnaroundTime: '8 Hours', fastingRequired: true, priceINR: 550 },
  { id: 'LAB-07', name: 'Vitamin D (25-Hydroxy) & Vitamin B12 Duo', department: 'Special Immunology', sampleType: 'Serum', turnaroundTime: '12 Hours', fastingRequired: false, priceINR: 1400 },
  { id: 'LAB-08', name: '12-Lead Electrocardiogram (ECG)', department: 'Cardiology Diagnostics', sampleType: 'Non-Invasive Diagnostic', turnaroundTime: 'Immediate', fastingRequired: false, priceINR: 300 },
  { id: 'LAB-09', name: '2D Echocardiogram with Color Doppler', department: 'Cardiology Diagnostics', sampleType: 'Ultrasound Imaging', turnaroundTime: 'Same Day', fastingRequired: false, priceINR: 2200 },
  { id: 'LAB-10', name: 'Digital Chest X-Ray (PA View)', department: 'Radiology', sampleType: 'Digital Radiography', turnaroundTime: '1 Hour', fastingRequired: false, priceINR: 450 },
  { id: 'LAB-11', name: 'Ultrasound Whole Abdomen & Pelvis', department: 'Radiology', sampleType: 'Sonography', turnaroundTime: 'Same Day', fastingRequired: true, priceINR: 1500 },
  { id: 'LAB-12', name: 'Urine Routine & Microscopic Examination', department: 'Clinical Pathology', sampleType: 'Midstream Urine', turnaroundTime: '3 Hours', fastingRequired: false, priceINR: 200 },
];

export const DiagnosticsLab: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [bookedReceipt, setBookedReceipt] = useState<any | null>(null);
  const [bookingDate, setBookingDate] = useState(() => new Date().toISOString().split('T')[0]);

  const toggleTest = (id: string) => {
    setSelectedTests((prev) =>
      prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]
    );
  };

  const filteredTests = LAB_CATALOG.filter(
    (t) =>
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.department.toLowerCase().includes(search.toLowerCase())
  );

  const totalAmount = selectedTests.reduce((sum, id) => {
    const item = LAB_CATALOG.find((t) => t.id === id);
    return sum + (item ? item.priceINR : 0);
  }, 0);

  const handleConfirmBooking = () => {
    if (selectedTests.length === 0) return;

    setBookedReceipt({
      orderId: `LAB-ORD-${Date.now().toString().slice(-6)}`,
      date: bookingDate,
      tests: LAB_CATALOG.filter((t) => selectedTests.includes(t.id)),
      totalINR: totalAmount,
      sampleCollectionRoom: 'Diagnostic Central Lab Counter #2 (Ground Floor)',
    });

    confetti({
      particleCount: 60,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-teal-600 uppercase tracking-wider flex items-center gap-1.5">
            <TestTube className="w-4 h-4" /> Hospital Diagnostics & Pathology Laboratory
          </span>
          <h2 className="text-xl font-bold text-slate-900">Laboratory Investigations & Imaging Booking</h2>
          <p className="text-xs text-slate-500">
            NABL-Accredited in-house hospital pathology, biochemistry, ECG & radiology tests.
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search blood test, radiology, or ECG..."
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500 outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {bookedReceipt && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-emerald-950 text-base">Diagnostic Appointment Confirmed!</h3>
                <p className="text-xs text-emerald-700">Order ID: {bookedReceipt.orderId} • Date: {bookedReceipt.date}</p>
              </div>
            </div>
            <span className="text-sm font-black text-emerald-900">Paid: ₹{bookedReceipt.totalINR}</span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-emerald-100 text-xs text-slate-700 space-y-1">
            <p className="font-bold text-slate-900">📍 Sample Collection Location:</p>
            <p className="text-slate-600">{bookedReceipt.sampleCollectionRoom}</p>
            <p className="text-[11px] text-slate-500 pt-1">
              Please carry your 12-hour fasting report if you booked Lipid Profile, Blood Glucose, or Abdomen Ultrasound.
            </p>
          </div>
        </div>
      )}

      {/* Grid of Tests & Booking Tray */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Test Directory Cards */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Available Diagnostic Investigations ({filteredTests.length})
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredTests.map((test) => {
              const isSelected = selectedTests.includes(test.id);
              return (
                <div
                  key={test.id}
                  onClick={() => toggleTest(test.id)}
                  className={`p-4 rounded-2xl border transition cursor-pointer relative bg-white flex flex-col justify-between ${
                    isSelected
                      ? 'border-teal-500 ring-2 ring-teal-500/20 bg-teal-50/20 shadow-sm'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-100">
                        {test.department}
                      </span>
                      <span className="text-xs font-black text-slate-900">₹{test.priceINR}</span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-sm mt-2">{test.name}</h4>
                    <p className="text-[11px] text-slate-500 mt-1">Specimen: {test.sampleType}</p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> {test.turnaroundTime}
                    </span>
                    {test.fastingRequired && (
                      <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                        10-12h Fasting
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Test Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm sticky top-24 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <TestTube className="w-4 h-4 text-teal-600" /> Diagnostic Test Basket
            </h3>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Appointment Date</label>
              <input
                type="date"
                min={new Date().toISOString().split('T')[0]}
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full border border-slate-200 rounded-xl p-2 text-xs outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {selectedTests.length === 0 ? (
                <div className="py-8 text-center text-slate-400 text-xs">
                  <TestTube className="w-6 h-6 mx-auto mb-1 opacity-50" />
                  Select one or more diagnostic tests to book a sample collection slot.
                </div>
              ) : (
                selectedTests.map((id) => {
                  const item = LAB_CATALOG.find((t) => t.id === id);
                  if (!item) return null;
                  return (
                    <div key={id} className="p-2.5 bg-slate-50 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <p className="font-bold text-slate-800 text-[11px] line-clamp-1">{item.name}</p>
                        <span className="text-[10px] text-slate-400">{item.department}</span>
                      </div>
                      <span className="font-bold text-teal-700 shrink-0 ml-2">₹{item.priceINR}</span>
                    </div>
                  );
                })
              )}
            </div>

            {selectedTests.length > 0 && (
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                  <span>Total Amount:</span>
                  <span className="text-teal-600 text-base">₹{totalAmount}</span>
                </div>

                <button
                  onClick={handleConfirmBooking}
                  className="w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" /> Confirm & Schedule Tests (₹{totalAmount})
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
