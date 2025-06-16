import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['social-media', 'business', 'marketing', 'personal'],
    required: true
  },
  subcategory: {
    type: String,
    required: true
  },
  dimensions: {
    width: {
      type: Number,
      required: true
    },
    height: {
      type: Number,
      required: true
    }
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  preview: {
    type: String,
    required: true
  },
  tags: [String],
  isPremium: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  usageCount: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Add indexes for better query performance
templateSchema.index({ isActive: 1, category: 1, isPremium: 1 });
templateSchema.index({ usageCount: -1 });
templateSchema.index({ rating: -1 });
templateSchema.index({ createdAt: -1 });
templateSchema.index({ category: 1, subcategory: 1 });
templateSchema.index({ name: 'text', description: 'text', tags: 'text' });

export default mongoose.model('Template', templateSchema);