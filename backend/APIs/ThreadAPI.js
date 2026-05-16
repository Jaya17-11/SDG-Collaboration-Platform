import express from 'express';
import mongoose from 'mongoose';
import ThreadModel from '../models/ThreadModel.js';
import MessageModel from '../models/MessageModel.js';

const router = express.Router();

// Create thread
router.post('/', async (req, res) => {
  try {
    const thread = new ThreadModel({
      ...req.body,
      createdBy: req.body.createdBy || null
    });
    await thread.save();
    res.status(201).json(thread);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create message in thread
router.post('/:id/messages', async (req, res) => {
  try {
    const message = new MessageModel({
      threadId: req.params.id,
      sentBy: req.body.sentBy || null,
      content: req.body.content
    });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get messages in thread
router.get('/:id/messages', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: 'Invalid thread ID' });
    }
    const messages = await MessageModel.find({ threadId: req.params.id })
      .populate('sentBy', 'username')
      .sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

