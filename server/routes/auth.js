import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User from '../models/User.js';

const router = express.Router();

// In-memory user storage for when DB is not available
const memoryUsers = new Map();

// Register/Login user
router.post('/login', async (req, res) => {
  try {
    const { email, name, auth0Id, avatar } = req.body;

    let user;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      // Use MongoDB
      user = await User.findOne({ 
        $or: [{ email }, { auth0Id }] 
      });

      if (!user) {
        user = new User({
          email,
          name,
          auth0Id,
          avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`
        });
        await user.save();
      } else {
        // Update user info if changed
        user.name = name;
        user.avatar = avatar || user.avatar;
        await user.save();
      }
    } else {
      // Use in-memory storage when DB is not available
      console.log('Database not available, using in-memory storage');
      
      // Create a valid ObjectId-like string for compatibility
      const userId = auth0Id || new mongoose.Types.ObjectId().toString();
      user = memoryUsers.get(email) || {
        _id: userId,
        email,
        name,
        auth0Id: userId,
        avatar: avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=6366f1&color=fff`,
        subscription: { plan: 'free', status: 'active' },
        preferences: { theme: 'light', notifications: true }
      };
      
      // Update user info
      user.name = name;
      user.avatar = avatar || user.avatar;
      memoryUsers.set(email, user);
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        subscription: user.subscription || { plan: 'free', status: 'active' },
        preferences: user.preferences || { theme: 'light', notifications: true }
      }
    });
  } catch (error) {
    console.error('Auth error:', error);
    res.status(500).json({ error: 'Authentication failed: ' + error.message });
  }
});

// Get user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    let user;
    
    if (mongoose.connection.readyState === 1) {
      user = await User.findById(req.userId).select('-__v');
    } else {
      // Find user in memory storage
      user = Array.from(memoryUsers.values()).find(u => u._id === req.userId);
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user preferences
router.put('/preferences', authenticateToken, async (req, res) => {
  try {
    const { preferences } = req.body;
    let user;
    
    if (mongoose.connection.readyState === 1) {
      user = await User.findByIdAndUpdate(
        req.userId,
        { preferences },
        { new: true }
      ).select('-__v');
    } else {
      // Update in memory storage
      user = Array.from(memoryUsers.values()).find(u => u._id === req.userId);
      if (user) {
        user.preferences = preferences;
        memoryUsers.set(user.email, user);
      }
    }
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Preferences update error:', error);
    res.status(500).json({ error: 'Failed to update preferences' });
  }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key', (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.userId = decoded.userId;
    req.userEmail = decoded.email;
    next();
  });
}

export { authenticateToken };
export default router;