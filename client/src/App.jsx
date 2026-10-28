import React, { useState, useEffect, useMemo } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider, useToast } from './context/ToastContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { HeroBanner } from './components/HeroBanner.jsx';
import { FilterBar } from './components/FilterBar.jsx';
import { MovieCard } from './components/MovieCard.jsx';
import { ShowtimePickerModal } from './components/ShowtimePickerModal.jsx';
import { SeatMatrixModal } from './components/SeatMatrixModal.jsx';
import { CheckoutModal } from './components/CheckoutModal.jsx';
import { TicketPassModal } from './components/TicketPassModal.jsx';
import { BookingHistoryModal } from './components/BookingHistoryModal.jsx';
import { AdminPanelModal } from './components/AdminPanelModal.jsx';
import { AuthModal } from './components/AuthModal.jsx';
import { TrailerModal } from './components/TrailerModal.jsx';
import { TheatresView } from './components/TheatresView.jsx';
import { api } from './services/api.js';
import { Film, Sparkles } from 'lucide-react';

export function CinemaAppContent() {
  const { user } = useAuth();
  const { error: toastError, info } = useToast();

  const [movies, setMovies] = useState([]);
  const [theatres, setTheatres] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedTheatre, setSelectedTheatre] = useState('All');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [activeCategory, setActiveCategory] = useState('all');

  // Modals & Flow State
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [myBookingsOpen, setMyBookingsOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);
  const [trailerData, setTrailerData] = useState(null);

  // Booking Flow Steps
  const [selectedMovieForBooking, setSelectedMovieForBooking] = useState(null);
  const [activeShow, setActiveShow] = useState(null);
  const [activeShowMovie, setActiveShowMovie] = useState(null);
  const [activeShowTheatre, setActiveShowTheatre] = useState(null);
  
  const [checkoutData, setCheckoutData] = useState(null);
  const [activeTicketPass, setActiveTicketPass] = useState(null);

  const loadData = async () => {
    try {
      const [moviesRes, theatresRes] = await Promise.all([
        api.getMovies(),
        api.getTheatres()
      ]);
      setMovies(moviesRes.movies);
      setTheatres(theatresRes.theatres);
    } catch (err) {
      toastError('Failed to initialize cinema schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const filteredMovies = useMemo(() => {
    let result = [...movies];

    if (activeCategory === 'blockbusters') {
      result = result.filter((m) =>
        m.genre?.some((g) => ['action', 'thriller', 'crime'].includes(g.toLowerCase()))
      );
    } else if (activeCategory === 'epics') {
      result = result.filter((m) =>
        m.genre?.some((g) => ['historical epic', 'drama', 'biographical', 'epic'].includes(g.toLowerCase()))
      );
    }

    if (selectedGenre !== 'All') {
      result = result.filter((m) => m.genre?.some((g) => g.toLowerCase() === selectedGenre.toLowerCase()));
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title?.toLowerCase().includes(q) ||
          m.director?.toLowerCase().includes(q) ||
          m.cast?.some((c) => c.toLowerCase().includes(q))
      );
    }

    return result;
  }, [movies, activeCategory, selectedGenre, searchQuery]);

  const featuredMovie = useMemo(() => {
    return movies.find((m) => m.id === 'mov_chhaava') || movies.find((m) => m.status === 'featured') || movies[0];
  }, [movies]);

  const handleStartBooking = (movie) => {
    setSelectedMovieForBooking(movie);
  };

  const handleSelectShow = (show, movie, theatre) => {
    setSelectedMovieForBooking(null);
    setActiveShow(show);
    setActiveShowMovie(movie);
    setActiveShowTheatre(theatre);
  };

  const handleProceedToCheckout = (selectedSeats, subtotal) => {
    if (!user) {
      info('Please sign in or use a demo account to reserve your tickets.', 'Authentication');
      setAuthModalOpen(true);
      return;
    }

    if (activeShow && activeShowMovie && activeShowTheatre) {
      setCheckoutData({
        movie: activeShowMovie,
        show: activeShow,
        theatre: activeShowTheatre,
        selectedSeats,
        subtotal
      });
      setActiveShow(null);
    }
  };

  const handleBookingSuccess = (booking) => {
    setCheckoutData(null);
    setActiveTicketPass(booking);
  };

  const handleSelectCategory = (cat) => {
    if (cat === 'all' || cat === 'sci-fi' || cat === 'theatres') {
      setActiveCategory(cat);
      if (cat !== 'theatres') {
        setSelectedTheatre('All');
      }
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col">
      <Navbar
        onOpenAuth={() => setAuthModalOpen(true)}
        onOpenMyBookings={() => setMyBookingsOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
        onSelectCategory={handleSelectCategory}
        activeCategory={activeCategory}
      />

      <main className="flex-1 pb-20">
        {activeCategory === 'theatres' ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <TheatresView
              theatres={theatres}
              onSelectTheatre={(theatreId) => {
                setSelectedTheatre(theatreId);
                setActiveCategory('all');
              }}
            />
          </div>
        ) : (
          <>
            {featuredMovie && (
              <HeroBanner
                movie={featuredMovie}
                onBookNow={handleStartBooking}
                onWatchTrailer={(url, title) => setTrailerData({ url, title })}
              />
            )}

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-amber-500 uppercase tracking-wider mb-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Now In Theatres & Premium Auditoriums</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
                    {activeCategory === 'sci-fi' ? 'IMAX & Sci-Fi Masterpieces' : 'Explore Featured Releases'}
                  </h2>
                </div>

                <div className="text-xs text-neutral-400 font-mono">
                  Showing <strong className="text-white">{filteredMovies.length}</strong> {filteredMovies.length === 1 ? 'title' : 'titles'}
                </div>
              </div>

              <FilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedGenre={selectedGenre}
                onGenreChange={setSelectedGenre}
                selectedTheatre={selectedTheatre}
                onTheatreChange={setSelectedTheatre}
                selectedDate={selectedDate}
                onDateChange={setSelectedDate}
                theatres={theatres}
                onReset={() => {
                  setSearchQuery('');
                  setSelectedGenre('All');
                  setSelectedTheatre('All');
                }}
              />

              {loading ? (
                <div className="py-24 text-center text-sm text-neutral-500">
                  Loading premier movies...
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="py-20 text-center rounded-2xl bg-neutral-900/30 border border-neutral-800/60 p-8 space-y-3">
                  <Film className="w-10 h-10 text-neutral-600 mx-auto" />
                  <h3 className="text-base font-semibold text-white">No movies match your criteria</h3>
                  <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                    Try searching for another genre, title, or clear your current filters.
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedGenre('All');
                      setSelectedTheatre('All');
                    }}
                    className="mt-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-xs font-semibold text-neutral-200"
                  >
                    Reset Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {filteredMovies.map((movie) => (
                    <MovieCard
                      key={movie.id}
                      movie={movie}
                      onBookNow={handleStartBooking}
                      onWatchTrailer={(url, title) => setTrailerData({ url, title })}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="border-t border-neutral-800/80 bg-neutral-950 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-neutral-500">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Film className="w-3.5 h-3.5" />
            </div>
            <span className="font-bold text-white font-display text-sm tracking-tight">The IMovies</span>
            <span>·</span>
            <span>Full-Stack MERN Cinema Architecture (JavaScript Engine)</span>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <span>Express REST API</span>
            <span>·</span>
            <span>MongoDB Document Store</span>
            <span>·</span>
            <span>Real-Time Seat Locks</span>
            <span>·</span>
            <span>JWT Security</span>
          </div>

          <div className="text-neutral-600">
            © {new Date().getFullYear()} The IMovies Platform. All rights reserved.
          </div>
        </div>
      </footer>

      {selectedMovieForBooking && (
        <ShowtimePickerModal
          movie={selectedMovieForBooking}
          onClose={() => setSelectedMovieForBooking(null)}
          onSelectShow={handleSelectShow}
        />
      )}

      {activeShow && activeShowMovie && activeShowTheatre && (
        <SeatMatrixModal
          show={activeShow}
          movie={activeShowMovie}
          theatre={activeShowTheatre}
          onClose={() => setActiveShow(null)}
          onProceedToCheckout={handleProceedToCheckout}
        />
      )}

      {checkoutData && (
        <CheckoutModal
          movie={checkoutData.movie}
          show={checkoutData.show}
          theatre={checkoutData.theatre}
          selectedSeats={checkoutData.selectedSeats}
          subtotal={checkoutData.subtotal}
          onClose={() => setCheckoutData(null)}
          onBookingSuccess={handleBookingSuccess}
        />
      )}

      {activeTicketPass && (
        <TicketPassModal
          booking={activeTicketPass}
          onClose={() => setActiveTicketPass(null)}
        />
      )}

      {myBookingsOpen && (
        <BookingHistoryModal
          onClose={() => setMyBookingsOpen(false)}
          onViewTicket={(b) => {
            setMyBookingsOpen(false);
            setActiveTicketPass(b);
          }}
        />
      )}

      {adminOpen && (
        <AdminPanelModal
          onClose={() => setAdminOpen(false)}
          onRefreshMovies={loadData}
          theatres={theatres}
          movies={movies}
        />
      )}

      {authModalOpen && (
        <AuthModal onClose={() => setAuthModalOpen(false)} />
      )}

      {trailerData && (
        <TrailerModal
          trailerUrl={trailerData.url}
          movieTitle={trailerData.title}
          onClose={() => setTrailerData(null)}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <CinemaAppContent />
      </ToastProvider>
    </AuthProvider>
  );
}
