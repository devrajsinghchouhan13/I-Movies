import React, { useState, useEffect } from 'react';
import { X, ShieldCheck, Plus, Trash2, Calendar } from 'lucide-react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';

export const AdminPanelModal = ({
  onClose,
  onRefreshMovies,
  theatres,
  movies
}) => {
  const { success, error: toastError } = useToast();
  const [activeTab, setActiveTab] = useState('metrics');
  const [stats, setStats] = useState(null);
  const [allBookings, setAllBookings] = useState([]);

  // Form states for new movie
  const [newMovieTitle, setNewMovieTitle] = useState('');
  const [newMovieTagline, setNewMovieTagline] = useState('');
  const [newMovieDesc, setNewMovieDesc] = useState('');
  const [newMovieGenre, setNewMovieGenre] = useState('Action, Drama');
  const [newMovieDuration, setNewMovieDuration] = useState('150');
  const [newMovieRating, setNewMovieRating] = useState('8.8');
  const [newMovieDirector, setNewMovieDirector] = useState('');
  const [newMovieCast, setNewMovieCast] = useState('');

  // Form states for new show
  const [showMovieId, setShowMovieId] = useState(movies[0]?.id || '');
  const [showTheatreId, setShowTheatreId] = useState(theatres[0]?.id || '');
  const [showDate, setShowDate] = useState(new Date().toISOString().split('T')[0]);
  const [showTime, setShowTime] = useState('18:00');
  const [showFormat, setShowFormat] = useState('IMAX 3D');
  const [standardPrice, setStandardPrice] = useState('240');
  const [premiumPrice, setPremiumPrice] = useState('340');
  const [vipPrice, setVipPrice] = useState('500');

  const loadAdminData = async () => {
    try {
      const res = await api.getAdminStats();
      setStats(res.stats);
      setAllBookings(res.recentBookings);
    } catch (err) {
      toastError('Failed to load admin analytics');
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleCreateMovie = async (e) => {
    e.preventDefault();
    if (!newMovieTitle || !newMovieDesc) {
      toastError('Title and description are required.');
      return;
    }

    try {
      await api.createMovie({
        title: newMovieTitle,
        tagline: newMovieTagline,
        description: newMovieDesc,
        genre: newMovieGenre.split(',').map((g) => g.trim()),
        durationMinutes: Number(newMovieDuration) || 120,
        rating: Number(newMovieRating) || 8.0,
        director: newMovieDirector || 'Lead Director',
        cast: newMovieCast.split(',').map((c) => c.trim()),
        status: 'now_showing',
        posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
        backdropUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1600&q=80',
        language: 'Hindi',
        industry: 'Bollywood',
        certification: 'U/A 16+'
      });

      success(`Movie "${newMovieTitle}" added to the repertoire!`);
      setNewMovieTitle('');
      setNewMovieTagline('');
      setNewMovieDesc('');
      onRefreshMovies();
      setActiveTab('metrics');
    } catch (err) {
      toastError(err.message || 'Failed to add movie.');
    }
  };

  const handleCreateShow = async (e) => {
    e.preventDefault();
    if (!showMovieId || !showTheatreId) {
      toastError('Please pick both a movie and a theatre.');
      return;
    }

    try {
      await api.createShow({
        movieId: showMovieId,
        theatreId: showTheatreId,
        screenNumber: 1,
        date: showDate,
        startTime: showTime,
        format: showFormat,
        pricing: {
          standard: Number(standardPrice) || 15,
          premium: Number(premiumPrice) || 20,
          vip: Number(vipPrice) || 30
        }
      });

      success('New showtime scheduled successfully!');
      setActiveTab('metrics');
      await loadAdminData();
    } catch (err) {
      toastError(err.message || 'Failed to schedule showtime.');
    }
  };

  const handleDeleteMovie = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}" and all its showtimes?`)) return;
    try {
      await api.deleteMovie(id);
      success(`Movie "${title}" removed.`);
      onRefreshMovies();
      await loadAdminData();
    } catch (err) {
      toastError(err.message || 'Failed to delete movie.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-hidden flex flex-col shadow-2xl">
        
        <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-amber-500" />
            <h2 className="text-lg font-bold font-display text-white">
              Cinema Admin Control Center
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="px-6 py-3 border-b border-neutral-800/80 bg-neutral-900/60 flex items-center gap-2">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === 'metrics'
                ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            Analytics & Bookings
          </button>

          <button
            onClick={() => setActiveTab('add_movie')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'add_movie'
                ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            Add Movie
          </button>

          <button
            onClick={() => setActiveTab('add_show')}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'add_show'
                ? 'bg-amber-500 text-neutral-950 shadow-md font-bold'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Schedule Showtime
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'metrics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 text-xs block">Total Revenue</span>
                  <span className="text-2xl font-bold font-mono text-amber-400 mt-1 block">
                    ₹{stats?.totalRevenue?.toFixed(2) || '0.00'}
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">Net ticket transactions</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 text-xs block">Tickets Sold</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1 block">
                    {stats?.totalTicketsSold || 0}
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">Across all auditoriums</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 text-xs block">Occupancy Rate</span>
                  <span className="text-2xl font-bold font-mono text-emerald-400 mt-1 block">
                    {stats?.occupancyRate || '0%'}
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">Total capacity utilization</span>
                </div>

                <div className="p-4 rounded-2xl bg-neutral-950/60 border border-neutral-800">
                  <span className="text-neutral-400 text-xs block">Active Theatres</span>
                  <span className="text-2xl font-bold font-mono text-white mt-1 block">
                    {stats?.activeTheatres || 0}
                  </span>
                  <span className="text-[11px] text-neutral-500 mt-0.5 block">{stats?.scheduledShows || 0} active shows</span>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Movie Repertoire ({movies.length})
                </h3>
                <div className="space-y-2">
                  {movies.map((m) => (
                    <div
                      key={m.id}
                      className="p-3 rounded-xl bg-neutral-950/40 border border-neutral-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={m.posterUrl}
                          alt={m.title}
                          className="w-10 h-14 object-cover rounded-lg border border-neutral-800 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <h4 className="text-sm font-bold text-white">{m.title}</h4>
                          <div className="text-xs text-neutral-400 flex items-center gap-2 mt-0.5">
                            <span>{m.genre?.join(', ')}</span>
                            <span>·</span>
                            <span>{m.durationMinutes} min</span>
                            <span>·</span>
                            <span className="text-amber-400">★ {m.rating}</span>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => handleDeleteMovie(m.id, m.title)}
                        className="p-2 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                        title="Delete Movie"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Recent Guest Bookings
                </h3>
                <div className="overflow-x-auto border border-neutral-800 rounded-2xl">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                      <tr>
                        <th className="p-3 font-semibold">Ref #</th>
                        <th className="p-3 font-semibold">Guest</th>
                        <th className="p-3 font-semibold">Movie</th>
                        <th className="p-3 font-semibold">Seats</th>
                        <th className="p-3 font-semibold">Total</th>
                        <th className="p-3 font-semibold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-800/80 bg-neutral-900/40">
                      {allBookings.map((b) => (
                        <tr key={b.id} className="hover:bg-neutral-800/30">
                          <td className="p-3 font-mono font-bold text-amber-400">{b.bookingReference}</td>
                          <td className="p-3 text-neutral-200">{b.userName}</td>
                          <td className="p-3 text-white font-medium">{b.movieTitle}</td>
                          <td className="p-3 font-mono text-neutral-300">{b.seats?.map((s) => s.seatNumber).join(', ')}</td>
                          <td className="p-3 font-mono text-white font-semibold">₹{b.totalAmount?.toFixed(2)}</td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                                b.status === 'confirmed'
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                              }`}
                            >
                              {b.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'add_movie' && (
            <form onSubmit={handleCreateMovie} className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-base font-bold text-white font-display">Add Movie to Repertoire</h3>

              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Movie Title *</label>
                <input
                  type="text"
                  required
                  value={newMovieTitle}
                  onChange={(e) => setNewMovieTitle(e.target.value)}
                  placeholder="e.g. Interstellar: Quantum Drift"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Tagline</label>
                <input
                  type="text"
                  value={newMovieTagline}
                  onChange={(e) => setNewMovieTagline(e.target.value)}
                  placeholder="e.g. Beyond the edge of known spacetime"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Synopsis / Description *</label>
                <textarea
                  required
                  rows={3}
                  value={newMovieDesc}
                  onChange={(e) => setNewMovieDesc(e.target.value)}
                  placeholder="Detailed synopsis of the film..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">Genres (comma sep)</label>
                  <input
                    type="text"
                    value={newMovieGenre}
                    onChange={(e) => setNewMovieGenre(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={newMovieDuration}
                    onChange={(e) => setNewMovieDuration(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">Rating (out of 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newMovieRating}
                    onChange={(e) => setNewMovieRating(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">Director</label>
                  <input
                    type="text"
                    value={newMovieDirector}
                    onChange={(e) => setNewMovieDirector(e.target.value)}
                    placeholder="Director name"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">Lead Cast (comma sep)</label>
                  <input
                    type="text"
                    value={newMovieCast}
                    onChange={(e) => setNewMovieCast(e.target.value)}
                    placeholder="Actor 1, Actor 2"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-sans transition-all shadow-md shadow-amber-500/20"
                >
                  Create & Publish Movie
                </button>
              </div>
            </form>
          )}

          {activeTab === 'add_show' && (
            <form onSubmit={handleCreateShow} className="space-y-4 max-w-xl mx-auto">
              <h3 className="text-base font-bold text-white font-display">Schedule New Showtime</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">Select Movie *</label>
                  <select
                    value={showMovieId}
                    onChange={(e) => setShowMovieId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    {movies.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">Select Theatre *</label>
                  <select
                    value={showTheatreId}
                    onChange={(e) => setShowTheatreId(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    {theatres.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.city})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">Date</label>
                  <input
                    type="date"
                    value={showDate}
                    onChange={(e) => setShowDate(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">Start Time (HH:mm)</label>
                  <input
                    type="text"
                    value={showTime}
                    onChange={(e) => setShowTime(e.target.value)}
                    placeholder="19:30"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="text-xs text-neutral-400 font-medium block mb-1">Auditorium Format</label>
                  <select
                    value={showFormat}
                    onChange={(e) => setShowFormat(e.target.value)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  >
                    <option value="IMAX 3D">IMAX 3D</option>
                    <option value="Dolby Cinema">Dolby Cinema</option>
                    <option value="4DX">4DX Dynamic</option>
                    <option value="2D">Standard 2D</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs text-neutral-400 font-medium block mb-1">Tier Pricing (₹ INR)</label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Standard</span>
                    <input
                      type="number"
                      value={standardPrice}
                      onChange={(e) => setStandardPrice(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">Premium</span>
                    <input
                      type="number"
                      value={premiumPrice}
                      onChange={(e) => setPremiumPrice(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-neutral-500 block">VIP Recliner</span>
                    <input
                      type="number"
                      value={vipPrice}
                      onChange={(e) => setVipPrice(e.target.value)}
                      className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs font-sans transition-all shadow-md shadow-amber-500/20"
                >
                  Schedule Showtime & Generate Seats
                </button>
              </div>
            </form>
          )}
        </div>

      </div>
    </div>
  );
};
