import express from 'express';
import mongoose from 'mongoose';
import Design from '../models/Design.js';
import { authenticateToken } from './auth.js';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory design storage for when DB is not available
const memoryDesigns = new Map();

// Get all designs for user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { category, status, search } = req.query;
    
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      let query = {
        $or: [
          { owner: req.userId },
          { 'collaborators.user': req.userId }
        ]
      };

      if (category) query.category = category;
      if (status) query.status = status;
      if (search) {
        query.$and = [
          query.$and || {},
          {
            $or: [
              { title: { $regex: search, $options: 'i' } },
              { description: { $regex: search, $options: 'i' } },
              { tags: { $in: [new RegExp(search, 'i')] } }
            ]
          }
        ];
      }

      const designs = await Design.find(query)
        .populate('owner', 'name email avatar')
        .populate('collaborators.user', 'name email avatar')
        .populate('lastModifiedBy', 'name email avatar')
        .sort({ lastModified: -1 })
        .limit(50);

      res.json(designs);
    } else {
      // Use in-memory storage when DB is not available
      console.log('Database not available, using in-memory storage for designs');
      
      let designs = Array.from(memoryDesigns.values()).filter(design => 
        design.owner === req.userId
      );

      // Apply filters
      if (category) designs = designs.filter(d => d.category === category);
      if (status) designs = designs.filter(d => d.status === status);
      if (search) {
        designs = designs.filter(d => 
          d.title.toLowerCase().includes(search.toLowerCase()) ||
          d.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Sort by lastModified
      designs.sort((a, b) => new Date(b.lastModified) - new Date(a.lastModified));

      res.json(designs);
    }
  } catch (error) {
    console.error('Get designs error:', error);
    res.status(500).json({ error: 'Failed to get designs' });
  }
});

// Get single design
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    let design;
    
    if (mongoose.connection.readyState === 1) {
      design = await Design.findById(req.params.id)
        .populate('owner', 'name email avatar')
        .populate('collaborators.user', 'name email avatar')
        .populate('comments.userId', 'name email avatar')
        .populate('versions.createdBy', 'name email avatar');
    } else {
      // Use in-memory storage
      design = memoryDesigns.get(req.params.id);
    }

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    // Check if user has access (simplified for in-memory mode)
    if (mongoose.connection.readyState === 1) {
      const hasAccess = design.owner._id.toString() === req.userId ||
                       design.collaborators.some(c => c.user._id.toString() === req.userId) ||
                       design.isPublic;

      if (!hasAccess) {
        return res.status(403).json({ error: 'Access denied' });
      }
    } else {
      // For in-memory mode, just check owner
      if (design.owner !== req.userId) {
        return res.status(403).json({ error: 'Access denied' });
      }
    }

    res.json(design);
  } catch (error) {
    console.error('Get design error:', error);
    res.status(500).json({ error: 'Failed to get design' });
  }
});

// Create new design
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { title, description, category, templateId, dimensions, data } = req.body;

    if (mongoose.connection.readyState === 1) {
      const design = new Design({
        title: title || 'Untitled Design',
        description: description || '',
        category,
        templateId,
        owner: req.userId,
        dimensions: dimensions || { width: 1080, height: 1080 },
        data: data || {},
        lastModifiedBy: req.userId,
        versions: [{
          version: 1,
          data: data || {},
          createdBy: req.userId,
          description: 'Initial version'
        }]
      });

      await design.save();
      await design.populate('owner', 'name email avatar');

      res.status(201).json(design);
    } else {
      // Use in-memory storage
      const designId = new mongoose.Types.ObjectId().toString();
      const design = {
        _id: designId,
        title: title || 'Untitled Design',
        description: description || '',
        category: category || 'social-media',
        templateId,
        owner: req.userId,
        collaborators: [],
        dimensions: dimensions || { width: 1080, height: 1080 },
        data: data || {},
        thumbnail: '',
        status: 'draft',
        versions: [{
          version: 1,
          data: data || {},
          createdBy: req.userId,
          description: 'Initial version',
          createdAt: new Date().toISOString()
        }],
        comments: [],
        tags: [],
        isPublic: false,
        lastModified: new Date().toISOString(),
        lastModifiedBy: req.userId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      memoryDesigns.set(designId, design);
      res.status(201).json(design);
    }
  } catch (error) {
    console.error('Create design error:', error);
    res.status(500).json({ error: 'Failed to create design' });
  }
});

