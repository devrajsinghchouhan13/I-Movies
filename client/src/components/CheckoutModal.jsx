import React, { useState } from 'react';
import { X, ShieldCheck, CreditCard, Smartphone, Wallet, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export const CheckoutModal = ({
  movie,
  show,
  theatre,
  selectedSeats,
  subtotal,
  onClose,
  onBookingSuccess
}) => {
  const { success, error: toastError } = useToast();
  const [paymentMethod, setPaymentMethod] = useState('credit_card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 8839');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('883');
  const [upiId, setUpiId] = useState('cinema.fan@okhdfc');
  const [isProcessing, setIsProcessing] = useState(false);

  const convenienceFee = Number((selectedSeats.length * 25).toFixed(2));
  const tax = Number((subtotal * 0.18).toFixed(2));
  const totalAmount = Number((subtotal + convenienceFee + tax).toFixed(2));

  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const res = await api.createBooking({
        showId: show.id,
        seats: selectedSeats.map((s) => ({
          seatNumber: s.seatNumber,
          row: s.row,
          tier: s.tier,
          price: s.price
        })),
        paymentMethod,
        cardLast4: paymentMethod === 'credit_card' ? '8839' : undefined
      });

      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });

      success(`Booking confirmed! Reference #${res.booking.bookingReference}`);
      onBookingSuccess(res.booking);
    } catch (err) {
      toastError(err.message || 'Payment processing failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-2xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold font-display text-white">
              Secure Cinema Checkout
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800 flex gap-4">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-16 h-22 object-cover rounded-xl border border-neutral-800 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1">
              <h3 className="text-base font-bold text-white font-display">{movie.title}</h3>
              <p className="text-xs text-neutral-400 mt-0.5">{theatre.name} · Screen {show.screenNumber}</p>
              <p className="text-xs text-amber-400 font-mono mt-0.5">{show.date} @ {show.startTime} ({show.format})</p>
              
              <div className="mt-2 text-xs text-neutral-300">
                Seats: <strong className="text-white font-mono">{selectedSeats.map((s) => s.seatNumber).join(', ')}</strong>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider block">
              Choose Payment Method
            </label>

            <div className="grid grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-sm'
                    : 'bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>Credit/Debit</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'upi'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-sm'
                    : 'bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Smartphone className="w-5 h-5" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('apple_pay')}
                className={`p-3 rounded-xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === 'apple_pay'
                    ? 'bg-amber-500/10 border-amber-500 text-amber-400 shadow-sm'
                    : 'bg-neutral-950/50 border-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-800'
                }`}
              >
                <Wallet className="w-5 h-5" />
                <span>Apple / GPay</span>
              </button>
            </div>

            {paymentMethod === 'credit_card' && (
              <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800 space-y-3">
                <div>
                  <label className="text-[11px] text-neutral-400 font-medium block mb-1">Card Number</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-neutral-400 font-medium block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-neutral-400 font-medium block mb-1">Security Code (CVV)</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      maxLength={4}
                      className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'upi' && (
              <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800 space-y-2">
                <label className="text-[11px] text-neutral-400 font-medium block">Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>
            )}

            {paymentMethod === 'apple_pay' && (
              <div className="p-4 rounded-xl bg-neutral-950/40 border border-neutral-800 text-center text-xs text-neutral-400">
                Ready to authenticate via Apple Pay / Google Wallet biometric pass.
              </div>
            )}
          </div>

          <div className="p-4 rounded-2xl bg-neutral-950/40 border border-neutral-800 space-y-2 text-xs">
            <div className="flex justify-between text-neutral-400">
              <span>Tickets ({selectedSeats.length} × Tier pricing)</span>
              <span className="font-mono text-neutral-200">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Convenience Fee (₹25 / ticket)</span>
              <span className="font-mono text-neutral-200">₹{convenienceFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-neutral-400">
              <span>Integrated GST (18%)</span>
              <span className="font-mono text-neutral-200">₹{tax.toFixed(2)}</span>
            </div>
            <div className="pt-2 border-t border-neutral-800 flex justify-between text-sm font-bold text-white">
              <span>Total Payable</span>
              <span className="text-amber-400 font-mono text-base">₹{totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="p-5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <Lock className="w-3.5 h-3.5 text-emerald-500" />
            <span>256-bit Encrypted Checkout</span>
          </div>

          <button
            disabled={isProcessing}
            onClick={handlePay}
            className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-lg shadow-amber-500/20 active:scale-[0.98] disabled:opacity-50"
          >
            {isProcessing ? 'Verifying & Reserving...' : `Pay ₹${totalAmount.toFixed(2)} & Reserve`}
          </button>
        </div>

      </div>
    </div>
  );
};
