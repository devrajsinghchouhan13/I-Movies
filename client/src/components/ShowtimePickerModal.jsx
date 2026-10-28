import React, { useState, useEffect } from 'react';
import { X, Clock, MapPin } from 'lucide-react';
import { api } from '../services/api.js';

export const ShowtimePickerModal = ({
  movie,
  onClose,
  onSelectShow
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [shows, setShows] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  const dates = [
    { label: 'Today', date: new Date().toISOString().split('T')[0] },
    { label: 'Tomorrow', date: new Date(Date.now() + 86400000).toISOString().split('T')[0] },
    { label: 'Day After', date: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0] }
  ];

  useEffect(() => {
    if (!movie) return;

    async function loadShowtimes() {
      setLoading(true);
      try {
        const [showsRes, theatresRes] = await Promise.all([
          api.getShows({ movieId: movie.id, date: selectedDate }),
          api.getTheatres()
        ]);
        setShows(showsRes.shows);
        setTheatres(theatresRes.theatres);
      } catch (err) {
        console.error('Failed to load showtimes', err);
      } finally {
        setLoading(false);
      }
    }

    loadShowtimes();
  }, [movie, selectedDate]);

  if (!movie) return null;

  const showsByTheatre = theatres
    .map((theatre) => {
      const theatreShows = shows.filter((s) => s.theatreId === theatre.id);
      return { theatre, shows: theatreShows };
    })
    .filter((group) => group.shows.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        
        <div className="p-6 border-b border-neutral-800 flex items-start justify-between gap-4">
          <div className="flex gap-4">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-16 h-22 object-cover rounded-xl border border-neutral-800 shrink-0"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2 text-xs text-neutral-400 font-medium">
                <span>{movie.genre?.join(', ')}</span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span>{movie.durationMinutes} min</span>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="text-amber-400 font-semibold">★ {movie.rating?.toFixed(1)}</span>
              </div>
              <h2 className="text-xl font-bold font-display text-white mt-1">
                {movie.title}
              </h2>
              <p className="text-xs text-neutral-400 mt-0.5">Select your preferred date, cinema, and auditorium format</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center gap-2 overflow-x-auto">
          {dates.map((d) => (
            <button
              key={d.date}
              onClick={() => setSelectedDate(d.date)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                selectedDate === d.date
                  ? 'bg-amber-500 text-neutral-950 shadow-md'
                  : 'bg-neutral-800/80 text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              {d.label} ({d.date.slice(5)})
            </button>
          ))}
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {loading ? (
            <div className="text-center py-12 text-neutral-500 text-sm">
              Loading available showtimes...
            </div>
          ) : showsByTheatre.length === 0 ? (
            <div className="text-center py-12 text-neutral-400 text-sm space-y-2">
              <p>No scheduled shows found for this date at our partner theatres.</p>
              <p className="text-xs text-neutral-500">Please choose another date or check back later.</p>
            </div>
          ) : (
            showsByTheatre.map(({ theatre, shows }) => (
              <div key={theatre.id} className="p-5 rounded-2xl bg-neutral-950/50 border border-neutral-800/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div>
                    <h3 className="font-bold text-white text-base font-display flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-amber-500 shrink-0" />
                      {theatre.name}
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5 ml-6">{theatre.address}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {shows.map((show) => (
                    <button
                      key={show.id}
                      onClick={() => onSelectShow(show, movie, theatre)}
                      className="p-3 rounded-xl bg-neutral-900 hover:bg-amber-500/10 border border-neutral-800 hover:border-amber-500/50 text-left transition-all group flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-white group-hover:text-amber-400 transition-colors flex items-center gap-1.5 font-mono">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          {show.startTime}
                        </span>
                        <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                          {show.format}
                        </span>
                      </div>

                      <div className="mt-3 pt-2 border-t border-neutral-800/60 flex items-center justify-between text-xs text-neutral-400">
                        <span>Screen {show.screenNumber}</span>
                        <span className="font-mono text-neutral-200">from ₹{show.pricing.standard}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
