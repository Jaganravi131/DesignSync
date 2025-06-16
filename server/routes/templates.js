import express from 'express';
import mongoose from 'mongoose';
import Template from '../models/Template.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Helper function to check database connection
const isDatabaseConnected = () => {
  return mongoose.connection.readyState === 1;
};

// Get all templates
router.get('/', async (req, res) => {
  try {
    // Check database connection first
    if (!isDatabaseConnected()) {
      return res.json([]);
    }

    const { category, subcategory, search, premium } = req.query;
    let query = { isActive: true };

    if (category) query.category = category;
    if (subcategory) query.subcategory = subcategory;
    if (premium !== undefined) query.isPremium = premium === 'true';
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const templates = await Template.find(query)
      .populate('createdBy', 'name email')
      .sort({ usageCount: -1, createdAt: -1 })
      .limit(100);

    res.json(templates);
  } catch (error) {
    console.error('Get templates error:', error);
    res.status(500).json({ error: 'Failed to get templates' });
  }
});

// Get single template
router.get('/:id', async (req, res) => {
  try {
    // Check database connection first
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database not connected, feature unavailable' });
    }

    const template = await Template.findById(req.params.id)
      .populate('createdBy', 'name email avatar');

    if (!template || !template.isActive) {
      return res.status(404).json({ error: 'Template not found' });
    }

    // Increment usage count
    template.usageCount += 1;
    await template.save();

    res.json(template);
  } catch (error) {
    console.error('Get template error:', error);
    res.status(500).json({ error: 'Failed to get template' });
  }
});

// Create template (admin only)
router.post('/', authenticateToken, async (req, res) => {
  try {
    // Check database connection first
    if (!isDatabaseConnected()) {
      return res.status(503).json({ error: 'Database not connected, feature unavailable' });
    }

    const {
      name,
      description,
      category,
      subcategory,
      dimensions,
      data,
      thumbnail,
      preview,
      tags,
      isPremium
    } = req.body;

    const template = new Template({
      name,
      description,
      category,
      subcategory,
      dimensions,
      data,
      thumbnail,
      preview,
      tags: tags || [],
      isPremium: isPremium || false,
      createdBy: req.userId
    });

    await template.save();
    res.status(201).json(template);
  } catch (error) {
    console.error('Create template error:', error);
    res.status(500).json({ error: 'Failed to create template' });
  }
});

// Get template categories
router.get('/categories/list', async (req, res) => {
  try {
    // Check database connection first
    if (!isDatabaseConnected()) {
      return res.json([]);
    }

    const categories = await Template.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: {
            category: '$category',
            subcategory: '$subcategory'
          },
          count: { $sum: 1 },
          templates: { $push: { _id: '$_id', name: '$name', thumbnail: '$thumbnail' } }
        }
      },
      {
        $group: {
          _id: '$_id.category',
          subcategories: {
            $push: {
              name: '$_id.subcategory',
              count: '$count',
              templates: { $slice: ['$templates', 3] }
            }
          },
          totalCount: { $sum: '$count' }
        }
      },
      { $sort: { totalCount: -1 } }
    ]);

    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ error: 'Failed to get categories' });
  }
});

export default router;