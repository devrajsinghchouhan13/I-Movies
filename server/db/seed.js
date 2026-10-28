import bcrypt from 'bcryptjs';

// Pre-hashed passwords for instant startup
// 'Admin@123'
const ADMIN_HASH = bcrypt.hashSync('Admin@123', 8);
// 'User@123'
const USER_HASH = bcrypt.hashSync('User@123', 8);

export const SEED_USERS = [
  {
    id: 'usr_admin_1',
    name: 'Vikramaditya Rao',
    email: 'admin@imovies.com',
    passwordHash: ADMIN_HASH,
    role: 'admin',
    phone: '+91 98260 12345',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_demo_1',
    name: 'Arjun Sharma',
    email: 'elena@cinema.com', // Keeps backward compatibility with fast-login buttons
    passwordHash: USER_HASH,
    role: 'user',
    phone: '+91 98930 56789',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    createdAt: new Date().toISOString()
  }
];

export const SEED_MOVIES = [
  {
    id: 'mov_chhaava',
    title: 'Chhaava: The Great Warrior',
    tagline: 'The immortal courage of Chhatrapati Sambhaji Maharaj.',
    description: 'Based on the heroic saga of Chhatrapati Sambhaji Maharaj, the fearless son of Chhatrapati Shivaji Maharaj, who defended Swarajya against the mighty Mughal army with indomitable valor, tactical genius, and sacrifice.',
    posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?auto=format&fit=crop&w=1600&q=80',
    genre: ['Historical Epic', 'Action', 'Drama'],
    durationMinutes: 165,
    releaseDate: '2026-10-18',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 9.4,
    certification: 'U/A 16+',
    cast: ['Vicky Kaushal', 'Rashmika Mandanna', 'Akshaye Khanna', 'Ashutosh Rana'],
    director: 'Laxman Utekar',
    trailerUrl: 'https://www.youtube.com/watch?v=0kG7-7M5T60',
    status: 'featured',
    audioFormat: 'IMAX 3D Laser · Dolby Atmos 7.1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_stree_2',
    title: 'Stree 2: Sarkate Ka Aatank',
    tagline: 'O Stree Raksha Karna — The headless phantom strikes Chanderi.',
    description: 'When the sinister headless apparition Sarkata starts abducting independent women from Chanderi, Vicky, Bittu, Janna, and Rudra Bhaiya must join forces with the mysterious nameless woman and an incarcerated enemy to save their town.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1600&q=80',
    genre: ['Horror Comedy', 'Comedy', 'Mystery'],
    durationMinutes: 147,
    releaseDate: '2026-10-10',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 9.1,
    certification: 'U/A 16+',
    cast: ['Shraddha Kapoor', 'Rajkummar Rao', 'Pankaj Tripathi', 'Aparshakti Khurana', 'Abhishek Banerjee'],
    director: 'Amar Kaushik',
    trailerUrl: 'https://www.youtube.com/watch?v=KVnhe4xwrgk',
    status: 'now_showing',
    audioFormat: 'Dolby Atmos · 4K Digital',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_jawan',
    title: 'Jawan',
    tagline: 'Ready or Not, Justice Arrives with a Bang.',
    description: 'A gripping mass action thriller about a wounded soldier and prison warden driven by personal vengeance and righteous fury to expose systemic political corruption and fulfill an emotional promise made long ago.',
    posterUrl: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1486572788966-cfd3dfdd4a48?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Thriller', 'Drama'],
    durationMinutes: 169,
    releaseDate: '2026-10-05',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 9.2,
    certification: 'U/A 16+',
    cast: ['Shah Rukh Khan', 'Nayanthara', 'Vijay Sethupathi', 'Deepika Padukone', 'Sanya Malhotra'],
    director: 'Atlee',
    trailerUrl: 'https://www.youtube.com/watch?v=MWOlnZSnXJo',
    status: 'now_showing',
    audioFormat: 'IMAX 4K · Dolby Atmos',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_fighter',
    title: 'Fighter',
    tagline: 'Wings of Glory: Defending India\'s Sovereign Skies.',
    description: 'Top combat aviators from the Indian Air Force come together to form the elite Air Dragons unit, ready to sacrifice everything in daring aerial dogfights and strategic strikes against enemy forces in difficult Himalayan terrain.',
    posterUrl: 'https://images.unsplash.com/photo-1519074069444-1ba4e321b021?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Thriller', 'Drama'],
    durationMinutes: 166,
    releaseDate: '2026-10-12',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 8.8,
    certification: 'U/A 13+',
    cast: ['Hrithik Roshan', 'Deepika Padukone', 'Anil Kapoor', 'Karan Singh Grover'],
    director: 'Siddharth Anand',
    trailerUrl: 'https://www.youtube.com/watch?v=6amIq_mP4xM',
    status: 'now_showing',
    audioFormat: '4DX Dynamic · IMAX 3D',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_12th_fail',
    title: '12th Fail',
    tagline: 'Restart! The triumph of unwavering honesty and perseverance.',
    description: 'The real-life inspirational journey of IPS Officer Manoj Kumar Sharma from Chambal, who overcame extreme poverty, odd jobs as a flour mill cleaner, and numerous exam failures to achieve the impossible through sheer grit.',
    posterUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=1600&q=80',
    genre: ['Biographical', 'Drama'],
    durationMinutes: 147,
    releaseDate: '2026-09-28',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 9.6,
    certification: 'U',
    cast: ['Vikrant Massey', 'Medha Shankr', 'Anant V Joshi', 'Geeta Agrawal Sharma'],
    director: 'Vidhu Vinod Chopra',
    trailerUrl: 'https://www.youtube.com/watch?v=we53K_hC9g0',
    status: 'now_showing',
    audioFormat: 'Dolby Atmos 5.1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_animal',
    title: 'Animal',
    tagline: 'A ferocious tale of blood, loyalty, and fierce obsession.',
    description: 'A complex, visceral psychological drama examining the volatile bond between a fiercely devoted son and his emotionally unavailable father, leading into a ruthless underworld feud with catastrophic consequences.',
    posterUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1514306191717-452ec28c7814?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Drama', 'Thriller'],
    durationMinutes: 201,
    releaseDate: '2026-10-01',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 8.6,
    certification: 'A',
    cast: ['Ranbir Kapoor', 'Anil Kapoor', 'Rashmika Mandanna', 'Bobby Deol', 'Triptii Dimri'],
    director: 'Sandeep Reddy Vanga',
    trailerUrl: 'https://www.youtube.com/watch?v=DydmpkhEvVk',
    status: 'now_showing',
    audioFormat: 'Dolby Cinema Luxe · 4K',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_bhool_bhulaiyaa_3',
    title: 'Bhool Bhulaiyaa 3',
    tagline: 'Rooh Baba enters the ancestral haveli to confront Manjulika.',
    description: 'Rooh Baba travels to the royal state of West Bengal to perform an exorcism at an eerie royal palace, only to come face to face with the wrath of dual vengeful spirits inhabiting the ancestral chambers.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1600&q=80',
    genre: ['Horror Comedy', 'Comedy', 'Mystery'],
    durationMinutes: 158,
    releaseDate: '2026-10-22',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 8.7,
    certification: 'U/A 13+',
    cast: ['Kartik Aaryan', 'Vidya Balan', 'Madhuri Dixit', 'Triptii Dimri', 'Rajpal Yadav'],
    director: 'Anees Bazmee',
    trailerUrl: 'https://www.youtube.com/watch?v=0kG7-7M5T60',
    status: 'now_showing',
    audioFormat: 'Dolby Atmos · 2D',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_dunki',
    title: 'Dunki',
    tagline: 'A heartwarming voyage across continents for home and love.',
    description: 'Four close friends from a quiet Punjab village set out on an audacious, heartwarming journey to the United Kingdom through an unconventional path known as the Donkey route, discovering the true meaning of home.',
    posterUrl: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1600&q=80',
    genre: ['Comedy', 'Drama', 'Romantic'],
    durationMinutes: 161,
    releaseDate: '2026-09-20',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 8.9,
    certification: 'U/A 13+',
    cast: ['Shah Rukh Khan', 'Taapsee Pannu', 'Vicky Kaushal', 'Boman Irani', 'Vikram Kochhar'],
    director: 'Rajkumar Hirani',
    trailerUrl: 'https://www.youtube.com/watch?v=MWOlnZSnXJo',
    status: 'now_showing',
    audioFormat: 'Dolby Atmos 7.1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_singham_again',
    title: 'Singham Again',
    tagline: 'The Cop Universe mobilizes for the grand battle against evil.',
    description: 'DCP Bajirao Singham leads an international covert operation across Sri Lanka to rescue his kidnapped wife Avni, commanding a formidable alliance of lawmen including Simmba, Sooryavanshi, and Lady Singham Shakti Shetty.',
    posterUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Thriller'],
    durationMinutes: 144,
    releaseDate: '2026-10-25',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 8.5,
    certification: 'U/A 16+',
    cast: ['Ajay Devgn', 'Kareena Kapoor Khan', 'Ranveer Singh', 'Akshay Kumar', 'Deepika Padukone', 'Tiger Shroff'],
    director: 'Rohit Shetty',
    trailerUrl: 'https://www.youtube.com/watch?v=6amIq_mP4xM',
    status: 'now_showing',
    audioFormat: 'Dolby Cinema · 4DX',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_kalki_hindi',
    title: 'Kalki 2898 AD (Hindi)',
    tagline: 'The Future of Humanity Collides with Ancient Indian Mythology.',
    description: 'In the dystopian mega-city of Kasi in the year 2898 AD, the immortal warrior Ashwatthama emerges after thousands of years to safeguard the sacred unborn avatar from the ruthless supreme leader Yaskin.',
    posterUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80',
    genre: ['Historical Epic', 'Action', 'Sci-Fi'],
    durationMinutes: 181,
    releaseDate: '2026-10-15',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 9.1,
    certification: 'U/A 16+',
    cast: ['Amitabh Bachchan', 'Prabhas', 'Deepika Padukone', 'Kamal Haasan', 'Disha Patani'],
    director: 'Nag Ashwin',
    trailerUrl: 'https://www.youtube.com/watch?v=KVnhe4xwrgk',
    status: 'now_showing',
    audioFormat: 'IMAX 3D Laser · Dolby Atmos',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_brahmastra',
    title: 'Brahmāstra: Part One – Shiva',
    tagline: 'The Lord of the Astras awakens within.',
    description: 'Shiva, a spirited DJ in Mumbai, stumbles upon his mystical affinity with fire and discovers his destiny as the guardian of Brahmāstra, the supreme mythological weapon capable of annihilating the universe.',
    posterUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1507499739999-097706ad8914?auto=format&fit=crop&w=1600&q=80',
    genre: ['Romantic', 'Action', 'Historical Epic'],
    durationMinutes: 167,
    releaseDate: '2026-09-15',
    language: 'Hindi',
    industry: 'Bollywood',
    rating: 8.6,
    certification: 'U/A 13+',
    cast: ['Ranbir Kapoor', 'Alia Bhatt', 'Amitabh Bachchan', 'Mouni Roy', 'Nagarjuna Akkineni'],
    director: 'Ayan Mukerji',
    trailerUrl: 'https://www.youtube.com/watch?v=0kG7-7M5T60',
    status: 'now_showing',
    audioFormat: 'IMAX 3D · Dolby Atmos 7.1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'mov_sholay_4k',
    title: 'Sholay (4K Remastered Special)',
    tagline: 'Kitne Aadmi The? The greatest Indian cinema masterpiece in 4K.',
    description: 'Thakur Baldev Singh enlists the legendary ex-convicts Jai and Veeru to capture the notorious dacoit Gabbar Singh in the rugged hills of Ramgarh. Restored in stunning 4K laser projection with Dolby Atmos audio.',
    posterUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    backdropUrl: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1600&q=80',
    genre: ['Action', 'Historical Epic', 'Drama'],
    durationMinutes: 204,
    releaseDate: '2026-10-01',
    language: 'Hindi',
    industry: 'Bollywood Classic',
    rating: 9.8,
    certification: 'U',
    cast: ['Amitabh Bachchan', 'Dharmendra', 'Hema Malini', 'Sanjeev Kumar', 'Amjad Khan', 'Jaya Bachchan'],
    director: 'Ramesh Sippy',
    trailerUrl: 'https://www.youtube.com/watch?v=we53K_hC9g0',
    status: 'now_showing',
    audioFormat: '4K Remastered · Dolby Atmos',
    createdAt: new Date().toISOString()
  }
];

