import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../config/api';
import './ProjectDetail.css';

const ProjectDetail = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [milestones, setMilestones] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  const fetchProjectData = async () => {
    try {
      const [projectRes, milestonesRes, contributionsRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/milestones/project/${id}`),
        api.get(`/projects/${id}/contributions`)
      ]);
      setProject(projectRes.data);
      setMilestones(milestonesRes.data);
      setContributions(contributionsRes.data);
    } catch (error) {
      console.error('Error fetching project data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!project) return <div>Project not found</div>;

  return (
    <div className="project-detail-page">
      <div className="container">
        <Link to="/projects" className="back-link">← Back to Projects</Link>
        
        <div className="project-header">
          <div>
            <h1>{project.title}</h1>
            <p className="project-org">Organization: {project.orgId?.name || 'N/A'}</p>
          </div>
          <span className={`status-badge ${project.status}`}>{project.status}</span>
        </div>

        <div className="project-info">
          <div className="info-card">
            <h3>Description</h3>
            <p>{project.description}</p>
          </div>

          <div className="info-card">
            <h3>SDG Goals</h3>
            <div className="sdg-tags">
              {project.sdgGoals?.map(sdg => (
                <span key={sdg} className="sdg-tag">SDG {sdg}</span>
              ))}
            </div>
          </div>

          {project.progress !== undefined && (
            <div className="info-card">
              <h3>Progress</h3>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${project.progress}%` }}>
                  {project.progress}%
                </div>
              </div>
            </div>
          )}

          <div className="info-grid">
            {project.startDate && (
              <div className="info-item">
                <strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}
              </div>
            )}
            {project.endDate && (
              <div className="info-item">
                <strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}
              </div>
            )}
            {project.budget && (
              <div className="info-item">
                <strong>Budget:</strong> ${project.budget.toLocaleString()}
              </div>
            )}
            {project.location && (
              <div className="info-item">
                <strong>Location:</strong> {project.location}
              </div>
            )}
          </div>
        </div>

        <div className="project-sections">
          <div className="section">
            <h2>Milestones</h2>
            <div className="milestones-list">
              {milestones.map(milestone => (
                <div key={milestone._id} className="milestone-card">
                  <div className="milestone-header">
                    <h4>{milestone.title}</h4>
                    <span className={`milestone-status ${milestone.status}`}>
                      {milestone.status}
                    </span>
                  </div>
                  <p>{milestone.description}</p>
                  <div className="milestone-dates">
                    <span>Target: {new Date(milestone.targetDate).toLocaleDateString()}</span>
                    {milestone.completedDate && (
                      <span>Completed: {new Date(milestone.completedDate).toLocaleDateString()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="section">
            <h2>Contributions</h2>
            <div className="contributions-list">
              {contributions.map(contribution => (
                <div key={contribution._id} className="contribution-card">
                  <h4>{contribution.resourceId?.title || 'Resource'}</h4>
                  <p>{contribution.description}</p>
                  <div className="contribution-meta">
                    <span>By: {contribution.contributedBy?.username || 'Anonymous'}</span>
                    <span className={`status-badge ${contribution.status}`}>
                      {contribution.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;

