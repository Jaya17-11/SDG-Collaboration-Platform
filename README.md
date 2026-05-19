# SDG Collaboration Platform 

A full-stack MERN application designed to strengthen partnerships for Sustainable Development Goals (SDGs). This platform connects NGOs, educational institutions, government departments, and private contributors to collaborate, share resources, and accelerate SDG implementation.

## 🚀 Features

- **Organization Management**: Register and manage organizations with SDG focus areas
- **Project Management**: Create, track, and manage SDG-related projects with milestones
- **Resource Sharing**: Request or offer resources (funding, volunteers, materials, expertise)
- **Collaboration Tools**: Built-in messaging and discussion threads for partnerships
- **Analytics Dashboard**: Track SDG contributions and identify collaboration opportunities
- **Partnership Matching**: Discover high-impact partnership opportunities based on SDG alignment
- **Admin Dashboard**: Manage organizations, projects, and platform analytics

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **React Router DOM** - Routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Recharts** - Data visualization

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local installation or MongoDB Atlas account)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pact-app
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` directory:

```env
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/pact-db
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173,http://localhost:3000
```

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` directory:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_APP_NAME=SDG Collaboration Platform
VITE_APP_VERSION=1.0.0
VITE_NODE_ENV=development
```

## 🚀 Running the Application

### Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service, it should start automatically)
# On macOS/Linux
mongod
```

Or use MongoDB Atlas cloud database and update `MONGO_URI` in backend `.env`.

### Start Backend Server

```bash
cd backend
npm run dev
```

The backend server will run on `http://localhost:8000`

### Start Frontend Development Server

Open a new terminal:

```bash
cd frontend
npm run dev
```

The frontend will run on `http://localhost:5173`

## 📁 Project Structure

```
pact-app/
├── backend/
│   ├── APIs/              # API route handlers
│   │   ├── AuthAPI.js
│   │   ├── OrgAPI.js
│   │   ├── ProjectAPI.js
│   │   ├── ResourceAPI.js
│   │   ├── ContributionAPI.js
│   │   ├── ThreadAPI.js
│   │   ├── MilestoneAPI.js
│   │   ├── PartnershipAPI.js
│   │   └── AnalyticsAPI.js
│   ├── models/            # Mongoose models
│   ├── middlewares/       # Custom middlewares
│   ├── server.js          # Express server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/    # React components
│   │   │   └── Layout/
│   │   ├── pages/         # Page components
│   │   ├── config/        # Configuration files
│   │   ├── App.jsx        # Main App component
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   └── package.json
└── README.md
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login

### Organizations
- `GET /api/orgs` - Get all organizations
- `POST /api/orgs` - Create organization
- `GET /api/orgs/:id` - Get organization by ID
- `GET /api/orgs/pending` - Get pending organizations
- `POST /api/orgs/:id/approve` - Approve organization

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create project
- `GET /api/projects/:id` - Get project by ID
- `GET /api/projects/:id/contributions` - Get project contributions

### Resources
- `GET /api/resources` - Get all resources
- `POST /api/resources` - Create resource

### Contributions
- `POST /api/contributions` - Create contribution

### Threads & Messages
- `POST /api/threads` - Create discussion thread
- `POST /api/threads/:id/messages` - Add message to thread
- `GET /api/threads/:id/messages` - Get thread messages

### Analytics
- `GET /api/analytics/*` - Various analytics endpoints

## 🧪 Testing

See [WORKFLOW.md](./WORKFLOW.md) for detailed testing instructions and workflow.

## 🏗️ Building for Production

### Build Frontend

```bash
cd frontend
npm run build
```

The production build will be in the `frontend/dist` directory.

### Start Production Backend

```bash
cd backend
npm start
```

## 🔒 Environment Variables

### Backend (.env)
- `PORT` - Server port (default: 8000)
- `MONGO_URI` - MongoDB connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `JWT_EXPIRES_IN` - JWT expiration time
- `CORS_ORIGIN` - Allowed CORS origins

### Frontend (.env)
- `VITE_API_BASE_URL` - Backend API base URL
- `VITE_APP_NAME` - Application name
- `VITE_APP_VERSION` - Application version

## 📝 License

This project is licensed under the ISC License.

## 👥 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For issues and questions, please open an issue in the repository.

---

**Note**: Make sure to change the `JWT_SECRET` in production to a strong, random string. Never commit `.env` files to version control.



## Deployment 
https://sdg-collaboration-platform-j4jt.onrender.com - backend
https://sdg-collaboration-platform-two.vercel.app/ - frontend
Database - mongoDB Atlas


