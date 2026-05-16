import express from 'express';
import OrgModel from '../models/OrgModel.js';
import ProjectModel from '../models/ProjectModel.js';
import ResourceModel from '../models/ResourceModel.js';
import ContributionModel from '../models/ContributionModel.js';
import PartnershipModel from '../models/PartnershipModel.js';

const router = express.Router();

// Get overall SDG analytics
router.get('/sdg-overview', async (req, res) => {
  try {
    const projects = await ProjectModel.find();
    const sdgCounts = {};
    
    // Count projects by SDG goal
    projects.forEach(project => {
      project.sdgGoals.forEach(sdg => {
        sdgCounts[sdg] = (sdgCounts[sdg] || 0) + 1;
      });
    });

    // Get total stats
    const totalOrgs = await OrgModel.countDocuments({ status: 'approved' });
    const totalProjects = await ProjectModel.countDocuments();
    const activeProjects = await ProjectModel.countDocuments({ status: 'active' });
    const totalResources = await ResourceModel.countDocuments();
    const totalPartnerships = await PartnershipModel.countDocuments({ status: 'active' });

    res.json({
      sdgDistribution: sdgCounts,
      totalOrganizations: totalOrgs,
      totalProjects,
      activeProjects,
      totalResources,
      activePartnerships: totalPartnerships
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get organization type distribution
router.get('/org-types', async (req, res) => {
  try {
    const orgs = await OrgModel.find({ status: 'approved' });
    const typeCounts = {};
    
    orgs.forEach(org => {
      typeCounts[org.organizationType] = (typeCounts[org.organizationType] || 0) + 1;
    });

    res.json(typeCounts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get resource exchange analytics
router.get('/resources', async (req, res) => {
  try {
    const requests = await ResourceModel.countDocuments({ type: 'request' });
    const offers = await ResourceModel.countDocuments({ type: 'offer' });
    const fulfilled = await ResourceModel.countDocuments({ status: 'fulfilled' });
    
    const byCategory = {};
    const resources = await ResourceModel.find();
    resources.forEach(resource => {
      byCategory[resource.resourceCategory] = (byCategory[resource.resourceCategory] || 0) + 1;
    });

    res.json({
      requests,
      offers,
      fulfilled,
      byCategory
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get collaboration gaps (SDGs with few projects)
router.get('/collaboration-gaps', async (req, res) => {
  try {
    const projects = await ProjectModel.find();
    const sdgCounts = {};
    
    for (let i = 1; i <= 17; i++) {
      sdgCounts[i] = 0;
    }
    
    projects.forEach(project => {
      project.sdgGoals.forEach(sdg => {
        sdgCounts[sdg] = (sdgCounts[sdg] || 0) + 1;
      });
    });

    // Find SDGs with less than average projects
    const avgProjects = projects.length / 17;
    const gaps = Object.entries(sdgCounts)
      .filter(([sdg, count]) => count < avgProjects)
      .map(([sdg, count]) => ({ sdg: parseInt(sdg), projectCount: count }))
      .sort((a, b) => a.projectCount - b.projectCount);

    res.json({ gaps, averageProjects: avgProjects });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get high-impact partnership opportunities
router.get('/partnership-opportunities', async (req, res) => {
  try {
    const orgs = await OrgModel.find({ status: 'approved' }).populate('sdgFocusAreas');
    const opportunities = [];

    for (let i = 0; i < orgs.length; i++) {
      for (let j = i + 1; j < orgs.length; j++) {
        const org1 = orgs[i];
        const org2 = orgs[j];
        
        // Find common SDG focus areas
        const commonSDGs = org1.sdgFocusAreas.filter(sdg => 
          org2.sdgFocusAreas.includes(sdg)
        );

        if (commonSDGs.length > 0) {
          // Check if partnership already exists
          const existingPartnership = await PartnershipModel.findOne({
            $or: [
              { org1Id: org1._id, org2Id: org2._id },
              { org1Id: org2._id, org2Id: org1._id }
            ]
          });

          if (!existingPartnership) {
            opportunities.push({
              org1: { id: org1._id, name: org1.name, type: org1.organizationType },
              org2: { id: org2._id, name: org2.name, type: org2.organizationType },
              commonSDGs,
              potentialImpact: commonSDGs.length
            });
          }
        }
      }
    }

    // Sort by potential impact
    opportunities.sort((a, b) => b.potentialImpact - a.potentialImpact);

    res.json(opportunities.slice(0, 20)); // Top 20 opportunities
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;

