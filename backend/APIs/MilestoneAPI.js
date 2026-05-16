import express from 'express';
import MilestoneModel from '../models/MilestoneModel.js';

const router = express.Router();

// Create milestone
router.post('/', async (req, res) => {
  try {
    const milestone = new MilestoneModel({
      ...req.body,
      createdBy: req.body.createdBy || null
    });
    await milestone.save();
    res.status(201).json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get milestones by project ID
router.get('/project/:id', async (req, res) => {
  try {
    const milestones = await MilestoneModel.find({ projectId: req.params.id })
      .populate('createdBy', 'username')
      .sort({ targetDate: 1 });
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update milestone
router.put('/:id', async (req, res) => {
  try {
    const milestone = await MilestoneModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.json(milestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete milestone
router.delete('/:id', async (req, res) => {
  try {
    const milestone = await MilestoneModel.findByIdAndDelete(req.params.id);
    if (!milestone) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

