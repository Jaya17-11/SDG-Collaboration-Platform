import mongoose from 'mongoose';

const orgSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  organizationType: {
    type: String,
    enum: ['NGO', 'Educational Institution', 'Government Department', 'Private Contributor', 'Other'],
    required: true
  },
  sdgFocusAreas: {
    type: [Number],
    required: true,
    validate: {
      validator: function(v) {
        return v.every(sdg => sdg >= 1 && sdg <= 17);
      },
      message: 'SDG focus areas must be numbers between 1 and 17'
    }
  },
  website: {
    type: String,
    trim: true
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  location: {
    type: String,
    trim: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

export default mongoose.model('Org', orgSchema);