export const SEED_THEATRES = [
  {
    id: 'th_grand_horizon',
    name: 'Grand Horizon IMAX Cinema',
    city: 'Indore',
    location: 'Phoenix Citadel, MR 10',
    address: 'Phoenix Citadel Mall, MR 10 Junction, Indore, MP 452016',
    screens: [
      {
        screenNumber: 1,
        name: 'IMAX Laser Auditorium',
        format: 'IMAX 3D',
        totalSeats: 64,
        rows: 8,
        cols: 8
      },
      {
        screenNumber: 2,
        name: 'Dolby Atmos Prime',
        format: 'Dolby Cinema',
        totalSeats: 64,
        rows: 8,
        cols: 8
      }
    ]
  },
  {
    id: 'th_starline_metroplex',
    name: 'Starline Dolby Cinema Luxe',
    city: 'Indore',
    location: 'Treasure Island, MG Road',
    address: 'Treasure Island Mall, 11 South Tukoganj, MG Road, Indore, MP 452001',
    screens: [
      {
        screenNumber: 1,
        name: 'Luxe Screen 1',
        format: 'Dolby Cinema',
        totalSeats: 64,
        rows: 8,
        cols: 8
      },
      {
        screenNumber: 2,
        name: 'Standard Screen 2',
        format: '2D Laser',
        totalSeats: 64,
        rows: 8,
        cols: 8
      }
    ]
  },
  {
    id: 'th_cineprime_apex',
    name: 'CinePrime 4DX Multiplex',
    city: 'Indore',
    location: 'C21 Mall, Vijay Nagar',
    address: 'C21 Mall, AB Road, Scheme 54 PU4, Vijay Nagar, Indore, MP 452010',
    screens: [
      {
        screenNumber: 1,
        name: '4DX Dynamic Hall',
        format: '4DX',
        totalSeats: 64,
        rows: 8,
        cols: 8
      }
    ]
  }
];

