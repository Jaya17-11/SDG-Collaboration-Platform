import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import api from '../config/api';
import './AdminDashboard.css';

const COLORS = ['#667eea', '#764ba2', '#f093fb', '#4facfe', '#00f2fe'];

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [orgTypes, setOrgTypes] = useState(null);
  const [resourceStats, setResourceStats] = useState(null);
  const [gaps, setGaps] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [overview, types, resources, gapsData, opps] = await Promise.all([
        api.get('/analytics/sdg-overview'),
        api.get('/analytics/org-types'),
        api.get('/analytics/resources'),
        api.get('/analytics/collaboration-gaps'),
        api.get('/analytics/partnership-opportunities')
      ]);
      setAnalytics(overview.data);
      setOrgTypes(types.data);
      setResourceStats(resources.data);
      setGaps(gapsData.data);
      setOpportunities(opps.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading analytics...</div>;

  const sdgData = analytics?.sdgDistribution ? 
    Object.entries(analytics.sdgDistribution).map(([sdg, count]) => ({
      name: `SDG ${sdg}`,
      value: count
    })) : [];

  const orgTypeData = orgTypes ? 
    Object.entries(orgTypes).map(([type, count]) => ({
      name: type,
      value: count
    })) : [];

  return (
    <div className="admin-dashboard">
      <div className="container">
        <h1>Admin Analytics Dashboard</h1>

        <div className="stats-overview">
          <div className="stat-card">
            <h3>Total Organizations</h3>
            <p className="stat-number">{analytics?.totalOrganizations || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Total Projects</h3>
            <p className="stat-number">{analytics?.totalProjects || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Active Projects</h3>
            <p className="stat-number">{analytics?.activeProjects || 0}</p>
          </div>
          <div className="stat-card">
            <h3>Active Partnerships</h3>
            <p className="stat-number">{analytics?.activePartnerships || 0}</p>
          </div>
        </div>

        <div className="charts-grid">
          <div className="chart-card">
            <h2>SDG Distribution</h2>
            <BarChart width={600} height={300} data={sdgData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#667eea" />
            </BarChart>
          </div>

          <div className="chart-card">
            <h2>Organization Types</h2>
            <PieChart width={400} height={300}>
              <Pie
                data={orgTypeData}
                cx={200}
                cy={150}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {orgTypeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>

        {resourceStats && (
          <div className="resource-stats">
            <h2>Resource Exchange Statistics</h2>
            <div className="resource-cards">
              <div className="resource-stat-card">
                <h3>Requests</h3>
                <p>{resourceStats.requests}</p>
              </div>
              <div className="resource-stat-card">
                <h3>Offers</h3>
                <p>{resourceStats.offers}</p>
              </div>
              <div className="resource-stat-card">
                <h3>Fulfilled</h3>
                <p>{resourceStats.fulfilled}</p>
              </div>
            </div>
          </div>
        )}

        {gaps && gaps.gaps.length > 0 && (
          <div className="gaps-section">
            <h2>Collaboration Gaps</h2>
            <p>SDGs with below-average project activity:</p>
            <div className="gaps-list">
              {gaps.gaps.map(gap => (
                <div key={gap.sdg} className="gap-item">
                  <span className="gap-sdg">SDG {gap.sdg}</span>
                  <span className="gap-count">{gap.projectCount} projects</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {opportunities.length > 0 && (
          <div className="opportunities-section">
            <h2>High-Impact Partnership Opportunities</h2>
            <div className="opportunities-list">
              {opportunities.slice(0, 10).map((opp, index) => (
                <div key={index} className="opportunity-card">
                  <div className="opp-orgs">
                    <span>{opp.org1.name}</span>
                    <span>↔</span>
                    <span>{opp.org2.name}</span>
                  </div>
                  <div className="opp-sdgs">
                    Common SDGs: {opp.commonSDGs.join(', ')}
                  </div>
                  <div className="opp-impact">
                    Potential Impact: {opp.potentialImpact} SDGs
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;

