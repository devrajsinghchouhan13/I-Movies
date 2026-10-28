import React, { useState, useEffect } from 'react';
import { X, Ticket, AlertTriangle, RotateCcw, Eye, Film } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export const BookingHistoryModal = ({
  onClose,
  onViewTicket
}) => {
  const { success, error: toastError } = useToast();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [cancelReason, setCancelReason] = useState('Change of schedule');

  const loadBookings = async () => {
    try {
      const res = await api.getMyBookings();
      setBookings(res.bookings);
    } catch (err) {
      toastError('Failed to load your booking history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setCancellingId(cancelModalBooking.id);
    try {
      await api.cancelBooking(cancelModalBooking.id, cancelReason);
      success(`Booking #${cancelModalBooking.bookingReference} cancelled. Full refund initiated.`);
      setCancelModalBooking(null);
      await loadBookings();
    } catch (err) {
      toastError(err.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold font-display text-white">
              My Cinema Reservations
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {loading ? (
            <div className="py-16 text-center text-sm text-neutral-500">
              Loading your bookings...
            </div>
          ) : bookings.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <Film className="w-12 h-12 text-neutral-700 mx-auto" />
              <h3 className="text-base font-semibold text-white">No Bookings Found</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                You haven't reserved any cinema seats yet. Browse now showing movies and pick your favorite seats!
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              const isConfirmed = booking.status === 'confirmed';

              return (
                <div
                  key={booking.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isConfirmed
                      ? 'bg-neutral-950/60 border-neutral-800/80 hover:border-neutral-700'
                      : 'bg-neutral-950/30 border-neutral-800/40 opacity-70'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 justify-between items-start">
                    <div className="flex gap-4">
                      <img
                        src={booking.moviePoster}
                        alt={booking.movieTitle}
                        className="w-16 h-22 object-cover rounded-xl border border-neutral-800 shrink-0"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs">
                          <span className="font-mono text-amber-400 font-semibold">{booking.bookingReference}</span>
                          <span className="text-neutral-600">·</span>
                          <span className={isConfirmed ? 'text-emerald-400 font-semibold' : 'text-rose-400 font-semibold'}>
                            {booking.status.toUpperCase()}
                          </span>
                        </div>

                        <h3 className="font-display font-bold text-white text-base">
                          {booking.movieTitle}
                        </h3>

                        <p className="text-xs text-neutral-400">
                          {booking.theatreName} · Screen {booking.screenNumber} ({booking.format})
                        </p>

                        <div className="text-xs text-neutral-300 pt-1">
                          Date: <span className="font-mono text-white">{booking.showDate} @ {booking.showTime}</span>
                          <span className="mx-2 text-neutral-600">·</span>
                          Seats: <span className="font-mono text-amber-400 font-bold">{booking.seats?.map((s) => s.seatNumber).join(', ')}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:items-end justify-between self-stretch sm:self-auto gap-3 pt-2 sm:pt-0">
                      <div className="font-mono text-base font-bold text-white">
                        ₹{booking.totalAmount?.toFixed(2)}
                      </div>

                      <div className="flex items-center gap-2">
                        {isConfirmed && (
                          <>
                            <button
                              onClick={() => onViewTicket(booking)}
                              className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <Eye className="w-3.5 h-3.5 text-amber-400" />
                              View Pass
                            </button>

                            <button
                              onClick={() => setCancelModalBooking(booking)}
                              className="px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </>
                        )}

                        {!isConfirmed && (
                          <span className="text-xs text-neutral-500 italic">
                            Cancelled on {booking.cancelledAt?.slice(0, 10)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cancelModalBooking && (
          <div className="p-5 bg-neutral-950 border-t border-neutral-800 animate-in slide-in-from-bottom-2">
            <div className="max-w-xl mx-auto space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-bold">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                Cancel Reservation #{cancelModalBooking.bookingReference}?
              </div>
              <p className="text-xs text-neutral-300">
                Are you sure you want to cancel your tickets for <strong>{cancelModalBooking.movieTitle}</strong>? The seats ({cancelModalBooking.seats?.map((s) => s.seatNumber).join(', ')}) will immediately be released back to the general pool, and a full refund of <strong>₹{cancelModalBooking.totalAmount?.toFixed(2)}</strong> will be issued.
              </p>

              <div>
                <label className="text-[11px] text-neutral-400 block mb-1">Reason for cancellation</label>
                <select
                  value={cancelReason}
                  onChange={(e) => setCancelReason(e.target.value)}
                  className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-500"
                >
                  <option value="Change of schedule">Change of schedule</option>
                  <option value="Booked wrong showtime or date">Booked wrong showtime or date</option>
                  <option value="Accidental duplicate reservation">Accidental duplicate reservation</option>
                  <option value="Personal emergency">Personal emergency</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => setCancelModalBooking(null)}
                  className="px-3 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold"
                >
                  Keep Reservation
                </button>
                <button
                  disabled={cancellingId !== null}
                  onClick={handleConfirmCancel}
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition-all"
                >
                  {cancellingId ? 'Processing Refund...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
