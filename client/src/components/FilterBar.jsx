import React from 'react';
import { Search, X, MapPin } from 'lucide-react';

const GENRES = ['All', 'Action', 'Comedy', 'Drama', 'Horror Comedy', 'Historical Epic', 'Thriller', 'Biographical', 'Romantic'];

export const FilterBar = ({
  searchQuery,
  onSearchChange,
  selectedGenre,
  onGenreChange,
  selectedTheatre,
  onTheatreChange,
  selectedDate,
  onDateChange,
  theatres,
  onReset
}) => {
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0];

  const hasFilters = searchQuery || selectedGenre !== 'All' || selectedTheatre !== 'All';

  return (
    <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-4 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        
        <div className="relative">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Hindi movie, star (Shah Rukh, Vicky, Shraddha)..."
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-500 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 bg-neutral-900 border border-neutral-800 p-1 rounded-xl">
          <button
            onClick={() => onDateChange(today)}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-center ${
              selectedDate === today
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Today
          </button>
          <button
            onClick={() => onDateChange(tomorrow)}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-center ${
              selectedDate === tomorrow
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Tomorrow
          </button>
          <button
            onClick={() => onDateChange(dayAfter)}
            className={`flex-1 py-1.5 px-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap text-center ${
              selectedDate === dayAfter
                ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Day After
          </button>
        </div>

        <div className="relative">
          <MapPin className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedTheatre}
            onChange={(e) => onTheatreChange(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-xl pl-10 pr-8 py-2 text-xs text-white focus:outline-none focus:border-amber-500 transition-colors appearance-none cursor-pointer"
          >
            <option value="All">All Cinemas & Cities</option>
            {theatres.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name} ({t.city})
              </option>
            ))}
          </select>
        </div>

        {hasFilters && (
          <div className="flex items-center">
            <button
              onClick={onReset}
              className="w-full py-2 px-3 rounded-xl border border-neutral-800 hover:border-neutral-700 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          </div>
        )}
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
        <span className="text-neutral-500 font-medium mr-2 shrink-0">Genre:</span>
        {GENRES.map((g) => (
          <button
            key={g}
            onClick={() => onGenreChange(g)}
            className={`px-3 py-1 rounded-lg font-medium transition-all whitespace-nowrap shrink-0 ${
              selectedGenre === g
                ? 'bg-white text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800/80'
            }`}
          >
            {g}
          </button>
        ))}
      </div>
    </div>
  );
};
