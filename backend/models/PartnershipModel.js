import mongoose from 'mongoose';

const partnershipSchema = new mongoose.Schema({
  org1Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  org2Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  },
  partnershipType: {
    type: String,
    enum: ['resource-sharing', 'collaboration', 'funding', 'volunteer-exchange', 'expertise-sharing'],
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed', 'cancelled'],
    default: 'pending'
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  }
}, {
  timestamps: true
});

export default mongoose.model('Partnership', partnershipSchema);

