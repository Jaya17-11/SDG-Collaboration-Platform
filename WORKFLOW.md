# Workflow & Testing Guide

This document provides the exact workflow for setting up, running, testing, and working with the SDG Collaboration Platform.

## 📋 Table of Contents

1. [Initial Setup](#initial-setup)
2. [Development Workflow](#development-workflow)
3. [Testing Workflow](#testing-workflow)
4. [API Testing](#api-testing)
5. [Frontend Testing](#frontend-testing)
6. [Common Issues & Solutions](#common-issues--solutions)

---

## 🚀 Initial Setup

### Step 1: Environment Preparation

1. **Install Node.js** (v18 or higher)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Install MongoDB**
   - **Option A**: Local MongoDB
     - Download from [mongodb.com](https://www.mongodb.com/try/download/community)
     - Start MongoDB service: `mongod` (or use Windows Service)
   - **Option B**: MongoDB Atlas (Cloud)
     - Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
     - Create a free cluster
     - Get connection string

### Step 2: Project Setup

1. **Navigate to project root**
   ```bash
   cd pact-app
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Create Backend Environment File**
   ```bash
   # Create .env file in backend/ directory
   # Copy the following content:
   ```
   ```env
   PORT=8000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/pact-db
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-min-32-chars
   JWT_EXPIRES_IN=7d
   CORS_ORIGIN=http://localhost:5173,http://localhost:3000
   ```
   
   **For MongoDB Atlas**, replace `MONGO_URI` with:
   ```env
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/pact-db?retryWrites=true&w=majority
   ```

4. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Create Frontend Environment File**
   ```bash
   # Create .env file in frontend/ directory
   # Copy the following content:
   ```
   ```env
   VITE_API_BASE_URL=http://localhost:8000/api
   VITE_APP_NAME=SDG Collaboration Platform
   VITE_APP_VERSION=1.0.0
   VITE_NODE_ENV=development
   ```

---

## 🔄 Development Workflow

### Starting the Application

**Terminal 1 - Backend Server:**
```bash
cd backend
npm run dev
```
- Server starts on `http://localhost:8000`
- Watch for: `MongoDB connected` and `Server running on port 8000`

**Terminal 2 - Frontend Development Server:**
```bash
cd frontend
npm run dev
```
- Frontend starts on `http://localhost:5173`
- Opens automatically in browser (or navigate manually)

### Development Best Practices

1. **Backend Changes**
   - Files are watched automatically (nodemon)
   - Server restarts on file changes
   - Check terminal for errors

2. **Frontend Changes**
   - Hot Module Replacement (HMR) enabled
   - Changes reflect immediately in browser
   - Check browser console for errors

3. **Database Changes**
   - Models are in `backend/models/`
   - Changes require server restart
   - Use MongoDB Compass or CLI to verify data

---

## 🧪 Testing Workflow

### 1. Backend API Testing

#### Method A: Using req.http File (VS Code REST Client)

1. **Install REST Client Extension** in VS Code
2. **Open** `backend/req.http`
3. **Click "Send Request"** above each endpoint
4. **View responses** in VS Code

#### Method B: Using Postman/Insomnia

1. **Import Collection** (create manually):
   - Base URL: `http://localhost:8000/api`
   - Headers: `Content-Type: application/json`

2. **Test Authentication First:**
   ```
   POST http://localhost:8000/api/auth/register
   Body:
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "password123",
     "role": "user"
   }
   ```

3. **Login to Get Token:**
   ```
   POST http://localhost:8000/api/auth/login
   Body:
   {
     "email": "test@example.com",
     "password": "password123"
   }
   ```
   - Copy the `token` from response
   - Add to subsequent requests: `Authorization: Bearer <token>`

#### Method C: Using cURL

```bash
# Register
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"password123","role":"user"}'

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 2. Frontend Testing

#### Manual Testing Checklist

1. **Home Page**
   - [ ] Page loads without errors
   - [ ] Navigation links work
   - [ ] Hero section displays correctly
   - [ ] SDG goals grid displays
   - [ ] Buttons are clickable

2. **Authentication**
   - [ ] Register page loads
   - [ ] Can register new user
   - [ ] Login page loads
   - [ ] Can login with credentials
   - [ ] Error messages display for invalid inputs

3. **Organizations**
   - [ ] Organizations page loads
   - [ ] Can view list of organizations
   - [ ] Can create new organization (if authenticated)
   - [ ] Organization details display correctly

4. **Projects**
   - [ ] Projects page loads
   - [ ] Can view list of projects
   - [ ] Can view project details
   - [ ] Can create new project (if authenticated)

5. **Resources**
   - [ ] Resources page loads
   - [ ] Can view resource requests/offers
   - [ ] Can create resources (if authenticated)

6. **Dashboard**
   - [ ] Dashboard loads
   - [ ] Analytics display correctly
   - [ ] Charts render properly

7. **Admin Dashboard**
   - [ ] Admin page loads (requires admin role)
   - [ ] Can view pending organizations
   - [ ] Can approve organizations

### 3. Integration Testing

**Test Complete User Flow:**

1. **Registration Flow**
   ```
   Register → Login → Dashboard → Create Organization → Create Project
   ```

2. **Resource Sharing Flow**
   ```
   Login → Projects → View Project → Create Resource Request → View Contributions
   ```

3. **Collaboration Flow**
   ```
   Login → Projects → Project Detail → Create Thread → Add Message → View Messages
   ```

---

## 🔍 API Testing - Detailed Steps

### Step 1: Test Server Health

```bash
GET http://localhost:8000/
Expected: {"message": "Pact API is running"}
```

### Step 2: Test Authentication

**Register User:**
```http
POST http://localhost:8000/api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePass123",
  "role": "user"
}
```

**Login:**
```http
POST http://localhost:8000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Save the token** from login response for authenticated requests.

### Step 3: Test Organizations

**Create Organization:**
```http
POST http://localhost:8000/api/orgs
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "name": "Green Earth Foundation",
  "description": "Environmental conservation organization",
  "sdgFocus": [6, 13, 15],
  "type": "NGO"
}
```

**Get All Organizations:**
```http
GET http://localhost:8000/api/orgs
```

### Step 4: Test Projects

**Create Project:**
```http
POST http://localhost:8000/api/projects
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "title": "Clean Water Initiative",
  "description": "Providing clean water to rural communities",
  "orgId": "<organization-id>",
  "status": "active",
  "sdgGoals": [6]
}
```

**Get All Projects:**
```http
GET http://localhost:8000/api/projects
```

### Step 5: Test Resources

**Create Resource Request:**
```http
POST http://localhost:8000/api/resources
Content-Type: application/json
Authorization: Bearer <your-token>

{
  "type": "request",
  "title": "Need 100 water filters",
  "description": "Looking for water filtration systems",
  "projectId": "<project-id>",
  "status": "open",
  "category": "equipment"
}
```

---

## 🎨 Frontend Testing - Detailed Steps

### Browser Testing

1. **Open Browser Developer Tools**
   - Press `F12` or `Right-click → Inspect`
   - Check Console tab for errors
   - Check Network tab for API calls

2. **Test Responsive Design**
   - Resize browser window
   - Test on mobile viewport (F12 → Toggle device toolbar)
   - Verify layout adapts correctly

3. **Test Navigation**
   - Click all navigation links
   - Verify routes change correctly
   - Check browser back/forward buttons

4. **Test Forms**
   - Fill out registration form
   - Test validation (empty fields, invalid email, etc.)
   - Submit and verify success/error messages

5. **Test Data Loading**
   - Check loading states appear
   - Verify data displays after loading
   - Test error states (disconnect backend, check error handling)

### Console Testing

Open browser console and test:

```javascript
// Check if API is accessible
fetch('http://localhost:8000/api/orgs')
  .then(res => res.json())
  .then(data => console.log('Organizations:', data))
  .catch(err => console.error('Error:', err));
```

---

## 🐛 Common Issues & Solutions

### Issue 1: MongoDB Connection Error

**Error:** `MongoDB connection error: ...`

**Solutions:**
- Verify MongoDB is running: `mongosh` or check service status
- Check `MONGO_URI` in `.env` is correct
- For Atlas: Verify network access (IP whitelist) and credentials
- Check firewall settings

### Issue 2: CORS Errors

**Error:** `Access to fetch at 'http://localhost:8000' from origin 'http://localhost:5173' has been blocked by CORS policy`

**Solutions:**
- Verify `CORS_ORIGIN` in backend `.env` includes frontend URL
- Restart backend server after changing `.env`
- Check `backend/server.js` has `app.use(cors())`

### Issue 3: Frontend Not Loading

**Error:** Blank page or build errors

**Solutions:**
- Check browser console for errors
- Verify `VITE_API_BASE_URL` in frontend `.env`
- Clear browser cache: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

### Issue 4: Port Already in Use

**Error:** `Port 8000 is already in use` or `Port 5173 is already in use`

**Solutions:**
- Find process using port:
  ```bash
  # Windows
  netstat -ano | findstr :8000
  # Kill process (replace PID)
  taskkill /PID <PID> /F
  
  # Mac/Linux
  lsof -ti:8000 | xargs kill
  ```
- Or change port in `.env` files

### Issue 5: JWT Token Errors

**Error:** `Unauthorized` or `Invalid token`

**Solutions:**
- Verify token is included in request headers: `Authorization: Bearer <token>`
- Check token hasn't expired (default: 7 days)
- Re-login to get new token
- Verify `JWT_SECRET` in backend `.env`

### Issue 6: Full Screen Display Issue

**Issue:** Content not displaying full screen

**Solutions:**
- Verify `frontend/src/index.css` has correct body/html styles
- Check `#root` has `width: 100%` and `min-height: 100vh`
- Clear browser cache and hard refresh

---

## 📊 Performance Testing

### Backend Performance

1. **Test API Response Times**
   - Use browser Network tab
   - Check response times for each endpoint
   - Should be < 500ms for simple queries

2. **Test Database Queries**
   - Monitor MongoDB logs
   - Check query execution times
   - Add indexes if queries are slow

### Frontend Performance

1. **Check Bundle Size**
   ```bash
   cd frontend
   npm run build
   # Check dist/ folder size
   ```

2. **Lighthouse Audit**
   - Open Chrome DevTools → Lighthouse
   - Run audit for Performance, Accessibility, Best Practices
   - Aim for scores > 80

---

## 🔐 Security Testing

1. **Test Authentication**
   - Try accessing protected routes without token
   - Verify 401 Unauthorized responses
   - Test token expiration

2. **Test Input Validation**
   - Try SQL injection in forms (should be sanitized)
   - Test XSS in text inputs
   - Verify password requirements

3. **Test CORS**
   - Try accessing API from different origin
   - Verify only allowed origins work

---

## 📝 Testing Checklist Summary

### Before Deployment

- [ ] All API endpoints tested and working
- [ ] Frontend pages load without errors
- [ ] Authentication flow works end-to-end
- [ ] Forms validate correctly
- [ ] Error handling displays user-friendly messages
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No console errors in browser
- [ ] Database connections stable
- [ ] Environment variables configured correctly
- [ ] Build process completes successfully (`npm run build`)

---

## 🚀 Next Steps After Testing

1. **Fix any issues** found during testing
2. **Document bugs** in issue tracker
3. **Optimize performance** based on test results
4. **Prepare for production** deployment
5. **Set up CI/CD** pipeline for automated testing

---

**Last Updated:** 2024
**Maintained By:** Development Team

For questions or issues, refer to the main [README.md](./README.md) or open an issue in the repository.

