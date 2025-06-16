import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  id: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  position: {
    x: Number,
    y: Number
  },
  resolved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const versionSchema = new mongoose.Schema({
  version: {
    type: Number,
    required: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  thumbnail: String,
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: String
}, {
  timestamps: true
});

const designSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'Untitled Design'
  },
  description: {
    type: String,
    default: ''
  },
  category: {
    type: String,
    enum: ['social-media', 'business', 'marketing', 'personal'],
    required: true
  },
  templateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Template'
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permission: {
      type: String,
      enum: ['view', 'edit', 'admin'],
      default: 'view'
    },
    invitedAt: {
      type: Date,
      default: Date.now
    }
  }],
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  dimensions: {
    width: {
      type: Number,
      default: 1080
    },
    height: {
      type: Number,
      default: 1080
    }
  },
  thumbnail: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  versions: [versionSchema],
  comments: [commentSchema],
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  lastModified: {
    type: Date,
    default: Date.now
  },
  lastModifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Update lastModified on save
designSchema.pre('save', function(next) {
  this.lastModified = new Date();
  next();
});

export default mongoose.model('Design', designSchema);