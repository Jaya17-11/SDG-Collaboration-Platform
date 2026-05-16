import { useState, useEffect } from 'react';
import api from '../config/api';
import './Organizations.css';

const Organizations = () => {
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    organizationType: 'NGO',
    sdgFocusAreas: [],
    website: '',
    contactEmail: '',
    location: ''
  });

  useEffect(() => {
    fetchOrgs();
  }, []);

  const fetchOrgs = async () => {
    try {
      const response = await api.get('/orgs');
      setOrgs(response.data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/orgs', formData);
      setShowForm(false);
      fetchOrgs();
      setFormData({
        name: '',
        description: '',
        organizationType: 'NGO',
        sdgFocusAreas: [],
        website: '',
        contactEmail: '',
        location: ''
      });
    } catch (error) {
      console.error('Error creating organization:', error);
    }
  };

  const toggleSDG = (sdg) => {
    setFormData({
      ...formData,
      sdgFocusAreas: formData.sdgFocusAreas.includes(sdg)
        ? formData.sdgFocusAreas.filter(s => s !== sdg)
        : [...formData.sdgFocusAreas, sdg]
    });
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="organizations-page">
      <div className="container">
        <div className="page-header">
          <h1>Organizations</h1>
          <button onClick={() => setShowForm(!showForm)} className="btn-primary">
            {showForm ? 'Cancel' : 'Register Organization'}
          </button>
        </div>

        {showForm && (
          <div className="form-card">
            <h2>Register New Organization</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Organization Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Organization Type *</label>
                  <select
                    value={formData.organizationType}
                    onChange={(e) => setFormData({...formData, organizationType: e.target.value})}
                    required
                  >
                    <option value="NGO">NGO</option>
                    <option value="Educational Institution">Educational Institution</option>
                    <option value="Government Department">Government Department</option>
                    <option value="Private Contributor">Private Contributor</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  rows="3"
                />
              </div>
              <div className="form-group">
                <label>SDG Focus Areas * (Select at least one)</label>
                <div className="sdg-selector">
                  {Array.from({ length: 17 }, (_, i) => i + 1).map(sdg => (
                    <button
                      key={sdg}
                      type="button"
                      className={`sdg-btn ${formData.sdgFocusAreas.includes(sdg) ? 'selected' : ''}`}
                      onClick={() => toggleSDG(sdg)}
                    >
                      {sdg}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Website</label>
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) => setFormData({...formData, website: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Contact Email</label>
                  <input
                    type="email"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({...formData, contactEmail: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
              <button type="submit" className="btn-primary">Submit</button>
            </form>
          </div>
        )}

        <div className="orgs-grid">
          {orgs.map(org => (
            <div key={org._id} className="org-card">
              <div className="org-header">
                <h3>{org.name}</h3>
                <span className={`status-badge ${org.status}`}>{org.status}</span>
              </div>
              <p className="org-type">{org.organizationType}</p>
              <p className="org-description">{org.description}</p>
              <div className="org-sdgs">
                <strong>SDG Focus:</strong>
                <div className="sdg-tags">
                  {org.sdgFocusAreas?.map(sdg => (
                    <span key={sdg} className="sdg-tag">SDG {sdg}</span>
                  ))}
                </div>
              </div>
              {org.location && <p className="org-location">📍 {org.location}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Organizations;

