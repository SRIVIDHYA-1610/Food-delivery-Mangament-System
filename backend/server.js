const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');
const connectDB = require('./config/database');
const { RateLimiterMemory } = require('rate-limiter-flexible');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const server = http.createServer(app);

// Allow multiple client origins
const allowedOrigins = (process.env.CLIENT_URLS || process.env.CLIENT_URL || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map(o => o.trim());

const io = socketIo(server, {
  cors: {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true); // allow non-browser clients
      if (allowedOrigins.includes(origin)) return callback(null, true);
      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }
});

// Initialize rate limiter
const opts = {
  points: 100, // Number of requests allowed
  duration: 60, // Per 60 seconds
};
const rateLimiter = new RateLimiterMemory(opts);

// Rate limiting middleware
const rateLimitMiddleware = async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip);
    next();
  } catch (rejRes) {
    res.status(429).send('Too Many Requests');
  }
};

// Middleware
app.use(rateLimitMiddleware); // Apply rate limiting globally
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Make io accessible to routes
app.set('io', io);

// Connect to MongoDB
connectDB();

// Seed default admin user
const seedAdmin = require('./seeders/adminSeeder');
seedAdmin();

// Seed restaurants
const seedRestaurants = require('./seeders/restaurantSeeder');
seedRestaurants();

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join user-specific room
  socket.on('join_user_room', (userId) => {
    socket.join(`user_${userId}`);
    console.log(`User ${userId} joined their room`);
  });

  // Join restaurant-specific room
  socket.on('join_restaurant_room', (restaurantId) => {
    socket.join(`restaurant_${restaurantId}`);
    console.log(`Restaurant ${restaurantId} joined their room`);
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Serve static files from uploads directory
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/restaurants', require('./routes/restaurants'));
app.use('/api/menu', require('./routes/menu'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/upload', require('./routes/upload'));

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
