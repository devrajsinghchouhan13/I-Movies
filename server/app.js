import express from 'express';
import authRoutes from './routes/authRoutes.js';
import movieRoutes from './routes/movieRoutes.js';
import theatreRoutes from './routes/theatreRoutes.js';
import showRoutes from './routes/showRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';

export function createServerApp() {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(apiRateLimiter(300, 60000));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'online',
      service: 'The IMovies Cinema Platform API (JavaScript Engine)',
      timestamp: new Date().toISOString()
    });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/movies', movieRoutes);
  app.use('/api/theatres', theatreRoutes);
  app.use('/api/shows', showRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/admin', adminRoutes);

  app.use((err, req, res, next) => {
    console.error('API Error:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  });

  return app;
}
