import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Film, User, LogOut, Ticket, ShieldCheck, ChevronDown } from 'lucide-react';

export const Navbar = ({
  onOpenAuth,
  onOpenMyBookings,
  onOpenAdmin,
  onSelectCategory,
  activeCategory
}) => {
  const { user, logout, isAdmin, loginAsDemoUser, loginAsAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single Wordmark */}
        <button
          onClick={() => onSelectCategory('all')}
          className="flex items-center gap-2.5 text-left group shrink-0"
        >
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 group-hover:bg-amber-500 group-hover:text-neutral-950 transition-colors">
            <Film className="w-4 h-4" />
          </div>
          <span className="text-xl font-bold font-display tracking-tight text-white whitespace-nowrap">
            The IMovies
          </span>
        </button>

        {/* Zone 2: Clean Bollywood Nav Links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
          <button
            onClick={() => onSelectCategory('all')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeCategory === 'all'
                ? 'text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            All Hindi Movies
            {activeCategory === 'all' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectCategory('blockbusters')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeCategory === 'blockbusters'
                ? 'text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Bollywood Blockbusters
            {activeCategory === 'blockbusters' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectCategory('epics')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeCategory === 'epics'
                ? 'text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Epics & Dramas
            {activeCategory === 'epics' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          <button
            onClick={() => onSelectCategory('theatres')}
            className={`whitespace-nowrap transition-colors py-1 relative ${
              activeCategory === 'theatres'
                ? 'text-amber-400 font-semibold'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Indore Multiplexes
            {activeCategory === 'theatres' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-amber-500 rounded-full" />
            )}
          </button>

          {user && (
            <button
              onClick={onOpenMyBookings}
              className="text-neutral-400 hover:text-white whitespace-nowrap transition-colors py-1 flex items-center gap-1.5"
            >
              <Ticket className="w-4 h-4 text-amber-500" />
              My Tickets
            </button>
          )}

          {isAdmin && (
            <button
              onClick={onOpenAdmin}
              className="text-amber-400 hover:text-amber-300 whitespace-nowrap transition-colors py-1 flex items-center gap-1.5 font-medium"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Portal
            </button>
          )}
        </nav>

        {/* Zone 3: 1 Primary Action / User Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all text-sm font-medium text-neutral-200"
              >
                <img
                  src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                  alt={user.name}
                  className="w-6 h-6 rounded-full object-cover bg-neutral-800"
                  referrerPolicy="no-referrer"
                />
                <span className="max-w-[120px] truncate">{user.name.split(' ')[0]}</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl bg-neutral-900 border border-neutral-800 shadow-2xl py-2 z-50 text-sm animate-in fade-in zoom-in-95">
                  <div className="px-4 py-2 border-b border-neutral-800">
                    <p className="font-semibold text-white truncate">{user.name}</p>
                    <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                    <div className="mt-1 flex items-center gap-1 text-[11px] text-amber-400 uppercase tracking-wider font-semibold">
                      Role: {user.role}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      onOpenMyBookings();
                    }}
                    className="w-full px-4 py-2 text-left text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center gap-2 transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-amber-400" />
                    My Reservations
                  </button>

                  {isAdmin && (
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        onOpenAdmin();
                      }}
                      className="w-full px-4 py-2 text-left text-neutral-300 hover:text-white hover:bg-neutral-800 flex items-center gap-2 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Admin Dashboard
                    </button>
                  )}

                  <div className="my-1 border-t border-neutral-800" />

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      logout();
                    }}
                    className="w-full px-4 py-2 text-left text-rose-400 hover:text-rose-300 hover:bg-neutral-800 flex items-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-neutral-400 mr-2">
                <button
                  onClick={loginAsDemoUser}
                  className="px-2 py-1 text-xs text-neutral-400 hover:text-amber-400 hover:bg-neutral-900 rounded transition-colors whitespace-nowrap"
                  title="Quick login as User"
                >
                  Demo User
                </button>
                <span>·</span>
                <button
                  onClick={loginAsAdmin}
                  className="px-2 py-1 text-xs text-amber-500/80 hover:text-amber-400 hover:bg-neutral-900 rounded transition-colors whitespace-nowrap"
                  title="Quick login as Admin"
                >
                  Admin
                </button>
              </div>

              <button
                onClick={onOpenAuth}
                className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-500 hover:bg-amber-400 rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <User className="w-3.5 h-3.5" />
                Sign In
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
