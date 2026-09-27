# Campus Lost and Found

A full-stack web application to help students and staff report, search and recover lost or found items on campus.

## Features

- User registration and login with JWT authentication
- Report lost or found items with images
- Search and filter items by category, type, and status
- Submit claims for items
- Approve or reject claims on your posted items
- Personal dashboard showing lost items, found items, claims and returned items
- Update user profile

## Tech Stack

**Frontend:** React.js, React Router, Tailwind CSS, Axios, React Hot Toast

**Backend:** Node.js, Express.js, MySQL, JWT, bcryptjs, Multer

**Database:** MySQL

## Project Structure

```
campus-lost-found/
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── routes/
│   ├── uploads/
│   ├── database.sql
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── context/
    │   ├── utils/
    │   ├── App.jsx
    │   └── main.jsx
    ├── index.html
    └── package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v14 or higher)
- MySQL server
- npm

### Backend Setup

1. Navigate to backend folder
```
cd backend
```

2. Install dependencies
```
npm install
```

3. Create MySQL database using the provided SQL file
```
mysql -u root -p < database.sql
```

4. Create a `.env` file (use `.env.example` as reference)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=campus_lost_found
JWT_SECRET=your_secret_key
```

5. Start the backend server
```
npm start
```

Server will run on http://localhost:5000

### Frontend Setup

1. Open a new terminal and go to frontend folder
```
cd frontend
```

2. Install dependencies
```
npm install
```

3. Start the development server
```
npm run dev
```

App will run on http://localhost:3000

## API Endpoints

### Auth
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile
- PUT `/api/auth/profile` - Update profile

### Items
- GET `/api/items` - Get all items with filters
- GET `/api/items/:id` - Get single item
- POST `/api/items` - Create new item
- PUT `/api/items/:id` - Update item
- DELETE `/api/items/:id` - Delete item
- GET `/api/items/my/items` - Get logged in user's items
- PATCH `/api/items/:id/return` - Mark item as returned

### Claims
- POST `/api/claims` - Submit a claim
- GET `/api/claims/my` - Get my submitted claims
- GET `/api/claims/received` - Get claims on my items
- PATCH `/api/claims/:id/status` - Approve or reject claim

### Categories
- GET `/api/categories` - Get all categories

## Screenshots

Add screenshots here after running the application.

## Author

Built as a final year project.
