import express from 'express';
import OrgModel from '../models/OrgModel.js';
import UserModel from '../models/UserModel.js';

const router = express.Router();

// Create organization
router.post('/', async (req, res) => {
  try {
    const org = new OrgModel({
      ...req.body,
      createdBy: req.body.createdBy || null
    });
    await org.save();
    res.status(201).json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all organizations
router.get('/', async (req, res) => {
  try {
    const orgs = await OrgModel.find().populate('createdBy', 'username email');
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get organization by ID
router.get('/:id', async (req, res) => {
  try {
    const org = await OrgModel.findById(req.params.id).populate('createdBy', 'username email');
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get pending organizations
router.get('/pending', async (req, res) => {
  try {
    const orgs = await OrgModel.find({ status: 'pending' }).populate('createdBy', 'username email');
    res.json(orgs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Approve organization
router.post('/:id/approve', async (req, res) => {
  try {
    const org = await OrgModel.findByIdAndUpdate(
      req.params.id,
      { status: 'approved' },
      { new: true }
    );
    if (!org) {
      return res.status(404).json({ message: 'Organization not found' });
    }
    res.json(org);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

