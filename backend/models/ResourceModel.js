import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['request', 'offer'],
    required: true
  },
  resourceCategory: {
    type: String,
    enum: ['funding', 'volunteers', 'materials', 'expertise', 'equipment', 'other'],
    required: true
  },
  quantity: {
    type: Number,
    min: 0
  },
  unit: {
    type: String,
    trim: true
  },
  value: {
    type: Number,
    min: 0
  },
  currency: {
    type: String,
    default: 'USD'
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['open', 'fulfilled', 'closed'],
    default: 'open'
  }
}, {
  timestamps: true
});

export default mongoose.model('Resource', resourceSchema);

