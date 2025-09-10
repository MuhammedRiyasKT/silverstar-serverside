// require('dotenv').config();
// const express = require('express');
// const cors = require('cors');
// const helmet = require('helmet');
// const morgan = require('morgan');
// const compression = require('compression');
// const rateLimit = require('express-rate-limit');
// const connectDB = require('./config/database');
// const errorHandler = require('./middleware/errorHandler');
// const orderRoutes = require('./routes/orders');
// const tableRoutes = require('./routes/tables');

// // Import routes
// const authRoutes = require('./routes/auth');
// const categoryRoutes = require('./routes/categories');
// const menuRoutes = require('./routes/menu');

// // Connect to database
// connectDB();

// const app = express();

// // Security middleware
// app.use(helmet());

// // Rate limiting
// const limiter = rateLimit({
//   windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
//   max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
//   message: {
//     success: false,
//     message: 'Too many requests from this IP, please try again later.'
//   }
// });

// app.use('/api/', limiter);

// // CORS configuration
// const corsOptions = {
//   origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : ['http://localhost:3000'],
//   credentials: true,
//   optionsSuccessStatus: 200
// };

// // app.use(cors({
// //   origin: ['https://silverstar-frontend.vercel.app'], // Replace with your Vercel domain
// //   methods: ['GET', 'POST', 'PUT', 'DELETE'],
// //   credentials: true, // If using cookies/auth
// // }));
// app.use(cors(corsOptions));

// // Body parsing middleware
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// // Compression middleware
// app.use(compression());

// // Logging middleware
// if (process.env.NODE_ENV === 'development') {
//   app.use(morgan('dev'));
// } else {
//   app.use(morgan('combined'));
// }

// // Health check route
// app.get('/health', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV
//   });
// });

// // api check Route
// app.get('/', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Server is running',
//     timestamp: new Date().toISOString(),
//     environment: process.env.NODE_ENV
//   });
// });

// // API routes
// app.use('/api/auth', authRoutes);
// app.use('/api/categories', categoryRoutes);
// app.use('/api/menu', menuRoutes);
// app.use('/api/orders', orderRoutes);
// app.use('/api/tables', tableRoutes);

// // 404 handler
// app.use('*', (req, res) => {
//   res.status(404).json({
//     success: false,
//     message: 'Route not found'
//   });
// });

// // Error handling middleware (must be last)
// app.use(errorHandler);

// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(`
// 🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
// 📱 Health check: http://localhost:${PORT}/health
// 📚 API Base URL: http://localhost:${PORT}
//   `);
// });

// // Handle unhandled promise rejections
// process.on('unhandledRejection', (err, promise) => {
//   console.log(`❌ Unhandled Rejection: ${err.message}`);
//   server.close(() => {
//     process.exit(1);
//   });
// });

// // Handle uncaught exceptions
// process.on('uncaughtException', (err) => {
//   console.log(`❌ Uncaught Exception: ${err.message}`);
//   process.exit(1);
// });

// module.exports = app;

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const { Server } = require('socket.io');
const http = require('http');
const admin = require("firebase-admin");
const fs = require("fs")
const path = require("path")

const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');

// Routes
const orderRoutes = require('./routes/orders');
const tableRoutes = require('./routes/tables');
const authRoutes = require('./routes/auth');
const categoryRoutes = require('./routes/categories');
const menuRoutes = require('./routes/menu');
const settingsRoutes = require('./routes/settings');
const fcmRoutes = require("./routes/fcmRoutes");

// ---------- Database ----------
connectDB();

const app = express();
const server = http.createServer(app);

// ---------- Firebase Admin Init ✅ ----------
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

// load and parse JSON file
const serviceAccount = JSON.parse(
  fs.readFileSync(path.resolve(serviceAccountPath), "utf8")
);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
  console.log("✅ Firebase Admin initialized");
}

// ---------- Security + Rate Limit ----------
app.use(helmet());
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use('/api/', limiter);

// ---------- CORS ----------
const corsOrigins = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(',')
  : ['http://localhost:3000'];
app.use(cors({ origin: corsOrigins, credentials: true }));

// ---------- Parsers ----------
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(compression());

// ---------- Logger ----------
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
else app.use(morgan('combined'));

// ---------- Health Routes ----------
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
  });
});

// ---------- API Routes ----------
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/settings', settingsRoutes);
app.use("/api", fcmRoutes);

// ---------- 404 Handler ----------
app.use('*', (req, res) =>
  res.status(404).json({ success: false, message: 'Route not found' })
);
app.use(errorHandler);

// ---------- Socket.IO ----------
const io = new Server(server, {
  cors: { origin: corsOrigins, credentials: true },
});

// Make io available in controllers
app.set('io', io);

io.on('connection', (socket) => {
  console.log(`✅ Socket connected: ${socket.id}`);

  // client → join a table room
  socket.on('join-table', (tableId) => {
    if (tableId) {
      socket.join(`table:${tableId}`);
      console.log(`➡️ ${socket.id} joined table:${tableId}`);
    }
  });

  // admin → receive all updates
  socket.on('join-admin', () => {
    socket.join('admins');
    console.log(`➡️ ${socket.id} joined admins`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
  });
});

// ---------- Start Server ----------
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`
🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}
📱 Health check: http://localhost:${PORT}/health
📚 API Base URL: http://localhost:${PORT}
  `);
});

// ---------- Error Handling ----------
process.on('unhandledRejection', (err) => {
  console.error(`❌ Unhandled Rejection: ${err.message}`);
  server.close(() => process.exit(1));
});
process.on('uncaughtException', (err) => {
  console.error(`❌ Uncaught Exception: ${err.message}`);
  process.exit(1);
});

module.exports = app;
