import React, { useState, useEffect, useMemo } from 'react';
import { X, Clock, Armchair, ChevronRight } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const SeatMatrixModal = ({
  show,
  movie,
  theatre,
  onClose,
  onProceedToCheckout
}) => {
  const { user } = useAuth();
  const { toast, error: toastError } = useToast();
  const [seats, setSeats] = useState([]);
  const [selectedSeatNumbers, setSelectedSeatNumbers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locking, setLocking] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(null);

  useEffect(() => {
    async function loadSeats() {
      try {
        const data = await api.getShowDetails(show.id);
        setSeats(data.seats);
      } catch (err) {
        toastError('Failed to load auditorium seating layout.');
      } finally {
        setLoading(false);
      }
    }
    loadSeats();

    const interval = setInterval(loadSeats, 10000);
    return () => clearInterval(interval);
  }, [show.id, toastError]);

  useEffect(() => {
    if (lockCountdown === null || lockCountdown <= 0) return;
    const timer = setInterval(() => {
      setLockCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          toast('Seat reservation hold expired. Please reselect your seats.', 'info');
          setSelectedSeatNumbers([]);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [lockCountdown, toast]);

  const handleToggleSeat = (seat) => {
    if (seat.status === 'reserved') return;
    if (seat.status === 'locked' && seat.lockedByUserId !== user?.id) return;

    if (selectedSeatNumbers.includes(seat.seatNumber)) {
      setSelectedSeatNumbers((prev) => prev.filter((s) => s !== seat.seatNumber));
    } else {
      if (selectedSeatNumbers.length >= 8) {
        toast('Maximum 8 seats allowed per booking.', 'info');
        return;
      }
      setSelectedSeatNumbers((prev) => [...prev, seat.seatNumber]);
    }
  };

  const rowsMap = useMemo(() => {
    const map = {};
    seats.forEach((seat) => {
      if (!map[seat.row]) map[seat.row] = [];
      map[seat.row].push(seat);
    });
    Object.keys(map).forEach((r) => {
      map[r].sort((a, b) => a.col - b.col);
    });
    return map;
  }, [seats]);

  const selectedSeats = useMemo(() => {
    return seats.filter((s) => selectedSeatNumbers.includes(s.seatNumber));
  }, [seats, selectedSeatNumbers]);

  const subtotal = useMemo(() => {
    return selectedSeats.reduce((sum, s) => sum + s.price, 0);
  }, [selectedSeats]);

  const handleLockAndProceed = async () => {
    if (selectedSeats.length === 0) return;

    setLocking(true);
    try {
      await api.lockSeats(show.id, selectedSeatNumbers);
      setLockCountdown(300);
      onProceedToCheckout(selectedSeats, subtotal);
    } catch (err) {
      toastError(err.message || 'Selected seats are no longer available. Please choose other seats.');
      const data = await api.getShowDetails(show.id);
      setSeats(data.seats);
      setSelectedSeatNumbers([]);
    } finally {
      setLocking(false);
    }
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-hidden flex flex-col shadow-2xl">
        
        <div className="p-4 sm:p-6 border-b border-neutral-800 flex items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
              <span className="text-amber-400 font-semibold">{theatre.name}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>Screen {show.screenNumber}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-white font-mono">{show.date} @ {show.startTime}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-300 uppercase tracking-wider">{show.format}</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold font-display text-white mt-0.5">
              Select Seats for {movie.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 bg-neutral-950/40 border-b border-neutral-800/80 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-medium text-neutral-300">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md border border-neutral-700 bg-neutral-800" />
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-amber-500 border border-amber-400 shadow-sm shadow-amber-500/20" />
            <span className="text-amber-400 font-semibold">Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-neutral-800/40 border border-neutral-800/80 cursor-not-allowed text-neutral-600 flex items-center justify-center text-[10px]">
              ✕
            </div>
            <span className="text-neutral-500">Booked</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-neutral-900 border border-amber-500/80 text-amber-500 flex items-center justify-center text-[10px]">
              ⏳
            </div>
            <span className="text-neutral-400">Locked / In-Cart</span>
          </div>
        </div>

        <div className="p-6 overflow-y-auto flex-1 flex flex-col items-center">
          
          <div className="w-full max-w-2xl mb-10 flex flex-col items-center">
            <div className="relative w-full h-8 overflow-hidden">
              <div className="absolute inset-x-8 top-0 h-16 rounded-[100%] border-t-4 border-amber-500/60 shadow-[0_-8px_25px_rgba(245,158,11,0.25)]" />
            </div>
            <span className="text-[11px] tracking-[0.25em] uppercase font-bold text-neutral-500 mt-1">
              All Eyes on Screen
            </span>
          </div>

          {loading ? (
            <div className="py-16 text-sm text-neutral-500">Loading seat layout...</div>
          ) : (
            <div className="space-y-3 w-full max-w-xl pb-4">
              
              {Object.entries(rowsMap).map(([rowKey, rowSeats]) => {
                const tier = rowSeats[0]?.tier || 'standard';
                const tierLabel = tier === 'vip' ? 'VIP Recliner' : tier === 'premium' ? 'Premium' : 'Standard';
                const tierPrice = tier === 'vip' ? show.pricing.vip : tier === 'premium' ? show.pricing.premium : show.pricing.standard;

                return (
                  <div key={rowKey} className="flex items-center gap-2 sm:gap-3">
                    <span className="w-5 text-center text-xs font-mono font-bold text-neutral-500">
                      {rowKey}
                    </span>

                    <div className="flex-1 flex justify-center gap-1.5 sm:gap-2">
                      {rowSeats.map((seat) => {
                        const isSelected = selectedSeatNumbers.includes(seat.seatNumber);
                        const isBooked = seat.status === 'reserved';
                        const isLocked = seat.status === 'locked' && seat.lockedByUserId !== user?.id;

                        let btnClass = 'bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700/60';
                        if (isBooked) {
                          btnClass = 'bg-neutral-900/40 text-neutral-600 border border-neutral-800/60 cursor-not-allowed opacity-40';
                        } else if (isLocked) {
                          btnClass = 'bg-neutral-900 border border-amber-500/50 text-amber-500/70 cursor-not-allowed';
                        } else if (isSelected) {
                          btnClass = 'bg-amber-500 text-neutral-950 font-bold border border-amber-400 shadow-md shadow-amber-500/30 scale-105';
                        }

                        return (
                          <button
                            key={seat.seatNumber}
                            disabled={isBooked || isLocked}
                            onClick={() => handleToggleSeat(seat)}
                            className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg text-xs font-mono flex items-center justify-center transition-all ${btnClass}`}
                            title={`${seat.seatNumber} · ${tierLabel} (₹${seat.price})`}
                          >
                            {seat.col}
                          </button>
                        );
                      })}
                    </div>

                    <span className="hidden sm:inline-block w-20 text-right text-[11px] text-neutral-500 font-mono">
                      ₹{tierPrice}
                    </span>
                  </div>
                );
              })}

              <div className="pt-6 border-t border-neutral-800/80 flex items-center justify-around text-xs text-neutral-400">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                  <span>Standard: <strong className="text-white font-mono">₹{show.pricing.standard}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
                  <span>Premium: <strong className="text-white font-mono">₹{show.pricing.premium}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span>VIP Recliner: <strong className="text-white font-mono">₹{show.pricing.vip}</strong></span>
                </div>
              </div>

            </div>
          )}

        </div>

        <div className="p-4 sm:p-6 bg-neutral-950 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <Armchair className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs text-neutral-400">
                {selectedSeatNumbers.length === 0 ? (
                  'No seats selected yet'
                ) : (
                  <>Selected: <strong className="text-white font-mono">{selectedSeatNumbers.join(', ')}</strong> ({selectedSeatNumbers.length} {selectedSeatNumbers.length === 1 ? 'ticket' : 'tickets'})</>
                )}
              </div>
              <div className="text-sm font-semibold text-white">
                Subtotal: <span className="text-amber-400 font-mono text-base">₹{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            {lockCountdown !== null && (
              <div className="px-3 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-1.5 text-xs text-amber-400 font-mono">
                <Clock className="w-4 h-4 animate-spin" />
                <span>Hold: {formatTimer(lockCountdown)}</span>
              </div>
            )}

            <button
              disabled={selectedSeatNumbers.length === 0 || locking}
              onClick={handleLockAndProceed}
              className={`flex-1 sm:flex-none px-6 py-3 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all whitespace-nowrap ${
                selectedSeatNumbers.length === 0 || locking
                  ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-lg shadow-amber-500/20 active:scale-[0.98]'
              }`}
            >
              {locking ? 'Locking Seats...' : 'Proceed to Checkout'}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
