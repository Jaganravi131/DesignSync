import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Import routes
import authRoutes from './routes/auth.js';
import designRoutes from './routes/designs.js';
import templateRoutes from './routes/templates.js';
import collaborationRoutes from './routes/collaboration.js';

// Import models
import Design from './models/Design.js';
import User from './models/User.js';

dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? false : ['http://localhost:5173'],
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// File upload configuration
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Database connection status
let isDbConnected = false;

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    // Only attempt connection if MONGODB_URI is provided
    if (!process.env.MONGODB_URI) {
      console.log('⚠️  No MONGODB_URI provided - running in offline mode');
      console.log('📝 Some features requiring database will be limited');
      console.log('🔧 To enable full functionality:');
      console.log('   1. Set up MongoDB Atlas at https://www.mongodb.com/atlas');
      console.log('   2. Or install MongoDB locally: https://docs.mongodb.com/manual/installation/');
      console.log('   3. Set MONGODB_URI in your .env file');
      console.log('   4. Restart the server');
      return;
    }
    
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferTimeoutMS: 30000, // Buffer timeout of 30 seconds
    });
    
    isDbConnected = true;
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('🔄 Running in offline mode - some features may be limited');
    console.log('🔧 To fix this:');
    console.log('   1. Check your MONGODB_URI in the .env file');
    console.log('   2. Ensure MongoDB is running (if using local instance)');
    console.log('   3. Check network connectivity (if using MongoDB Atlas)');
    console.log('   4. Verify database credentials and permissions');
    isDbConnected = false;
  }
};

connectDB();

// Handle MongoDB connection events
mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err.message);
  isDbConnected = false;
});

mongoose.connection.on('disconnected', () => {
  console.log('🔌 MongoDB disconnected');
  isDbConnected = false;
});

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected');
  isDbConnected = true;
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/designs', designRoutes);
app.use('/api/templates', templateRoutes);
app.use('/api/collaboration', collaborationRoutes);

// Health check
app.get('/api/health', (req, res) => {
  const dbStatus = isDbConnected ? 'connected' : 'disconnected';
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    database: dbStatus,
    message: isDbConnected ? 'All systems operational' : 'Running in offline mode - database features limited'
  });
});

// Real-time collaboration
const activeRooms = new Map();
const userSockets = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Join design room
  socket.on('join-design', async ({ designId, userId, token }) => {
    try {
      // Verify JWT token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (decoded.userId !== userId) {
        socket.emit('error', { message: 'Unauthorized' });
        return;
      }

      // Join room
      socket.join(`design-${designId}`);
      socket.designId = designId;
      socket.userId = userId;
      
      // Track active users
      if (!activeRooms.has(designId)) {
        activeRooms.set(designId, new Set());
      }
      activeRooms.get(designId).add(userId);
      userSockets.set(userId, socket.id);

      // Get user info (only if DB is connected)
      let user = null;
      if (isDbConnected) {
        try {
          user = await User.findById(userId).select('name email avatar');
        } catch (error) {
          console.error('Error fetching user:', error.message);
        }
      }
      
      // Notify others in room
      socket.to(`design-${designId}`).emit('user-joined', {
        userId,
        user: user,
        socketId: socket.id
      });

      // Send current active users to new user (only if DB is connected)
      if (isDbConnected) {
        try {
          const activeUsers = Array.from(activeRooms.get(designId));
          const users = await User.find({ _id: { $in: activeUsers } }).select('name email avatar');
          socket.emit('active-users', users);
        } catch (error) {
          console.error('Error fetching active users:', error.message);
        }
      }

      console.log(`User ${userId} joined design ${designId}`);
    } catch (error) {
      console.error('Join design error:', error);
      socket.emit('error', { message: 'Failed to join design' });
    }
  });

  // Handle design updates
  socket.on('design-update', (data) => {
    if (socket.designId) {
      socket.to(`design-${socket.designId}`).emit('design-updated', {
        ...data,
        userId: socket.userId,
        timestamp: Date.now()
      });
    }
  });

  // Handle cursor movement
  socket.on('cursor-move', (data) => {
    if (socket.designId) {
      socket.to(`design-${socket.designId}`).emit('cursor-moved', {
        userId: socket.userId,
        position: data.position,
        timestamp: Date.now()
      });
    }
  });

  // Handle element selection
  socket.on('element-select', (data) => {
    if (socket.designId) {
      socket.to(`design-${socket.designId}`).emit('element-selected', {
        userId: socket.userId,
        elementId: data.elementId,
        timestamp: Date.now()
      });
    }
  });

  // Handle comments
  socket.on('add-comment', async (data) => {
    try {
      if (socket.designId && isDbConnected) {
        const user = await User.findById(socket.userId).select('name email avatar');
        const comment = {
          id: uuidv4(),
          userId: socket.userId,
          user: user,
          text: data.text,
          position: data.position,
          timestamp: Date.now()
        };

        // Save comment to design
        await Design.findByIdAndUpdate(socket.designId, {
          $push: { comments: comment }
        });

        // Broadcast to room
        io.to(`design-${socket.designId}`).emit('comment-added', comment);
      } else if (!isDbConnected) {
        socket.emit('error', { message: 'Comments require database connection' });
      }
    } catch (error) {
      console.error('Add comment error:', error);
      socket.emit('error', { message: 'Failed to add comment' });
    }
  });

  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    
    if (socket.designId && socket.userId) {
      // Remove from active users
      if (activeRooms.has(socket.designId)) {
        activeRooms.get(socket.designId).delete(socket.userId);
        if (activeRooms.get(socket.designId).size === 0) {
          activeRooms.delete(socket.designId);
        }
      }
      
      userSockets.delete(socket.userId);
      
      // Notify others in room
      socket.to(`design-${socket.designId}`).emit('user-left', {
        userId: socket.userId
      });
    }
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Database status: ${isDbConnected ? '✅ Connected' : '⚠️  Offline mode'}`);
  if (!isDbConnected) {
    console.log('💡 Tip: Configure MONGODB_URI in .env to enable full database features');
  }
});