// Update design
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { title, description, data, thumbnail, status, tags } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const design = await Design.findById(req.params.id);
      if (!design) {
        return res.status(404).json({ error: 'Design not found' });
      }

      // Check if user has edit access
      const hasEditAccess = design.owner.toString() === req.userId ||
                           design.collaborators.some(c => 
                             c.user.toString() === req.userId && 
                             ['edit', 'admin'].includes(c.permission)
                           );

      if (!hasEditAccess) {
        return res.status(403).json({ error: 'Edit access denied' });
      }

      // Update fields
      if (title !== undefined) design.title = title;
      if (description !== undefined) design.description = description;
      if (data !== undefined) design.data = data;
      if (thumbnail !== undefined) design.thumbnail = thumbnail;
      if (status !== undefined) design.status = status;
      if (tags !== undefined) design.tags = tags;
      
      design.lastModifiedBy = req.userId;

      await design.save();
      await design.populate('owner', 'name email avatar');
      await design.populate('collaborators.user', 'name email avatar');

      res.json(design);
    } else {
      // Use in-memory storage
      const design = memoryDesigns.get(req.params.id);
      if (!design) {
        return res.status(404).json({ error: 'Design not found' });
      }

      if (design.owner !== req.userId) {
        return res.status(403).json({ error: 'Edit access denied' });
      }

      // Update fields
      if (title !== undefined) design.title = title;
      if (description !== undefined) design.description = description;
      if (data !== undefined) design.data = data;
      if (thumbnail !== undefined) design.thumbnail = thumbnail;
      if (status !== undefined) design.status = status;
      if (tags !== undefined) design.tags = tags;
      
      design.lastModified = new Date().toISOString();
      design.lastModifiedBy = req.userId;
      design.updatedAt = new Date().toISOString();

      memoryDesigns.set(req.params.id, design);
      res.json(design);
    }
  } catch (error) {
    console.error('Update design error:', error);
    res.status(500).json({ error: 'Failed to update design' });
  }
});

// Save design version
router.post('/:id/versions', authenticateToken, async (req, res) => {
  try {
    const { data, description, thumbnail } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const design = await Design.findById(req.params.id);
      if (!design) {
        return res.status(404).json({ error: 'Design not found' });
      }

      // Check edit access
      const hasEditAccess = design.owner.toString() === req.userId ||
                           design.collaborators.some(c => 
                             c.user.toString() === req.userId && 
                             ['edit', 'admin'].includes(c.permission)
                           );

      if (!hasEditAccess) {
        return res.status(403).json({ error: 'Edit access denied' });
      }

      const newVersion = {
        version: design.versions.length + 1,
        data,
        thumbnail,
        createdBy: req.userId,
        description: description || `Version ${design.versions.length + 1}`
      };

      design.versions.push(newVersion);
      design.data = data;
      design.lastModifiedBy = req.userId;

      await design.save();
      res.json(newVersion);
    } else {
      // Use in-memory storage
      const design = memoryDesigns.get(req.params.id);
      if (!design) {
        return res.status(404).json({ error: 'Design not found' });
      }

      if (design.owner !== req.userId) {
        return res.status(403).json({ error: 'Edit access denied' });
      }

      const newVersion = {
        version: design.versions.length + 1,
        data,
        thumbnail,
        createdBy: req.userId,
        description: description || `Version ${design.versions.length + 1}`,
        createdAt: new Date().toISOString()
      };

      design.versions.push(newVersion);
      design.data = data;
      design.lastModified = new Date().toISOString();
      design.lastModifiedBy = req.userId;

      memoryDesigns.set(req.params.id, design);
      res.json(newVersion);
    }
  } catch (error) {
    console.error('Save version error:', error);
    res.status(500).json({ error: 'Failed to save version' });
  }
});

// Add collaborator
router.post('/:id/collaborators', authenticateToken, async (req, res) => {
  try {
    const { email, permission } = req.body;
    
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Collaboration features require database connection' });
    }

    const design = await Design.findById(req.params.id);
    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    // Check if user is owner or admin
    const isOwnerOrAdmin = design.owner.toString() === req.userId ||
                          design.collaborators.some(c => 
                            c.user.toString() === req.userId && c.permission === 'admin'
                          );

    if (!isOwnerOrAdmin) {
      return res.status(403).json({ error: 'Admin access required' });
    }

    // Find user by email
    const User = (await import('../models/User.js')).default;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if already collaborator
    const existingCollaborator = design.collaborators.find(c => 
      c.user.toString() === user._id.toString()
    );

    if (existingCollaborator) {
      existingCollaborator.permission = permission;
    } else {
      design.collaborators.push({
        user: user._id,
        permission: permission || 'view'
      });
    }

    await design.save();
    await design.populate('collaborators.user', 'name email avatar');

    res.json(design.collaborators);
  } catch (error) {
    console.error('Add collaborator error:', error);
    res.status(500).json({ error: 'Failed to add collaborator' });
  }
});

// Delete design
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const design = await Design.findById(req.params.id);
      if (!design) {
        return res.status(404).json({ error: 'Design not found' });
      }

      // Only owner can delete
      if (design.owner.toString() !== req.userId) {
        return res.status(403).json({ error: 'Only owner can delete design' });
      }

      await Design.findByIdAndDelete(req.params.id);
    } else {
      // Use in-memory storage
      const design = memoryDesigns.get(req.params.id);
      if (!design) {
        return res.status(404).json({ error: 'Design not found' });
      }

      if (design.owner !== req.userId) {
        return res.status(403).json({ error: 'Only owner can delete design' });
      }

      memoryDesigns.delete(req.params.id);
    }

    res.json({ message: 'Design deleted successfully' });
  } catch (error) {
    console.error('Delete design error:', error);
    res.status(500).json({ error: 'Failed to delete design' });
  }
});

export default router;