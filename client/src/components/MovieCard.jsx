import React from 'react';
import { Play, Ticket, Star } from 'lucide-react';

export const MovieCard = ({
  movie,
  onBookNow,
  onWatchTrailer
}) => {
  return (
    <div className="group rounded-2xl bg-neutral-900/60 border border-neutral-800/80 overflow-hidden flex flex-col hover:border-neutral-700 hover:shadow-xl hover:shadow-amber-500/5 transition-all duration-300">
      
      <div className="relative aspect-[3/4] overflow-hidden bg-neutral-950">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = '/client/src/assets/images/hero_cinema_interstellar_1793178113951.jpg';
          }}
        />

        <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md bg-amber-500/90 text-neutral-950 text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
          {movie.industry || 'Bollywood'}
        </div>

        <div className="absolute top-3 right-3 px-2.5 py-1 rounded-lg bg-neutral-950/80 backdrop-blur-md border border-neutral-700/80 flex items-center gap-1.5 text-xs font-semibold text-amber-400">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{movie.rating?.toFixed(1)}</span>
        </div>

        <div className="absolute inset-0 bg-neutral-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button
            onClick={() => onWatchTrailer(movie.trailerUrl, movie.title)}
            className="w-12 h-12 rounded-full bg-white/20 hover:bg-white text-white hover:text-neutral-950 flex items-center justify-center transition-all shadow-lg backdrop-blur-md"
            title="Watch Hindi Trailer"
          >
            <Play className="w-5 h-5 fill-current ml-0.5" />
          </button>
        </div>
      </div>

      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1.5 font-medium flex-wrap">
            <span className="text-amber-400/90 font-semibold">{movie.genre?.[0]}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>{movie.durationMinutes} min</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="px-1.5 py-0.5 rounded bg-neutral-800 text-[10px] font-semibold text-neutral-300">{movie.certification}</span>
          </div>

          <h3 className="font-display font-bold text-lg text-white group-hover:text-amber-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <p className="text-xs text-neutral-400 line-clamp-2 mt-1 leading-relaxed">
            {movie.description}
          </p>
        </div>

        <div className="pt-2 border-t border-neutral-800/80 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 truncate">
            <span className="font-medium text-neutral-300">{movie.language || 'Hindi'}</span>
          </div>

          <button
            onClick={() => onBookNow(movie)}
            className="px-3.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-amber-500 text-neutral-200 hover:text-neutral-950 text-xs font-semibold transition-all flex items-center gap-1.5 shrink-0"
          >
            <Ticket className="w-3.5 h-3.5" />
            Book Seats
          </button>
        </div>
      </div>
    </div>
  );
};
