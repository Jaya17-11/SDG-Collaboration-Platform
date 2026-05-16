import { useState, useEffect } from 'react';
import api from '../config/api';
import './Resources.css';

const Resources = () => {
  const [resources, setResources] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'request',
    title: '',
    description: '',
    projectId: '',
    resourceCategory: 'funding',
    quantity: '',
    unit: '',
    value: '',
    currency: 'USD',
    status: 'open'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [resourcesRes, projectsRes] = await Promise.all([
        api.get('/resources'),
        api.get('/projects')
      ]);
      setResources(resourcesRes.data);
      setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/resources', {
        ...formData,
        quantity: formData.quantity ? parseFloat(formData.quantity) : undefined,
        value: formData.value ? parseFloat(formData.value) : undefined
      });
      setShowForm(false);
      fetchData();
      setFormData({
        type: 'request',
        title: '',
        description: '',
        projectId: '',
        resourceCategory: 'funding',
        quantity: '',
        unit: '',
        value: '',
        currency: 'USD',
        status: 'open'
      });
    } catch (error) {
      console.error('Error creating resource:', error);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="resources-page">
      <div className="container">
        <div className="page-header">
          <h1>Resource Exchange</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Post Resource'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>Post Resource Request or Offer</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    required
                  >
                    <option value="request">Request</option>
                    <option value="offer">Offer</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select
                    value={formData.resourceCategory}
                    onChange={(e) => setFormData({...formData, resourceCategory: e.target.value})}
                    required
                  >
                    <option value="funding">Funding</option>
                    <option value="volunteers">Volunteers</option>
                    <option value="materials">Materials</option>
                    <option value="expertise">Expertise</option>
                    <option value="equipment">Equipment</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Title *</label>
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
              <div className="form-group">
                <label>Project *</label>
                <select
                  value={formData.projectId}
                  onChange={(e) => setFormData({...formData, projectId: e.target.value})}
                  required
                >
                  <option value="">Select Project</option>
                  {projects.map(project => (
                    <option key={project._id} value={project._id}>{project.title}</option>
                  ))}
                </select>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Quantity</label>
                  <input
                    type="number"
                    value={formData.quantity}
                    onChange={(e) => setFormData({...formData, quantity: e.target.value})}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Unit</label>
                  <input
                    type="text"
                    value={formData.unit}
                    onChange={(e) => setFormData({...formData, unit: e.target.value})}
                    placeholder="e.g., people, kg, hours"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Value</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => setFormData({...formData, value: e.target.value})}
                    min="0"
                  />
                </div>
                <div className="form-group">
                  <label>Currency</label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({...formData, currency: e.target.value})}
                  >
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                    <option value="INR">INR</option>
                  </select>
                </div>
              </div>
              <button type="submit" className="btn-primary">Post Resource</button>
            </form>
          </div>
        )}

        <div className="resources-grid">
          {resources.map(resource => (
            <div key={resource._id} className={`resource-card ${resource.type}`}>
              <div className="resource-header">
                <div>
                  <span className={`type-badge ${resource.type}`}>
                    {resource.type === 'request' ? '🔴 Request' : '🟢 Offer'}
                  </span>
                  <span className="category-badge">{resource.resourceCategory}</span>
                </div>
                <span className={`status-badge ${resource.status}`}>{resource.status}</span>
              </div>
              <h3>{resource.title}</h3>
              <p className="resource-project">Project: {resource.projectId?.title || 'N/A'}</p>
              <p className="resource-description">{resource.description}</p>
              {(resource.quantity || resource.value) && (
                <div className="resource-details">
                  {resource.quantity && (
                    <span>Quantity: {resource.quantity} {resource.unit || ''}</span>
                  )}
                  {resource.value && (
                    <span>Value: {resource.value} {resource.currency}</span>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Resources;

