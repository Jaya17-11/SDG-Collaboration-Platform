import express from 'express';
import PartnershipModel from '../models/PartnershipModel.js';

const router = express.Router();

// Create partnership
router.post('/', async (req, res) => {
  try {
    const partnership = new PartnershipModel(req.body);
    await partnership.save();
    res.status(201).json(partnership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all partnerships
router.get('/', async (req, res) => {
  try {
    const partnerships = await PartnershipModel.find()
      .populate('org1Id', 'name organizationType')
      .populate('org2Id', 'name organizationType')
      .populate('projectId', 'title');
    res.json(partnerships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get partnerships by organization ID
router.get('/org/:id', async (req, res) => {
  try {
    const partnerships = await PartnershipModel.find({
      $or: [{ org1Id: req.params.id }, { org2Id: req.params.id }]
    })
      .populate('org1Id', 'name organizationType')
      .populate('org2Id', 'name organizationType')
      .populate('projectId', 'title');
    res.json(partnerships);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update partnership
router.put('/:id', async (req, res) => {
  try {
    const partnership = await PartnershipModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!partnership) {
      return res.status(404).json({ message: 'Partnership not found' });
    }
    res.json(partnership);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

