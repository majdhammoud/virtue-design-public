# Virtue Design

An AI-powered interior design platform. Users upload photos of their rooms and receive furniture recommendations, which they can explore through a 3D visualization.

## Tech stack

- **Frontend:** React, Three.js (via React Three Fiber / drei)
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **AI:** OpenAI API

## Project structure

- `frontend 2/` – React app
- `backend 2/` – Node.js API

## Setup

Requires Node.js and a MongoDB database.

### 1. Environment variables

Copy `.env.example` to `backend 2/.env` and fill in the values. The backend loads it with `dotenv` from the directory you start it in, so run the backend from inside `backend 2/`. Never commit this file.

### 2. Backend

```bash
cd "backend 2"
npm install
node app.js
```

The API runs on http://localhost:3001.

### 3. Frontend

```bash
cd "frontend 2"
npm install
npm start
```

The app runs on http://localhost:3000.