export function generateScreenSeats(showPricing) {
  const seats = [];
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const cols = 8;

  rows.forEach((row, rowIndex) => {
    for (let c = 1; c <= cols; c++) {
      let tier = 'standard';
      let price = showPricing.standard;

      if (rowIndex >= 2 && rowIndex <= 5) {
        tier = 'premium';
        price = showPricing.premium;
      } else if (rowIndex >= 6) {
        tier = 'vip';
        price = showPricing.vip;
      }

      let status = 'available';
      if ((row === 'D' && (c === 4 || c === 5)) || (row === 'F' && (c === 3 || c === 6)) || (row === 'G' && c === 4)) {
        status = 'reserved';
      }

      seats.push({
        id: `${row}${c}`,
        seatNumber: `${row}${c}`,
        row,
        col: c,
        tier,
        price,
        status
      });
    }
  });

  return seats;
}

// Generate dynamic showtimes for Today, Tomorrow, and Day After
export function generateDynamicShows() {
  const today = new Date();
  const dateStrings = [
    today.toISOString().split('T')[0],
    new Date(today.getTime() + 86400000).toISOString().split('T')[0],
    new Date(today.getTime() + 86400000 * 2).toISOString().split('T')[0]
  ];

  const shows = [];
  let showIndex = 1;

  // Curated show distribution across Indore multiplexes
  const schedules = [
    // Grand Horizon IMAX (Phoenix Citadel)
    { movieId: 'mov_chhaava', theatreId: 'th_grand_horizon', screenNumber: 1, format: 'IMAX 3D', startTime: '13:00', endTime: '15:45', pricing: { standard: 260, premium: 360, vip: 550 } },
    { movieId: 'mov_chhaava', theatreId: 'th_grand_horizon', screenNumber: 1, format: 'IMAX 3D', startTime: '16:30', endTime: '19:15', pricing: { standard: 280, premium: 380, vip: 600 } },
    { movieId: 'mov_chhaava', theatreId: 'th_grand_horizon', screenNumber: 1, format: 'IMAX 3D', startTime: '20:15', endTime: '23:00', pricing: { standard: 280, premium: 380, vip: 600 } },
    { movieId: 'mov_stree_2', theatreId: 'th_grand_horizon', screenNumber: 2, format: 'Dolby Cinema', startTime: '14:15', endTime: '16:42', pricing: { standard: 240, premium: 320, vip: 480 } },
    { movieId: 'mov_stree_2', theatreId: 'th_grand_horizon', screenNumber: 2, format: 'Dolby Cinema', startTime: '17:30', endTime: '19:57', pricing: { standard: 250, premium: 340, vip: 500 } },
    { movieId: 'mov_stree_2', theatreId: 'th_grand_horizon', screenNumber: 2, format: 'Dolby Cinema', startTime: '20:45', endTime: '23:12', pricing: { standard: 250, premium: 340, vip: 500 } },
    { movieId: 'mov_jawan', theatreId: 'th_grand_horizon', screenNumber: 2, format: 'Dolby Cinema', startTime: '10:30', endTime: '13:19', pricing: { standard: 220, premium: 300, vip: 450 } },

    // Starline Dolby Cinema Luxe (Treasure Island MG Road)
    { movieId: 'mov_fighter', theatreId: 'th_starline_metroplex', screenNumber: 1, format: 'Dolby Cinema', startTime: '13:45', endTime: '16:31', pricing: { standard: 240, premium: 330, vip: 490 } },
    { movieId: 'mov_fighter', theatreId: 'th_starline_metroplex', screenNumber: 1, format: 'Dolby Cinema', startTime: '18:00', endTime: '20:46', pricing: { standard: 260, premium: 350, vip: 520 } },
    { movieId: 'mov_12th_fail', theatreId: 'th_starline_metroplex', screenNumber: 2, format: '2D Laser', startTime: '12:00', endTime: '14:27', pricing: { standard: 190, premium: 260, vip: 390 } },
    { movieId: 'mov_12th_fail', theatreId: 'th_starline_metroplex', screenNumber: 2, format: '2D Laser', startTime: '15:30', endTime: '17:57', pricing: { standard: 200, premium: 280, vip: 400 } },
    { movieId: 'mov_animal', theatreId: 'th_starline_metroplex', screenNumber: 1, format: 'Dolby Cinema', startTime: '21:15', endTime: '00:36', pricing: { standard: 250, premium: 340, vip: 510 } },
    { movieId: 'mov_dunki', theatreId: 'th_starline_metroplex', screenNumber: 2, format: '2D Laser', startTime: '18:45', endTime: '21:26', pricing: { standard: 210, premium: 290, vip: 420 } },

    // CinePrime 4DX Multiplex (C21 Mall Vijay Nagar)
    { movieId: 'mov_singham_again', theatreId: 'th_cineprime_apex', screenNumber: 1, format: '4DX', startTime: '11:30', endTime: '13:54', pricing: { standard: 280, premium: 380, vip: 560 } },
    { movieId: 'mov_singham_again', theatreId: 'th_cineprime_apex', screenNumber: 1, format: '4DX', startTime: '15:00', endTime: '17:24', pricing: { standard: 300, premium: 400, vip: 590 } },
    { movieId: 'mov_kalki_hindi', theatreId: 'th_cineprime_apex', screenNumber: 1, format: '4DX', startTime: '18:15', endTime: '21:16', pricing: { standard: 310, premium: 420, vip: 620 } },
    { movieId: 'mov_bhool_bhulaiyaa_3', theatreId: 'th_cineprime_apex', screenNumber: 1, format: '4DX', startTime: '22:00', endTime: '00:38', pricing: { standard: 290, premium: 390, vip: 580 } },
    { movieId: 'mov_brahmastra', theatreId: 'th_grand_horizon', screenNumber: 1, format: 'IMAX 3D', startTime: '09:30', endTime: '12:17', pricing: { standard: 240, premium: 320, vip: 480 } },
    { movieId: 'mov_sholay_4k', theatreId: 'th_starline_metroplex', screenNumber: 2, format: '2D Laser', startTime: '22:00', endTime: '01:24', pricing: { standard: 200, premium: 270, vip: 390 } }
  ];

  dateStrings.forEach((dateStr) => {
    schedules.forEach((item) => {
      shows.push({
        id: `sh_${item.movieId.replace('mov_', '')}_${showIndex++}`,
        movieId: item.movieId,
        theatreId: item.theatreId,
        screenNumber: item.screenNumber,
        date: dateStr,
        startTime: item.startTime,
        endTime: item.endTime,
        format: item.format,
        pricing: item.pricing,
        totalSeats: 64,
        availableSeats: 59
      });
    });
  });

  return shows;
}

