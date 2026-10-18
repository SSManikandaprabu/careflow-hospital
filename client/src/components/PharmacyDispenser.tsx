import React, { useState, useMemo } from 'react';
import { Pill, Search, CheckCircle2, ShoppingBag, Filter, ArrowUpDown } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generateHospitalDrugInventory, type Medication } from '../data/drugInventoryData';

export const PharmacyDispenser: React.FC = () => {
  const [searchToken, setSearchToken] = useState('CARD-01');
  const [dispensedOrders, setDispensedOrders] = useState<string[]>([]);
  const [filterQuery, setFilterQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;
  const [message, setMessage] = useState('');

  // Hospital Formulary Inventory (500+ items)
  const [inventory, setInventory] = useState<Medication[]>(() => generateHospitalDrugInventory());

  // Current Patient Prescription to Dispense
  const currentRx = {
    patientName: 'John Doe',
    doctorName: 'Dr. Marcus Vance (Cardiology)',
    date: new Date().toLocaleDateString('en-IN'),
    tokenNumber: 'CARD-01',
    prescribedItems: [
      { name: 'Tab. Amlodipine 5mg', quantity: 30, frequency: 'Once daily after breakfast', priceINR: 65 },
      { name: 'Tab. Aspirin Gastro-resistant 75mg', quantity: 30, frequency: 'Once daily post-lunch', priceINR: 42 },
      { name: 'Tab. Pantoprazole Gastro-Resistant 40mg', quantity: 15, frequency: 'Once daily before breakfast', priceINR: 75 },
    ],
  };

  const isDispensed = dispensedOrders.includes(currentRx.tokenNumber);
  const totalCost = currentRx.prescribedItems.reduce((acc, curr) => acc + curr.priceINR, 0);

  const categories = useMemo(() => {
    const set = new Set<string>();
    inventory.forEach((m) => set.add(m.category));
    return ['ALL', ...Array.from(set)];
  }, [inventory]);

  const handleDispense = () => {
    setDispensedOrders((prev) => [...prev, currentRx.tokenNumber]);
    setInventory((prev) =>
      prev.map((item) => {
        if (item.name.includes('Amlodipine') || item.name.includes('Aspirin') || item.name.includes('Pantoprazole')) {
          return { ...item, stock: Math.max(0, item.stock - 30) };
        }
        return item;
      })
    );

    setMessage(`✅ Medicines successfully dispensed & inventory deducted for Token #${currentRx.tokenNumber}!`);

    confetti({
      particleCount: 50,
      spread: 50,
      origin: { y: 0.7 },
    });
  };

  // Filter & Sort Logic
  const filteredInventory = useMemo(() => {
    return inventory
      .filter((m) => {
        const matchesSearch =
          m.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
          m.category.toLowerCase().includes(filterQuery.toLowerCase()) ||
          m.dosage.toLowerCase().includes(filterQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'name') return a.name.localeCompare(b.name);
        if (sortBy === 'stock') return a.stock - b.stock;
        if (sortBy === 'price') return a.priceINR - b.priceINR;
        return 0;
      });
  }, [inventory, filterQuery, selectedCategory, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredInventory.length / itemsPerPage);
  const paginatedInventory = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredInventory.slice(start, start + itemsPerPage);
  }, [filteredInventory, currentPage]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1.5">
            <Pill className="w-4 h-4" /> Hospital Pharmacy & Formulary Hub
          </span>
          <h2 className="text-xl font-bold text-slate-900">Hospital Medicine Inventory ({inventory.length} SKUs)</h2>
          <p className="text-xs text-slate-500">
            Real-time synchronization with doctor e-prescriptions, automated stock deduction, and billing counter.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Scan Token (e.g. CARD-01)"
            className="border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold uppercase focus:ring-2 focus:ring-amber-500 outline-none w-48"
            value={searchToken}
            onChange={(e) => setSearchToken(e.target.value)}
          />
          <button className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-sm transition">
            Fetch Rx
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-medium">
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Active Prescription to Dispense */}
        <div className="lg:col-span-1 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <span className="text-[10px] font-black uppercase text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                Token #{currentRx.tokenNumber}
              </span>
              <h3 className="font-bold text-slate-900 text-base mt-1">{currentRx.patientName}</h3>
              <p className="text-xs text-slate-500">{currentRx.doctorName}</p>
            </div>

            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isDispensed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
              }`}
            >
              {isDispensed ? 'DISPENSED' : 'PENDING'}
            </span>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase text-slate-400">Doctor Prescribed Medications</h4>
            {currentRx.prescribedItems.map((item, index) => (
              <div key={index} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-800">{item.name}</span>
                  <span className="text-xs font-semibold text-emerald-700">₹{item.priceINR}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Qty: {item.quantity} units</span>
                  <span>{item.frequency}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-100 pt-3 flex justify-between items-center text-sm">
            <span className="font-bold text-slate-700">Total Medicine Cost:</span>
            <span className="font-black text-emerald-600 text-base">₹{totalCost}</span>
          </div>

          <button
            onClick={handleDispense}
            disabled={isDispensed}
            className={`w-full py-2.5 text-xs font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2 ${
              isDispensed
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            {isDispensed ? 'Medications Already Dispensed' : `Dispense & Bill Prescription (₹${totalCost})`}
          </button>
        </div>

        {/* Right 2 Columns: 500+ Hospital Medicine Inventory Table */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-amber-600" /> Pharmacy Formulary Catalog ({filteredInventory.length} results)
            </h3>

            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search by drug name or salt..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none"
                value={filterQuery}
                onChange={(e) => {
                  setFilterQuery(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Category Filter & Sorting Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={selectedCategory}
                onChange={(e) => {
                  setSelectedCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none bg-slate-50 font-medium text-slate-700"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-500 font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e: any) => setSortBy(e.target.value)}
                className="border border-slate-200 rounded-lg px-2.5 py-1 text-xs outline-none bg-slate-50 font-medium text-slate-700"
              >
                <option value="name">Drug Name (A-Z)</option>
                <option value="stock">Stock Available</option>
                <option value="price">Price (₹)</option>
              </select>
            </div>
          </div>

          {/* 500+ Items Inventory Table */}
          <div className="overflow-x-auto max-h-[500px] border border-slate-100 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase font-bold sticky top-0 z-10 border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Item Code & Name</th>
                  <th className="py-2.5 px-3">Dosage / Pack</th>
                  <th className="py-2.5 px-3">Therapeutic Category</th>
                  <th className="py-2.5 px-3">Stock Units</th>
                  <th className="py-2.5 px-3 text-right">Unit Price (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {paginatedInventory.map((med) => {
                  const isLow = med.stock < 150;
                  return (
                    <tr key={med.id} className="hover:bg-slate-50/80 transition">
                      <td className="py-2.5 px-3">
                        <div className="font-bold text-slate-900">{med.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{med.id}</div>
                      </td>
                      <td className="py-2.5 px-3 font-mono font-medium text-slate-800">{med.dosage}</td>
                      <td className="py-2.5 px-3 text-slate-600 text-[11px]">{med.category}</td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            isLow
                              ? 'bg-rose-100 text-rose-800 border border-rose-200'
                              : 'bg-emerald-100 text-emerald-800'
                          }`}
                        >
                          {med.stock} {isLow ? '• Low Stock' : 'In Stock'}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-slate-900 text-xs">₹{med.priceINR}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
            <span>
              Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
              {Math.min(currentPage * itemsPerPage, filteredInventory.length)} of {filteredInventory.length} medications
            </span>

            <div className="flex items-center gap-1.5">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                className="px-2.5 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-medium"
              >
                Previous
              </button>
              <span className="font-bold text-slate-800 px-2">
                Page {currentPage} of {totalPages || 1}
              </span>
              <button
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                className="px-2.5 py-1 rounded-lg border border-slate-200 disabled:opacity-40 hover:bg-slate-50 font-medium"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
