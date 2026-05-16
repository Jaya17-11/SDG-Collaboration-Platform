import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const sdgGoals = [
    { num: 1, name: 'No Poverty' },
    { num: 2, name: 'Zero Hunger' },
    { num: 3, name: 'Good Health' },
    { num: 4, name: 'Quality Education' },
    { num: 5, name: 'Gender Equality' },
    { num: 6, name: 'Clean Water' },
    { num: 7, name: 'Affordable Energy' },
    { num: 8, name: 'Decent Work' },
    { num: 9, name: 'Industry Innovation' },
    { num: 10, name: 'Reduced Inequalities' },
    { num: 11, name: 'Sustainable Cities' },
    { num: 12, name: 'Responsible Consumption' },
    { num: 13, name: 'Climate Action' },
    { num: 14, name: 'Life Below Water' },
    { num: 15, name: 'Life on Land' },
    { num: 16, name: 'Peace & Justice' },
    { num: 17, name: 'Partnerships' },
  ];

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1>SDG Collaboration Platform</h1>
          <p className="hero-subtitle">
            Strengthening partnerships for sustainable development goals
          </p>
          <p className="hero-description">
            Connect NGOs, educational institutions, government departments, and private contributors
            to collaborate, share resources, and accelerate SDG implementation.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn btn-primary">Get Started</Link>
            <Link to="/projects" className="btn btn-secondary">Explore Projects</Link>
          </div>
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2>Platform Features</h2>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Organization Profiles</h3>
              <p>Register your organization with SDG focus areas and connect with partners</p>
            </div>
            <div className="feature-card">
              <h3>Project Management</h3>
              <p>Publish and track SDG-related projects with milestones and progress</p>
            </div>
            <div className="feature-card">
              <h3>Resource Sharing</h3>
              <p>Request or offer resources: funding, volunteers, materials, and expertise</p>
            </div>
            <div className="feature-card">
              <h3>Collaboration Tools</h3>
              <p>Built-in messaging and discussion spaces for partnerships</p>
            </div>
            <div className="feature-card">
              <h3>Analytics Dashboard</h3>
              <p>Track SDG contributions and identify collaboration opportunities</p>
            </div>
            <div className="feature-card">
              <h3>Partnership Matching</h3>
              <p>Discover high-impact partnership opportunities based on SDG alignment</p>
            </div>
          </div>
        </div>
      </section>

      <section className="sdg-section">
        <div className="container">
          <h2>17 Sustainable Development Goals</h2>
          <div className="sdg-grid">
            {sdgGoals.map(sdg => (
              <div key={sdg.num} className="sdg-card">
                <div className="sdg-number">{sdg.num}</div>
                <div className="sdg-name">{sdg.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