export const SEED_SHOWS = generateDynamicShows();

const todayStr = new Date().toISOString().split('T')[0];

export const SEED_BOOKINGS = [
  {
    id: 'bk_sample_01',
    bookingReference: 'IMV-8392-OR',
    userId: 'usr_demo_1',
    userName: 'Arjun Sharma',
    userEmail: 'elena@cinema.com',
    movieId: 'mov_chhaava',
    movieTitle: 'Chhaava: The Great Warrior',
    moviePoster: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=800&q=80',
    theatreId: 'th_grand_horizon',
    theatreName: 'Grand Horizon IMAX Cinema',
    theatreLocation: 'Phoenix Citadel, MR 10, Indore',
    screenNumber: 1,
    showId: 'sh_chhaava_1',
    showDate: todayStr,
    showTime: '16:30',
    format: 'IMAX 3D',
    seats: [
      { seatNumber: 'D4', row: 'D', tier: 'premium', price: 360 },
      { seatNumber: 'D5', row: 'D', tier: 'premium', price: 360 }
    ],
    subtotal: 720,
    convenienceFee: 50,
    tax: 58,
    totalAmount: 828,
    payment: {
      paymentId: 'pay_tx_902348',
      method: 'upi',
      amount: 828,
      status: 'completed',
      timestamp: new Date(Date.now() - 3600000 * 4).toISOString(),
      cardLast4: null
    },
    status: 'confirmed',
    qrCodeData: 'IMV:8392-OR|USR:usr_demo_1|SHW:sh_chhaava_1|SEATS:D4,D5',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  }
];
