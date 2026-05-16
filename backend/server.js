import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables
dotenv.config();

// Import API routes
import AuthAPI from './APIs/AuthAPI.js';
import OrgAPI from './APIs/OrgAPI.js';
import ProjectAPI from './APIs/ProjectAPI.js';
import ResourceAPI from './APIs/ResourceAPI.js';
import ContributionAPI from './APIs/ContributionAPI.js';
import ThreadAPI from './APIs/ThreadAPI.js';
import MilestoneAPI from './APIs/MilestoneAPI.js';
import PartnershipAPI from './APIs/PartnershipAPI.js';
import AnalyticsAPI from './APIs/AnalyticsAPI.js';

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  serverSelectionTimeoutMS: 5000
})
  .then(() => console.log('MongoDB connected'))
  .catch((error) => {
    console.error('MongoDB connection error:', error.message);
    console.log('Server will continue but database operations may fail');
  });

// Routes
app.use('/api/auth', AuthAPI);
app.use('/api/orgs', OrgAPI);
app.use('/api/projects', ProjectAPI);
app.use('/api/resources', ResourceAPI);
app.use('/api/contributions', ContributionAPI);
app.use('/api/threads', ThreadAPI);
app.use('/api/milestones', MilestoneAPI);
app.use('/api/partnerships', PartnershipAPI);
app.use('/api/analytics', AnalyticsAPI);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Pact API is running' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

