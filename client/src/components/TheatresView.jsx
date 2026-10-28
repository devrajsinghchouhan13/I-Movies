import React from 'react';
import { MapPin, Film, ChevronRight } from 'lucide-react';

export const TheatresView = ({ theatres, onSelectTheatre }) => {
  return (
    <section className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
          <MapPin className="w-4 h-4" />
          <span>Our Premium Cinema Network</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
          State-of-the-Art Auditoriums
        </h2>
        <p className="text-xs sm:text-sm text-neutral-400 mt-1 max-w-xl">
          Equipped with dual 4K laser projection, 64-channel immersive Dolby Atmos surround sound, and motorized zero-gravity recliners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {theatres?.map((theatre) => (
          <div
            key={theatre.id}
            className="rounded-2xl bg-neutral-900/60 border border-neutral-800 p-6 flex flex-col justify-between space-y-5 hover:border-neutral-700 transition-all hover:shadow-xl hover:shadow-amber-500/5 group"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                <Film className="w-5 h-5" />
              </div>

              <div>
                <h3 className="text-lg font-bold font-display text-white group-hover:text-amber-400 transition-colors">
                  {theatre.name}
                </h3>
                <p className="text-xs text-neutral-400 mt-1">{theatre.address}</p>
                <div className="text-xs font-semibold text-amber-500/90 mt-1">
                  {theatre.location} · {theatre.city}
                </div>
              </div>

              <div className="pt-3 border-t border-neutral-800/80 space-y-2">
                <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider block">
                  Auditorium Screens:
                </span>
                {theatre.screens?.map((screen) => (
                  <div
                    key={screen.screenNumber}
                    className="p-2.5 rounded-xl bg-neutral-950/60 border border-neutral-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-semibold text-white">Screen {screen.screenNumber}</span>
                      <span className="text-neutral-500 ml-2">({screen.totalSeats} seats)</span>
                    </div>
                    <span className="font-mono text-amber-400 font-bold text-[11px]">
                      {screen.format}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => onSelectTheatre(theatre.id)}
              className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all"
            >
              View Scheduled Shows
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};
