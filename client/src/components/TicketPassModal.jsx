import React from 'react';
import { X, Printer, CheckCircle, MapPin } from 'lucide-react';

export const TicketPassModal = ({ booking, onClose }) => {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-lg w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        
        <div className="p-4 sm:p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold font-display text-white">
              Official Cinema Pass
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1 print:p-0">
          <div className="rounded-2xl bg-neutral-950 border border-neutral-800 overflow-hidden relative shadow-xl">
            
            <div className="p-5 bg-gradient-to-r from-amber-500/20 via-neutral-900 to-neutral-900 border-b border-neutral-800 flex gap-4">
              <img
                src={booking.moviePoster}
                alt={booking.movieTitle}
                className="w-16 h-22 object-cover rounded-xl border border-neutral-800 shrink-0 shadow-md"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/client/src/assets/images/hero_cinema_interstellar_1793178113951.jpg';
                }}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  <span>{booking.format} Presentation</span>
                  <span className="text-neutral-600">·</span>
                  <span className="text-emerald-400">{booking.status?.toUpperCase()}</span>
                </div>
                <h3 className="text-lg font-bold font-display text-white mt-0.5 leading-snug">
                  {booking.movieTitle}
                </h3>
                <p className="text-xs text-neutral-400 mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                  {booking.theatreName}
                </p>
              </div>
            </div>

            <div className="relative py-2 flex items-center justify-between">
              <div className="w-4 h-8 bg-neutral-900 rounded-r-full -ml-2 border-r border-neutral-800" />
              <div className="flex-1 border-b-2 border-dashed border-neutral-800 mx-2" />
              <div className="w-4 h-8 bg-neutral-900 rounded-l-full -mr-2 border-l border-neutral-800" />
            </div>

            <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 block text-[11px] uppercase tracking-wider">Show Date</span>
                <span className="font-semibold text-white font-mono mt-0.5 block">{booking.showDate}</span>
              </div>

              <div>
                <span className="text-neutral-500 block text-[11px] uppercase tracking-wider">Showtime</span>
                <span className="font-semibold text-amber-400 font-mono mt-0.5 block">{booking.showTime}</span>
              </div>

              <div>
                <span className="text-neutral-500 block text-[11px] uppercase tracking-wider">Screen</span>
                <span className="font-semibold text-white mt-0.5 block">Auditorium #{booking.screenNumber}</span>
              </div>

              <div className="col-span-2">
                <span className="text-neutral-500 block text-[11px] uppercase tracking-wider">Reserved Seats</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {booking.seats?.map((s) => (
                    <span
                      key={s.seatNumber}
                      className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold"
                    >
                      {s.seatNumber} ({s.tier})
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-neutral-500 block text-[11px] uppercase tracking-wider">Amount Paid</span>
                <span className="font-semibold text-white font-mono mt-0.5 block text-sm">₹{booking.totalAmount?.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-5 bg-neutral-900/80 border-t border-neutral-800 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-neutral-500 uppercase tracking-widest block font-medium">
                  Booking Reference
                </span>
                <span className="text-base font-bold font-mono text-white tracking-wider">
                  {booking.bookingReference}
                </span>
                <span className="text-[11px] text-neutral-400 block mt-0.5">
                  Guest: {booking.userName}
                </span>
              </div>

              <div className="p-2 bg-white rounded-xl shadow-md shrink-0 flex flex-col items-center">
                <svg className="w-16 h-16" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="5" y="5" width="26" height="26" rx="4" fill="#000" />
                  <rect x="9" y="9" width="18" height="18" rx="2" fill="#fff" />
                  <rect x="13" y="13" width="10" height="10" rx="1" fill="#000" />

                  <rect x="69" y="5" width="26" height="26" rx="4" fill="#000" />
                  <rect x="73" y="9" width="18" height="18" rx="2" fill="#fff" />
                  <rect x="77" y="13" width="10" height="10" rx="1" fill="#000" />

                  <rect x="5" y="69" width="26" height="26" rx="4" fill="#000" />
                  <rect x="9" y="73" width="18" height="18" rx="2" fill="#fff" />
                  <rect x="13" y="77" width="10" height="10" rx="1" fill="#000" />

                  <rect x="36" y="8" width="6" height="6" fill="#000" />
                  <rect x="46" y="14" width="6" height="6" fill="#000" />
                  <rect x="56" y="8" width="6" height="6" fill="#000" />
                  <rect x="38" y="24" width="6" height="6" fill="#000" />
                  <rect x="50" y="28" width="6" height="6" fill="#000" />
                  
                  <rect x="8" y="38" width="6" height="6" fill="#000" />
                  <rect x="18" y="48" width="6" height="6" fill="#000" />
                  <rect x="26" y="40" width="6" height="6" fill="#000" />
                  
                  <rect x="38" y="42" width="10" height="10" fill="#000" />
                  <rect x="54" y="42" width="8" height="8" fill="#000" />
                  <rect x="70" y="40" width="6" height="6" fill="#000" />
                  <rect x="82" y="48" width="8" height="8" fill="#000" />

                  <rect x="36" y="64" width="8" height="8" fill="#000" />
                  <rect x="48" y="72" width="6" height="6" fill="#000" />
                  <rect x="60" y="66" width="6" height="6" fill="#000" />
                  <rect x="72" y="72" width="8" height="8" fill="#000" />
                  <rect x="84" y="82" width="8" height="8" fill="#000" />
                </svg>
                <span className="text-[9px] font-mono text-neutral-600 font-bold mt-1">SCAN AT ENTRY</span>
              </div>
            </div>

          </div>
        </div>

        <div className="p-4 sm:p-5 bg-neutral-950 border-t border-neutral-800 flex items-center justify-between gap-3">
          <p className="text-xs text-neutral-500">
            Present this digital barcode or printout at the cinema gates.
          </p>

          <button
            onClick={handlePrint}
            className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-2 transition-colors whitespace-nowrap"
          >
            <Printer className="w-4 h-4 text-amber-400" />
            Print Pass
          </button>
        </div>

      </div>
    </div>
  );
};
