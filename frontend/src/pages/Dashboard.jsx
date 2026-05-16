import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import './Dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    myProjects: 0,
    myResources: 0,
    myContributions: 0,
    partnerships: 0
  });
  const [projects, setProjects] = useState([]);
  const [resources, setResources] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [projectsRes, resourcesRes] = await Promise.all([
        api.get('/projects'),
        api.get('/resources')
      ]);
      setProjects(projectsRes.data.slice(0, 5));
      setResources(resourcesRes.data.slice(0, 5));
      setStats({
        myProjects: projectsRes.data.length,
        myResources: resourcesRes.data.length,
        myContributions: 0,
        partnerships: 0
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <div className="dashboard-page">
      <div className="container">
        <h1>Dashboard</h1>
        
        <div className="stats-grid">
          <div className="stat-card">
            <h3>My Projects</h3>
            <p className="stat-number">{stats.myProjects}</p>
          </div>
          <div className="stat-card">
            <h3>My Resources</h3>
            <p className="stat-number">{stats.myResources}</p>
          </div>
          <div className="stat-card">
            <h3>Contributions</h3>
            <p className="stat-number">{stats.myContributions}</p>
          </div>
          <div className="stat-card">
            <h3>Partnerships</h3>
            <p className="stat-number">{stats.partnerships}</p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Projects</h2>
              <Link to="/projects" className="view-all">View All</Link>
            </div>
            <div className="items-list">
              {projects.map(project => (
                <Link key={project._id} to={`/projects/${project._id}`} className="item-card">
                  <h4>{project.title}</h4>
                  <p>{project.description?.substring(0, 100)}...</p>
                  <div className="item-meta">
                    <span className={`status-badge ${project.status}`}>{project.status}</span>
                    {project.progress !== undefined && (
                      <span>Progress: {project.progress}%</span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="section-header">
              <h2>Recent Resources</h2>
              <Link to="/resources" className="view-all">View All</Link>
            </div>
            <div className="items-list">
              {resources.map(resource => (
                <div key={resource._id} className="item-card">
                  <div className="resource-header-small">
                    <span className={`type-badge ${resource.type}`}>
                      {resource.type}
                    </span>
                    <span className="category-badge">{resource.resourceCategory}</span>
                  </div>
                  <h4>{resource.title}</h4>
                  <p>{resource.description?.substring(0, 100)}...</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

