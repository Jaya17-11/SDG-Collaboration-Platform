import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../config/api';
import './Projects.css';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    orgId: '',
    sdgGoals: [],
    startDate: '',
    endDate: '',
    status: 'upcoming',
    budget: '',
    location: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, orgsRes] = await Promise.all([
        api.get('/projects'),
        api.get('/orgs')
      ]);
      setProjects(projectsRes.data);
      setOrgs(orgsRes.data.filter(org => org.status === 'approved'));
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/projects', {
        ...formData,
        budget: formData.budget ? parseFloat(formData.budget) : undefined
      });
      setShowForm(false);
      fetchData();
      setFormData({
        title: '',
        description: '',
        orgId: '',
        sdgGoals: [],
        startDate: '',
        endDate: '',
        status: 'upcoming',
        budget: '',
        location: ''
      });
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const toggleSDG = (sdg) => {
    setFormData({
      ...formData,
      sdgGoals: formData.sdgGoals.includes(sdg)
        ? formData.sdgGoals.filter(s => s !== sdg)
        : [...formData.sdgGoals, sdg]
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="projects-page">
      <div className="container">
        <div className="page-header">
          <h1>SDG Projects</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Create Project'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>Create New Project</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Project Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="4"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Organization *</label>
                  <select
                    value={formData.orgId}
                    onChange={(e) => setFormData({...formData, orgId: e.target.value})}
                    required
                  >
                    <option value="">Select Organization</option>
                    {orgs.map(org => (
                      <option key={org._id} value={org._id}>{org.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="upcoming">Upcoming</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>SDG Goals * (Select at least one)</label>
                <div className="sdg-selector">
                  {Array.from({ length: 17 }, (_, i) => i + 1).map(sdg => (
                    <button
                      key={sdg}
                      type="button"
                      className={`sdg-btn ${formData.sdgGoals.includes(sdg) ? 'selected' : ''}`}
                      onClick={() => toggleSDG(sdg)}
                    >
                      {sdg}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Start Date</label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>End Date</label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Budget</label>
                  <input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => setFormData({...formData, budget: e.target.value})}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>
              <button type="submit" className="btn-primary">Create Project</button>
            </form>
          </div>
        )}

        <div className="projects-grid">
          {projects.map(project => (
            <Link key={project._id} to={`/projects/${project._id}`} className="project-card">
              <div className="project-header">
                <h3>{project.title}</h3>
                <span className={`status-badge ${project.status}`}>{project.status}</span>
              </div>
              <p className="project-org">{project.orgId?.name || 'Organization'}</p>
              <p className="project-description">{project.description}</p>
              <div className="project-sdgs">
                <div className="sdg-tags">
                  {project.sdgGoals?.map(sdg => (
                    <span key={sdg} className="sdg-tag">SDG {sdg}</span>
                  ))}
                </div>
              </div>
              {project.progress !== undefined && (
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${project.progress}%` }}>
                    {project.progress}%
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Projects;

