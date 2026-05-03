# Smart Hostel System

A modern hostel management system built with the MERN stack.

## Deployment Guide

### Backend (Render)
1. Sign up/Login to [Render](https://render.com/).
2. Create a new **Web Service**.
3. Connect your GitHub repository.
4. Set the **Root Directory** to `backend`.
5. **Build Command**: `npm install`
6. **Start Command**: `node server.js`
7. Add Environment Variables:
   - `MONGO_URI`: Your MongoDB Atlas URI.
   - `JWT_SECRET`: A secure random string.
   - `CORS_ORIGIN`: Your Vercel frontend URL.
   - `PORT`: `5000` (Render will handle this, but you can set it).

### Frontend (Vercel)
1. Sign up/Login to [Vercel](https://vercel.com/).
2. Create a new project and import your repository.
3. Set the **Root Directory** to `frontend`.
4. Vercel should auto-detect Vite.
5. Add Environment Variable:
   - `VITE_API_BASE_URL`: Your Render service URL + `/api` (e.g., `https://my-backend.onrender.com/api`).
6. Deploy!

## Local Development
1. Clone the repo.
2. Setup `.env` files in both `backend` and `frontend` using the `.env.example` templates.
3. Run `npm install` in both directories.
4. Run `npm run dev` in both directories.