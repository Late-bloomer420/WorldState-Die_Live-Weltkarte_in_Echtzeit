# 🚀 WorldState Deployment Guide

WorldState is ready for public beta. Follow these steps to deploy the "Planet Mode" architecture with privacy-first real-time API integration.

## 📋 Prerequisites

- **Vercel Account** (for Frontend) → [vercel.com](https://vercel.com)
- **Railway Account** (for Backend) → [railway.app](https://railway.app)
- **GitHub Repository** (Recommended for auto-deploy)

---

## 1️⃣ Backend Deployment (Railway)

1. **Install Railway CLI** (optional, or use Dashboard)
   ```bash
   npm i -g @railway/cli
   railway login
   ```

2. **Initialize & Deploy**
   - Run in project root:
     ```bash
     railway init
     railway up
     ```
   - Or connect via GitHub in Railway Dashboard.

3. **Configure Environment**
   - In Railway Dashboard → Variables:
     - `NODE_ENV`: `production`
     - `PORT`: `8080`

4. **Public Domain**
   - Railway Dashboard → Settings → Networking → Generate Domain.
   - You will get a URL like: `worldstate-production.up.railway.app`
   - **Copy this URL.**

---

## 2️⃣ Frontend Deployment (Vercel)

1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy**
   ```bash
   vercel
   ```
   - Accept default settings.

3. **Link to Backend**
   - Add the WebSocket URL environment variable:
     ```bash
     vercel env add VITE_WS_URL production
     ```
   - Value: `wss://<YOUR-RAILWAY-URL>` (e.g., `wss://worldstate-production.up.railway.app`)
   - **Important:** Must be `wss://` (Secure WebSocket).

4. **Production Build**
   ```bash
   vercel --prod
   ```

---

## 3️⃣ Verification

- Open your Vercel URL (e.g., `https://worldstate.vercel.app`).
- Check browser console (F12) for:
  ```
  ✅ WebSocket connected: wss://worldstate-production.up.railway.app
  ```
- Wait for **Real API Events** (USGS Earthquakes / Open-Meteo Weather) to appear.

---

## 🛠 Troubleshooting

**WebSocket Connection Failed?**
- Check if Railway service is running (`/health` endpoint).
- Ensure `VITE_WS_URL` starts with `wss://`.
- Redeploy Vercel after changing env vars.

**CORS Errors?**
- The server is configured to allow `worldstate-*.vercel.app`.
- If using a custom domain, add it to `allowedOrigins` in `server/index.js`.

**Local Development**
- Use `npm run dev` to start both server and client locally.
- It will use `ws://localhost:8080` automatically.
