# Tattoo Studio App

Full-stack web application for a tattoo studio, built as a final project for Coding Factory 9 (Athens University of Economics and Business).

## Live Demo

- **Frontend:** https://tattoo-studio-frontend.onrender.com
- **Backend API:** https://tattoo-studio-backend.onrender.com/api
- **Swagger Docs:** https://tattoo-studio-backend.onrender.com/api/docs

## Tech Stack

**Backend:** Node.js, Express 5, TypeScript, MongoDB (Mongoose), JWT, Google OAuth 2.0, Zod, Swagger, Winston, Jest

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, React Router, React Hook Form, Zod, Axios

**Services:** Cloudinary (image uploads), Brevo (transactional email)

## Architecture

The backend follows a layered architecture:

```
Routes → Controllers → Services → DAOs (Repository) → MongoDB
                                         ↕
                              DTOs + Mappers + Validators
```

- **Models** — Mongoose schemas (User, Post, GalleryImage, TattooStyle, Appointment)
- **DAOs** — Data access layer, one per entity
- **Services** — Business logic
- **Controllers** — HTTP request/response handling
- **DTOs + Mappers** — Shape data for API responses
- **Validators** — Zod schemas for input validation

## Features

- JWT-based authentication + Google OAuth 2.0
- Role-based authorization (admin / artist / customer)
- CRUD for Gallery, Posts, Tattoo Styles, Appointments
- Appointment booking system with calendar
- Image upload via Cloudinary (drag & drop or URL)
- Email notifications via Brevo (new booking → admin, confirmation → customer)
- One-click appointment confirm button in admin email
- Admin dashboard
- Rate limiting on auth endpoints (20 req / 15 min)
- Security headers via Helmet
- Request logging via Winston + Morgan
- Global error handling
- Swagger API documentation at `/api/docs`

---

## Prerequisites

- Node.js >= 18
- npm >= 9
- MongoDB instance (local or MongoDB Atlas)

---

## Local Development

### 1. Clone the repository

```bash
git clone https://github.com/FoivosMastroleon/tattoo-studio-app.git
cd tattoo-studio-app
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Fill in the values in `.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/tattoo-studio
JWT_SECRET=your-secret-key-minimum-32-characters
SALT_ROUNDS=10
CORS_ORIGINS=http://localhost:5173
GOOGLE_CLIENT_ID=your-google-oauth-client-id
HF_API_KEY=your-huggingface-api-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
ADMIN_EMAIL=your-admin-email
BREVO_API_KEY=your-brevo-api-key
BACKEND_URL=http://localhost:5000
```

Start the backend in development mode:

```bash
npm run dev
```

The server starts at `http://localhost:5000`.  
Swagger docs available at `http://localhost:5000/api/docs`.

### 3. Frontend setup

```bash
cd frontend
npm install
```

Create a `.env` file based on the example:

```bash
cp .env.example .env
```

Fill in the values in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
VITE_HF_API_TOKEN=your-huggingface-api-key
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

Start the frontend in development mode:

```bash
npm run dev
```

The app runs at `http://localhost:5173`.

---

## Running Tests

Tests use Jest + Supertest + mongodb-memory-server (no external DB required).

```bash
cd backend
npm test
```

---

## Production Build

### Backend

```bash
cd backend
npm run build
```

Compiled output goes to `backend/dist/`. To start the production server:

```bash
npm start
```

### Frontend

```bash
cd frontend
npm run build
```

Static files are generated in `frontend/dist/`. Serve with any static file host (Nginx, Render, Netlify, etc.).

---

## Deployment (Render)

The app is configured for deployment on [Render](https://render.com).

### Backend (Web Service)

| Setting | Value |
|---|---|
| Root Directory | `backend` |
| Build Command | `npm install && npm run build` |
| Start Command | `node dist/server.js` |
| Environment | Node |

Add the environment variables from `.env.example` in the Render dashboard.

### Frontend (Static Site)

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |

Add the environment variables from `.env.example` in the Render dashboard.

> After deploying the backend, set `VITE_API_URL` to the backend's Render URL before building the frontend. Also set `CORS_ORIGINS` in the backend to the frontend's Render URL.

### MongoDB

Use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (free tier). Set the connection string as `MONGO_URI` in the backend environment variables.

---

## API Endpoints

Full interactive documentation is available at `/api/docs` (Swagger UI).

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register | — |
| POST | `/api/auth/login` | Login | — |
| POST | `/api/auth/google` | Google OAuth | — |
| GET | `/api/auth/me` | Current user | JWT |
| GET | `/api/users` | List users | Admin |
| GET | `/api/gallery` | List gallery images | — |
| POST | `/api/gallery` | Upload image | Admin |
| GET | `/api/posts` | List posts | — |
| POST | `/api/posts` | Create post | Admin |
| GET | `/api/styles` | List tattoo styles | — |
| POST | `/api/styles` | Create style | Admin |
| GET | `/api/appointments` | List appointments | JWT |
| POST | `/api/appointments` | Book appointment | JWT |
