import express from 'express';
import ResourceModel from '../models/ResourceModel.js';

const router = express.Router();

// Create resource
router.post('/', async (req, res) => {
  try {
    const resource = new ResourceModel({
      ...req.body,
      createdBy: req.body.createdBy || null
    });
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all resources
router.get('/', async (req, res) => {
  try {
    const resources = await ResourceModel.find()
      .populate('projectId', 'title')
      .populate('createdBy', 'username');
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

