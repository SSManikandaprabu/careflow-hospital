import React, { useState } from 'react';
import { CreditCard, CheckCircle2, ShieldCheck, Lock, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PaymentCheckoutModalProps {
  doctor: any;
  slot: string;
  date: string;
  onSuccess: (paymentInfo: any) => void;
  onCancel: () => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  doctor,
  slot,
  date,
  onSuccess,
  onCancel,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'CARD' | 'INSURANCE' | 'CASH'>('UPI');
  const [upiId, setUpiId] = useState('patient@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvc, setCvc] = useState('382');
  const [processing, setProcessing] = useState(false);
  const [paid, setPaid] = useState(false);

  const fee = doctor?.consultationFee || 800;
  const platformFee = 50; // INR 50 registration
  const total = fee + platformFee;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setPaid(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onSuccess({
          transactionId: `TXN-INR-${Date.now()}-${Math.floor(Math.random() * 9000 + 1000)}`,
          paymentMethod,
          amountPaid: total,
          currency: 'INR',
          status: 'SUCCESS',
        });
      }, 1000);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100">
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 px-6 py-5 text-white flex justify-between items-center">
          <div>
            <h3 className="font-bold text-lg flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-200" /> Secure Healthcare Billing (INR)
            </h3>
            <p className="text-xs text-emerald-100">UPI, RuPay / Cards & Ayushman Bharat / Insurance</p>
          </div>
          <button onClick={onCancel} className="text-white/70 hover:text-white text-xl font-bold">✕</button>
        </div>

        <div className="p-6">
          {paid ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto animate-bounce" />
              <h4 className="text-lg font-bold text-slate-900">Payment Authorized!</h4>
              <p className="text-xs text-slate-500">
                Receipt generated. Finalizing hospital booking and queue token...
              </p>
            </div>
          ) : (
            <form onSubmit={handlePay} className="space-y-4">
              {/* Order summary */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Consulting Physician:</span>
                  <span className="font-bold text-slate-800">
                    Dr. {doctor?.user?.firstName} {doctor?.user?.lastName}
                  </span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Schedule:</span>
                  <span className="font-semibold text-slate-800">{date} at {slot}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Doctor Consultation Fee:</span>
                  <span className="font-semibold text-slate-800">₹{fee.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Hospital Digital OPD Slip Fee:</span>
                  <span className="font-semibold text-slate-800">₹{platformFee.toLocaleString('en-IN')}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 flex justify-between font-black text-sm text-slate-900">
                  <span>Total Payable:</span>
                  <span className="text-emerald-600">₹{total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">Payment Method</label>
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      paymentMethod === 'UPI'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    ⚡ UPI
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      paymentMethod === 'CARD'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    💳 Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('INSURANCE')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      paymentMethod === 'INSURANCE'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    🏥 TPA / PM-JAY
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH')}
                    className={`py-2 text-xs font-semibold rounded-xl border transition ${
                      paymentMethod === 'CASH'
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700 font-bold'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    💵 Counter
                  </button>
                </div>
              </div>

              {paymentMethod === 'UPI' && (
                <div>
                  <label className="text-xs font-medium text-slate-600">Enter UPI VPA ID (GPay / PhonePe / Paytm)</label>
                  <input
                    type="text"
                    className="mt-1 w-full border border-slate-200 rounded-xl p-2.5 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="mobile@upi or yourname@okaxis"
                  />
                  <p className="text-[11px] text-slate-400 mt-1">
                    Instant UPI payment request will be triggered to your UPI app.
                  </p>
                </div>
              )}

              {paymentMethod === 'CARD' && (
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-600">Card Number</label>
                    <div className="relative mt-1">
                      <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                      <input
                        type="text"
                        className="w-full pl-9 border border-slate-200 rounded-xl p-2 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium text-slate-600">Expiry (MM/YY)</label>
                      <input
                        type="text"
                        className="mt-1 w-full border border-slate-200 rounded-xl p-2 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium text-slate-600">CVC</label>
                      <input
                        type="text"
                        className="mt-1 w-full border border-slate-200 rounded-xl p-2 text-xs font-mono outline-none focus:ring-2 focus:ring-emerald-500"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'INSURANCE' && (
                <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-xs text-sky-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    Your registered health insurance provider (BlueCross / Medicare) will be billed automatically upon clinical check-in.
                  </span>
                </div>
              )}

              {paymentMethod === 'CASH' && (
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800">
                  You can pay ₹{total.toLocaleString('en-IN')} in cash directly at Room Reception Counter #{doctor?.roomNumber}.
                </div>
              )}

              <button
                type="submit"
                disabled={processing}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                {processing ? 'Processing Payment...' : `Authorize & Confirm (₹${total.toLocaleString('en-IN')})`}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
