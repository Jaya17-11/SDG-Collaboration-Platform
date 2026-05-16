import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  orgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Org',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  sdgGoals: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return v.every(sdg => sdg >= 1 && sdg <= 17);
      },
      message: 'SDG goals must be numbers between 1 and 17'
    }
  },
  startDate: {
    type: Date
  },
  endDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['upcoming', 'active', 'completed', 'archived'],
    default: 'upcoming'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  budget: {
    type: Number,
    min: 0
  },
  location: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

export default mongoose.model('Project', projectSchema);

