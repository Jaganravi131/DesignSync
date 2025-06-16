import express from 'express';
import Design from '../models/Design.js';
import User from '../models/User.js';
import { authenticateToken } from './auth.js';

const router = express.Router();

// Get collaboration activity
router.get('/activity/:designId', authenticateToken, async (req, res) => {
  try {
    const design = await Design.findById(req.params.designId)
      .populate('versions.createdBy', 'name email avatar')
      .populate('comments.userId', 'name email avatar');

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    // Check access
    const hasAccess = design.owner.toString() === req.userId ||
                     design.collaborators.some(c => c.user.toString() === req.userId) ||
                     design.isPublic;

    if (!hasAccess) {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Combine versions and comments into activity feed
    const activity = [];

    // Add versions
    design.versions.forEach(version => {
      activity.push({
        type: 'version',
        id: version._id,
        user: version.createdBy,
        description: version.description,
        timestamp: version.createdAt,
        data: {
          version: version.version,
          thumbnail: version.thumbnail
        }
      });
    });

    // Add comments
    design.comments.forEach(comment => {
      activity.push({
        type: 'comment',
        id: comment._id,
        user: comment.userId,
        description: comment.text,
        timestamp: comment.createdAt,
        data: {
          position: comment.position,
          resolved: comment.resolved
        }
      });
    });

    // Sort by timestamp
    activity.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json(activity.slice(0, 50)); // Limit to 50 recent activities
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to get activity' });
  }
});

// Invite user to design
router.post('/invite', authenticateToken, async (req, res) => {
  try {
    const { designId, email, permission, message } = req.body;

    const design = await Design.findById(designId);
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

    // Find or create user
    let user = await User.findOne({ email });
    if (!user) {
      // Create placeholder user (they'll complete registration when they accept)
      user = new User({
        email,
        name: email.split('@')[0],
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(email)}&background=6366f1&color=fff`
      });
      await user.save();
    }

    // Add as collaborator
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

    // TODO: Send invitation email
    console.log(`Invitation sent to ${email} for design ${design.title}`);

    res.json({ message: 'Invitation sent successfully' });
  } catch (error) {
    console.error('Invite error:', error);
    res.status(500).json({ error: 'Failed to send invitation' });
  }
});

// Remove collaborator
router.delete('/collaborator/:designId/:userId', authenticateToken, async (req, res) => {
  try {
    const { designId, userId } = req.params;

    const design = await Design.findById(designId);
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

    // Remove collaborator
    design.collaborators = design.collaborators.filter(c => 
      c.user.toString() !== userId
    );

    await design.save();
    res.json({ message: 'Collaborator removed successfully' });
  } catch (error) {
    console.error('Remove collaborator error:', error);
    res.status(500).json({ error: 'Failed to remove collaborator' });
  }
});

export default router;