# WorldState: Alps Edition 🏔⛷

**Real-Time Ski Resort Monitor**

WorldState: Alps Edition is a specialized real-time monitoring system for major Alpine ski resorts. It visualizes live conditions, lift status, and safety alerts (avalanche, wind, powder) on an interactive 3D map.

## Features

- **Live Resort Data**: Tracks Zermatt, Chamonix, St. Anton, and Verbier.
- **Real-Time Events**:
  - ❄️ **Powder Alerts** (Cyan)
  - 🚨 **Lift Closures** (Red)
  - 🚜 **Grooming Reports** (Blue)
  - ⚠️ **Avalanche Warnings** (Orange)
- **Interactive Map**: Neon-styled map with resort pins, lift lines, and terrain view.
- **Resort Dashboard**: Detailed view with stats, weather forecast, and SOS beacon.
- **Live Feed**: Glassmorphic event stream with severity coding.

## Tech Stack

- **Frontend**: Vite, Leaflet, CSS Variables (Dark/Neon Theme)
- **Backend**: Node.js, WebSocket (Native `ws` module)
- **Data**: Static resort definitions + Randomized event simulation

## Installation & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Development Server**:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8080`

## Project Structure

- `src/`: Frontend source (Map, Dashboard, Sidebar)
- `server/`: Backend source (WebSocket server, Data)
- `public/`: Static assets

---
*Powered by WorldState Engine*
*Last Updated: 2026-02-16*
