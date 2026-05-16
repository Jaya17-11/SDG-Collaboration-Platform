import express from 'express';
import ContributionModel from '../models/ContributionModel.js';

const router = express.Router();

// Create contribution
router.post('/', async (req, res) => {
  try {
    const contribution = new ContributionModel({
      ...req.body,
      contributedBy: req.body.contributedBy || null
    });
    await contribution.save();
    res.status(201).json(contribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

