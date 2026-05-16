import express from 'express';
import mongoose from 'mongoose';
import ProjectModel from '../models/ProjectModel.js';
import ContributionModel from '../models/ContributionModel.js';

const router = express.Router();

// Create project
router.post('/', async (req, res) => {
  try {
    const project = new ProjectModel({
      ...req.body,
      createdBy: req.body.createdBy || null
    });
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await ProjectModel.find()
      .populate('orgId', 'name')
      .populate('createdBy', 'username');
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get project by ID
router.get('/:id', async (req, res) => {
  try {
    const project = await ProjectModel.findById(req.params.id)
      .populate('orgId', 'name description')
      .populate('createdBy', 'username email');
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get contributions by project ID
router.get('/:id/contributions', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid project ID' });
    }
    const contributions = await ContributionModel.find({ projectId: req.params.id })
      .populate('resourceId', 'title type')
      .populate('contributedBy', 'username');
    res.json(contributions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

