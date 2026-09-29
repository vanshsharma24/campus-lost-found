<div align="center">

# Campus Lost & Found

### A modern full-stack platform to reunite lost items with their owners on campus

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**[Live Demo](https://campus-lost-found-two-gamma.vercel.app)** &nbsp;•&nbsp; **[Report Bug](https://github.com/vanshsharma24/campus-lost-found/issues)** &nbsp;•&nbsp; **[Request Feature](https://github.com/vanshsharma24/campus-lost-found/issues)**

</div>

---

## Overview

**Campus Lost & Found** is a full-stack web application that helps students and staff report lost items and find items others have found on campus. It solves the common problem of scattered communication (WhatsApp groups, physical notice boards) by providing a single searchable platform with a secure claim-and-approval workflow.

Built with modern technologies and deployed on production-grade cloud infrastructure — completely free.

---

## Key Features

- **JWT Authentication** — Secure registration and login with bcrypt-hashed passwords
- **Image Upload** — Cloudinary-powered image storage with global CDN delivery
- **Smart Search & Filters** — Search by keyword; filter by type, category, and status
- **Claim Workflow** — Submit ownership claims with description; owner approves or rejects
- **Personal Dashboard** — 5 tabs: Lost Items, Found Items, My Claims, Received Claims, Returned
- **Item Status Tracking** — Full lifecycle: `OPEN → CLAIMED → RETURNED`
- **Ownership Protection** — Backend enforces user permissions on every mutation
- **Mobile Responsive** — Fully optimized for phones, tablets, and desktops
- **Modern UI** — Clean interface with Tailwind CSS, smooth animations, and thoughtful UX

---

## Tech Stack

### Frontend
| Technology | Purpose |
|-----------|---------|
| React 18 | Component-based UI library |
| Vite | Lightning-fast build tool and dev server |
| React Router v6 | Client-side routing |
| Tailwind CSS | Utility-first styling framework |
| Axios | Promise-based HTTP client |
| React Hot Toast | Elegant toast notifications |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | JavaScript runtime |
| Express.js | Minimal web framework |
| MySQL2 | MySQL driver with connection pooling |
| jsonwebtoken (JWT) | Stateless authentication |
| bcryptjs | Password hashing |
| Multer | Multipart form handling |
| Cloudinary | Cloud image storage and CDN |

### Infrastructure
| Service | Purpose |
|---------|---------|
| Vercel | Frontend hosting (auto-deploy from GitHub) |
| Render | Backend API hosting |
| Aiven | Managed MySQL database |
| Cloudinary | Image CDN |
| GitHub | Source control and CI trigger |

---

## Architecture

```
                    ┌──────────────────────┐
                    │   User's Browser     │
                    └──────────┬───────────┘
                               │
              ┌────────────────┴────────────────┐
              ▼                                 ▼
     ┌──────────────────┐              ┌───────────────────┐
     │  Vercel (React)  │──── API ────▶│  Render (Node.js) │
     │  Frontend + CDN  │◀─── JSON ────│  Express REST API │
     └──────────────────┘              └────────┬──────────┘
                                                │
                        ┌───────────────────────┴──────┐
                        ▼                              ▼
                ┌───────────────┐              ┌────────────────┐
                │ Aiven MySQL   │              │  Cloudinary    │
                │   Database    │              │   Image CDN    │
                └───────────────┘              └────────────────┘
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Git](https://git-scm.com/downloads)
- MySQL server (local) OR a cloud MySQL instance (Aiven, PlanetScale, etc.)
- [Cloudinary](https://cloudinary.com/) account (free tier)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/vanshsharma24/campus-lost-found.git
cd campus-lost-found
```

**2. Set up the backend**

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:

```env
# Server
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=campus_lost_found
DB_SSL=false

# JWT
JWT_SECRET=your_random_secret_string

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# CORS
FRONTEND_URL=http://localhost:3000
```

Create the database and tables:

```bash
mysql -u root -p < database.sql
```

Start the backend:

```bash
npm start
```

The API will be available at `http://localhost:5000`.

**3. Set up the frontend**

In a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The app will be available at `http://localhost:3000`.

**4. (Optional) Seed dummy data**

```bash
cd backend
node seed.js
```

This creates 5 test users and 12 items with images.

**Test credentials (all use password `test1234`):**
- priya@college.edu
- ravi@college.edu
- ananya@college.edu
- arjun@college.edu
- sneha@college.edu

---

## Project Structure

```
campus-lost-found/
├── backend/
│   ├── config/
│   │   ├── db.js                 # MySQL connection pool
│   │   └── cloudinary.js         # Cloudinary configuration
│   ├── controllers/
│   │   ├── authController.js     # register, login, profile
│   │   ├── itemController.js     # CRUD on items
│   │   ├── claimController.js    # Claim workflow
│   │   └── categoryController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT verification
│   │   └── upload.js             # Multer + Cloudinary
│   ├── routes/                   # API route definitions
│   ├── database.sql              # MySQL schema
│   ├── seed.js                   # Dummy data seeder
│   └── server.js                 # Express entry point
│
└── frontend/
    └── src/
        ├── components/           # Reusable UI (Navbar, ItemCard, etc.)
        ├── pages/                # Route-level components
        ├── context/              # Global auth state
        ├── utils/                # Axios instance, helpers
        ├── App.jsx               # Router setup
        └── main.jsx              # React entry point
```

---

## API Reference

Base URL: `http://localhost:5000/api` (local) or your deployed backend URL.

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/auth/register` | Create a new user account | — |
| `POST` | `/auth/login` | Log in and receive a JWT | — |
| `GET`  | `/auth/profile` | Get the current user's profile | ✓ |
| `PUT`  | `/auth/profile` | Update name and phone | ✓ |

### Items

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET`    | `/items` | List all items (supports `type`, `category`, `status`, `search` query params) | — |
| `GET`    | `/items/:id` | Get a single item with owner contact | — |
| `POST`   | `/items` | Create a new item (multipart with image) | ✓ |
| `PUT`    | `/items/:id` | Update an item | ✓ (owner) |
| `DELETE` | `/items/:id` | Delete an item | ✓ (owner) |
| `GET`    | `/items/my/items` | List the current user's items | ✓ |
| `PATCH`  | `/items/:id/return` | Mark an item as returned | ✓ (owner) |

### Claims

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST`  | `/claims` | Submit a claim on an item | ✓ |
| `GET`   | `/claims/my` | List claims submitted by the current user | ✓ |
| `GET`   | `/claims/received` | List claims on the current user's items | ✓ |
| `PATCH` | `/claims/:id/status` | Approve or reject a claim | ✓ (item owner) |

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/categories` | List all 9 categories | — |

---

## Deployment

The project is designed for continuous deployment from GitHub:

1. **Push to GitHub** — Every commit to `main` triggers automatic redeployment.
2. **Vercel** — Frontend rebuilds and deploys within ~2 minutes.
3. **Render** — Backend rebuilds and restarts within ~3-5 minutes.
4. **Aiven** — MySQL database runs 24/7 in the cloud.
5. **Cloudinary** — Images serve from a global CDN.

### Deployment configuration

**Vercel** (Frontend):
- Framework Preset: `Vite`
- Root Directory: `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_URL` = your Render backend URL

**Render** (Backend):
- Runtime: `Node`
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Add all backend `.env` variables in the Render dashboard

---

## Security

- Passwords hashed with **bcrypt** (10 salt rounds) — never stored in plain text
- **JWT tokens** signed with a secret, valid for 7 days
- **Parameterized SQL queries** — prevents SQL injection
- **CORS restrictions** — API only accepts requests from the configured frontend URL
- **Ownership checks** — enforced on every edit, delete, and approve action
- **File upload validation** — only image formats up to 5MB
- **Environment variables** — all secrets stored outside source code
- **HTTPS everywhere** — Vercel and Render provide SSL certificates by default

---

## Roadmap

- [ ] Email notifications when claims are approved or rejected
- [ ] In-app real-time chat between finder and loser
- [ ] AI-powered image matching to suggest lost/found pairs
- [ ] Multiple images per item
- [ ] Progressive Web App (PWA) support for offline access
- [ ] Native mobile app using React Native
- [ ] Admin dashboard for moderation
- [ ] Multi-campus support

---

## Contributing

Contributions are welcome. If you have suggestions or find a bug, please open an issue or submit a pull request.

```bash
# Fork the repository
git checkout -b feature/your-feature-name
git commit -m "Add: your feature"
git push origin feature/your-feature-name
# Open a Pull Request
```

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

## Author

**Vansh Sharma**

- GitHub: [@vanshsharma24](https://github.com/vanshsharma24)
- Project Link: [github.com/vanshsharma24/campus-lost-found](https://github.com/vanshsharma24/campus-lost-found)
- Live Demo: [campus-lost-found-two-gamma.vercel.app](https://campus-lost-found-two-gamma.vercel.app)

---

<div align="center">

**If this project helped you, please give it a star**

Built with care as a full-stack final year project

</div>
