import React from 'react';
import { Play, Ticket, Sparkles, Volume2, ShieldCheck, Clock } from 'lucide-react';

export const HeroBanner = ({
  movie,
  onBookNow,
  onWatchTrailer
}) => {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800 bg-neutral-950">
      <div className="relative w-full h-[480px] sm:h-[540px] lg:h-[600px] overflow-hidden">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center scale-105 transition-transform duration-1000 ease-out"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/client/src/assets/images/hero_cinema_interstellar_1793178113951.jpg';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/70 to-neutral-950/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-neutral-950 via-neutral-950/80 to-transparent" />

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-12 sm:pb-16 z-10">
          <div className="max-w-2xl space-y-4">
            
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 flex-wrap">
              <span className="uppercase tracking-wider font-bold bg-amber-500/20 px-2 py-0.5 rounded border border-amber-500/30">Bollywood Grand Premiere · Hindi</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-300">★ {movie.rating?.toFixed(1)} Rating</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-300">{movie.certification}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span className="text-neutral-300">{movie.durationMinutes} min</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold font-display text-white tracking-tight leading-[1.1] text-balance">
              {movie.title}
            </h1>

            <p className="text-sm sm:text-base text-neutral-300 line-clamp-2 leading-relaxed">
              {movie.description}
            </p>

            <div className="text-xs text-neutral-400 flex items-center gap-2 pt-1 flex-wrap">
              <span>Directed by <strong className="text-neutral-200">{movie.director}</strong></span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>Starring <strong className="text-neutral-200">{movie.cast?.slice(0, 3).join(', ')}</strong></span>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                onClick={() => onBookNow(movie)}
                className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-sm transition-all shadow-lg shadow-amber-500/20 flex items-center gap-2 whitespace-nowrap active:scale-[0.98]"
              >
                <Ticket className="w-4 h-4" />
                Select Showtimes & Seats
              </button>

              <button
                onClick={() => onWatchTrailer(movie.trailerUrl, movie.title)}
                className="px-5 py-3 rounded-xl bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-700/80 text-white font-medium text-sm transition-all flex items-center gap-2 whitespace-nowrap backdrop-blur-sm"
              >
                <Play className="w-4 h-4 fill-white" />
                Hindi Trailer Preview
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 border-t border-neutral-800/80">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-neutral-200">IMAX Laser & Dolby Atmos</div>
              <div className="text-neutral-500">Dual 4K projection & Hindi audio</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Volume2 className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-neutral-200">Indore Multiplex Circuit</div>
              <div className="text-neutral-500">Phoenix Citadel, TI Mall, C21</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-neutral-200">Real-Time Seat Locks</div>
              <div className="text-neutral-500">5-minute checkout hold</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
            <div>
              <div className="font-semibold text-neutral-200">Instant Digital Passes</div>
              <div className="text-neutral-500">UPI, QR pass & 1-click refund</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
