const BASE_URL = '/api';

function getAuthHeader() {
  const token = localStorage.getItem('imovies_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse(response) {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Request failed with status ${response.status}`);
  }
  return response.json();
}

export const api = {
  // === Auth ===
  async login(credentials) {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });
    return handleResponse(res);
  },

  async register(data) {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getProfile() {
    const res = await fetch(`${BASE_URL}/auth/profile`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  // === Movies ===
  async getMovies(filters) {
    const params = new URLSearchParams();
    if (filters?.genre) params.append('genre', filters.genre);
    if (filters?.language) params.append('language', filters.language);
    if (filters?.search) params.append('search', filters.search);
    if (filters?.status) params.append('status', filters.status);

    const res = await fetch(`${BASE_URL}/movies?${params.toString()}`);
    return handleResponse(res);
  },

  async getMovieById(id) {
    const res = await fetch(`${BASE_URL}/movies/${id}`);
    return handleResponse(res);
  },

  async getFeaturedMovies() {
    const res = await fetch(`${BASE_URL}/movies/featured`);
    return handleResponse(res);
  },

  // === Theatres ===
  async getTheatres() {
    const res = await fetch(`${BASE_URL}/theatres`);
    return handleResponse(res);
  },

  async getTheatreById(id) {
    const res = await fetch(`${BASE_URL}/theatres/${id}`);
    return handleResponse(res);
  },

  // === Shows & Seats ===
  async getShows(filters) {
    const params = new URLSearchParams();
    if (filters?.movieId) params.append('movieId', filters.movieId);
    if (filters?.theatreId) params.append('theatreId', filters.theatreId);
    if (filters?.date) params.append('date', filters.date);

    const res = await fetch(`${BASE_URL}/shows?${params.toString()}`);
    return handleResponse(res);
  },

  async getShowDetails(id) {
    const res = await fetch(`${BASE_URL}/shows/${id}`);
    return handleResponse(res);
  },

  async lockSeats(showId, seatNumbers) {
    const res = await fetch(`${BASE_URL}/shows/lock-seats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ showId, seatNumbers })
    });
    return handleResponse(res);
  },

  async unlockSeats(showId, seatNumbers) {
    const res = await fetch(`${BASE_URL}/shows/unlock-seats`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ showId, seatNumbers })
    });
    return handleResponse(res);
  },

  // === Bookings ===
  async createBooking(data) {
    const res = await fetch(`${BASE_URL}/bookings`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },

  async getMyBookings() {
    const res = await fetch(`${BASE_URL}/bookings/my`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getBookingById(id) {
    const res = await fetch(`${BASE_URL}/bookings/${id}`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async cancelBooking(id, reason) {
    const res = await fetch(`${BASE_URL}/bookings/${id}/cancel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ reason })
    });
    return handleResponse(res);
  },

  // === Admin ===
  async getAdminStats() {
    const res = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async getAllBookings() {
    const res = await fetch(`${BASE_URL}/admin/bookings`, {
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async createMovie(movieData) {
    const res = await fetch(`${BASE_URL}/admin/movies`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(movieData)
    });
    return handleResponse(res);
  },

  async deleteMovie(id) {
    const res = await fetch(`${BASE_URL}/admin/movies/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  },

  async createShow(showData) {
    const res = await fetch(`${BASE_URL}/admin/shows`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(showData)
    });
    return handleResponse(res);
  },

  async deleteShow(id) {
    const res = await fetch(`${BASE_URL}/admin/shows/${id}`, {
      method: 'DELETE',
      headers: { ...getAuthHeader() }
    });
    return handleResponse(res);
  }
};
