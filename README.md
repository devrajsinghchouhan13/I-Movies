# The IMovies — Full-Stack Cinema Ticket Reservation & Management Platform

A modern, production-ready MERN (MongoDB, Express.js, React.js, Node.js) cinema ticketing platform built with **pure JavaScript** (`.js` and `.jsx`). It enables seamless movie discovery, auditorium showtime scheduling, real-time seat availability tracking with lock protection, and secure digital ticket issuance with instant cancellations.

---

## 🏛️ Two-Folder Clean Architecture

The project is structured with two primary directories (`client` and `server`), moving all source files directly inside their respective domains:

```text
├── client/                     # Frontend React.js SPA (JavaScript & JSX)
│   └── src/
│       ├── assets/images/      # High-definition cinema movie backdrops & posters
│       ├── components/         # React JSX components
│       │   ├── Navbar.jsx              # 3-zone Top Bar Contract with category navigation
│       │   ├── HeroBanner.jsx          # Cinematic movie hero with measured scrim & specs
│       │   ├── MovieCard.jsx           # Clean card with unboxed metadata
│       │   ├── FilterBar.jsx           # Dynamic genre, location, date & search filters
│       │   ├── ShowtimePickerModal.jsx # Date & auditorium format showtime scheduler
│       │   ├── SeatMatrixModal.jsx     # Curved cinema screen with real-time seat locks
│       │   ├── CheckoutModal.jsx       # Itemized fee breakdown & multi-payment gateway
│       │   ├── TicketPassModal.jsx     # Cinema boarding pass with scannable QR & print
│       │   ├── BookingHistoryModal.jsx # My tickets with 1-click refund cancellation
│       │   ├── AdminPanelModal.jsx     # Cinema KPIs, movie CRUD & show scheduler
│       │   ├── AuthModal.jsx           # Sign in/up with instant 1-click test personas
│       │   ├── TrailerModal.jsx        # Embedded YouTube/video player preview
│       │   └── TheatresView.jsx        # Multi-auditorium cinema network directory
│       ├── context/
│       │   ├── AuthContext.jsx         # JWT session management & fast demo login
│       │   └── ToastContext.jsx        # Toast notification system
│       ├── services/
│       │   └── api.js                  # Centralized REST API client with Bearer token
│       ├── App.jsx                     # Root application coordinator
│       ├── main.jsx                    # React 19 client mount
│       └── index.css                   # Tailwind CSS styling with cinema fonts
│
├── server/                     # Backend Express.js REST API (Pure JavaScript)
│   ├── controllers/
│   │   ├── authController.js           # Registration, login, profile retrieval
│   │   ├── movieController.js          # Movie search, genre filters, and details
│   │   ├── theatreController.js        # Theatres & screen formats
│   │   ├── showController.js           # Live seat layouts & 5-minute hold engine
│   │   ├── bookingController.js        # Booking transaction, QR generator & refunds
│   │   └── adminController.js          # Cinema KPIs, movie CRUD & show scheduler
│   ├── db/
│   │   ├── seed.js                     # Rich seed dataset with posters & pre-booked seats
│   │   └── store.js                    # In-memory + persistent MongoDB-style document store
│   ├── middleware/
│   │   ├── authMiddleware.js           # JWT verification & role validation (User / Admin)
│   │   └── rateLimiter.js              # Sliding-window API rate limiter
│   ├── routes/
│   │   ├── authRoutes.js               # /api/auth
│   │   ├── movieRoutes.js              # /api/movies
│   │   ├── theatreRoutes.js            # /api/theatres
│   │   ├── showRoutes.js               # /api/shows
│   │   ├── bookingRoutes.js            # /api/bookings
│   │   └── adminRoutes.js              # /api/admin
│   └── app.js                          # Express application configuration
│
├── server.js                   # Unified Express + Vite dev server entry point
├── index.html                  # HTML entry point pointing to /client/src/main.jsx
├── package.json
└── README.md                   # Full system documentation
```

---

## ✨ Core Features & Highlights

### 1. Real-Time Seat Availability & 5-Minute Hold Lock
- **Interactive Cinema Canvas**: Curved glowing cinema screen with rows A through H.
- **Auditorium Tier Pricing (Indore)**:
  - **Standard**: Rows A-B (₹220 - ₹280)
  - **Premium**: Rows C-F (₹300 - ₹380)
  - **VIP Motorized Recliner**: Rows G-H (₹450 - ₹600)
- **Indore Cinema Network**: Phoenix Citadel MR 10, Treasure Island MG Road, and C21 Mall Vijay Nagar.
- **Real-Time Seat Locks**:
  - Selecting seats locks them for **5 minutes** (`300s countdown timer`).
  - Protects against double bookings while customer is at checkout.
  - Expired locks automatically release seats back into the available pool.

### 2. Role-Based JWT Security & One-Click Personas
- Passwords hashed with `bcryptjs`.
- Stateless token authentication using `jsonwebtoken`.
- **Fast 1-Click Testing Personas**:
  - *Demo User*: `elena@cinema.com` / `User@123`
  - *Cinema Manager (Admin)*: `admin@imovies.com` / `Admin@123`

### 3. Movie Discovery & Interactive Filters
- Filter by genre (`Sci-Fi`, `Cyberpunk`, `Drama`, `Epic`, etc.), cinema theatre, and date (`Today`, `Tomorrow`, `Day After`).
- Real-time search across titles, directors, and cast.
- Built-in trailer previews.

### 4. Boarding Pass Tickets & Instant Cancellations
- Itemized checkout with ticket tier breakdown, convenience fee, and estimated tax.
- Supports Credit/Debit Cards, UPI, and Apple Pay / Google Wallet.
- Official cinema pass ticket with:
  - Vector SVG QR Code (scannable at theatre gates)
  - Booking Reference Code (e.g. `IMV-8392-OR`)
  - Screen number, date, time, format (`IMAX 3D`, `Dolby Cinema`, `4DX`)
  - Built-in print button (`window.print`)
- 1-Click cancellation with automatic seat release and refund logging.

### 5. Admin Control Center
- Live KPIs: Total Revenue, Occupancy Rate, Tickets Sold, and Active Theatres.
- Add movies to the cinema repertoire with custom duration and ratings.
- Schedule showtimes across auditoriums with custom tier pricing.

---

## 🚀 Running the Project

### Development
```bash
npm run dev
```
Starts the unified server at `http://localhost:3000`. Both the Express REST API (`/api/*`) and React frontend (`/client/*`) run concurrently on port 3000.

### Production Build
```bash
npm run build
npm start
```
