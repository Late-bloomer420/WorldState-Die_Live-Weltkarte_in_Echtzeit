# WorldState — Privacy-First Real-Time World Map

> Die schönste, futuristischste Live-Darstellung unseres Planeten.

Menschen lieben Daten und Visualisierung — aber alles ist verstreut. WorldState zeigt die Welt in Echtzeit.

## Live-Layer

| Layer | Quellen | Update |
|-------|---------|--------|
| 🏗 Urban Growth | ESA Sentinel-2, NASA Landsat, GHSL | 5–16 Tage |
| ⚔️ Konflikte | ACLED, UCDP Uppsala, Crisis Group, OSCE | Echtzeit |
| 🏭 Infrastruktur | IEA, ITU, MarineTraffic | Echtzeit |
| 🌋 Katastrophen | USGS, NOAA, GDACS, ReliefWeb | Echtzeit |
| ✊ Proteste | ACLED Disorder Tracker, CIVICUS, V-Dem | Echtzeit |
| 📈 Wirtschaft | Yahoo Finance, CoinGecko, Trading Economics | Echtzeit |
| 🗺 Karten | OpenStreetMap, CARTO Basemaps, Leaflet.js | — |

---

## Privacy Guarantees

### Planet Mode (Current)
- ✅ **Zero User Tracking** — No IPs, no IDs, no sessions
- ✅ **Broadcast-Only** — Server pushes data, clients never send
- ✅ **Stateless** — No user history or profiles
- ✅ **Source Attribution** — Every data point links to original source (28+ providers)
- ✅ **Open Source** — Full code transparency

### Technical Implementation
- WebSocket server is **receive-only** (no `ws.on('message')` handler)
- No analytics, no logging of user behavior
- All map interactions (zoom, pan, filters) happen **client-side only**
- No localStorage for tracking purposes
- Health endpoint returns **only aggregate metrics** (total clients count, uptime)

**Verification:** Inspect the code. Search for `ws.send()` in client — you won't find it.
Search for `remoteAddress` — you won't find it.

---

## Quick Start

```bash
npm install
npm run dev
# → http://localhost:5173
```

## Dual-Mode

| Mode | Description |
|------|-------------|
| 🖥 WorldState Live Map | Desktop 3-Panel: Control Panel + Leaflet Map + Event Feed |
| 📱 WorldState App | Mobile SPA: Bottom Nav → Globe, Feed, Alerts, Economy, Profile |

Toggle via the mode switcher bar at the top, or press `Ctrl+Tab`.

## Architecture

```
┌──────────────────────────────────────┐
│        WorldState Frontend           │
│  ┌────────────┐  ┌────────────────┐  │
│  │ Web Mode   │  │  App Mode      │  │
│  │ (3-panel)  │  │  (5 views)     │  │
│  └─────┬──────┘  └───────┬────────┘  │
│        │    Shared Map    │          │
│        └────────┬─────────┘          │
└─────────────────┼────────────────────┘
                  │ WebSocket (receive-only)
          ┌───────▼────────┐
          │ WS Server :8080│
          │ (stateless)    │
          │ NO TRACKING    │
          │ BROADCAST-ONLY │
          └───────┬────────┘
                  │
          ┌───────▼────────┐
          │ Public Data    │
          │ APIs (28+)     │
          └────────────────┘
```

## Data Sources (28+)

All displayed information comes from verified public sources. Each event includes `source: { name, url }` linking to the original data provider.

See the full list in **Profile → Datenquellen** or in [`server/data/gub-regions.js`](server/data/gub-regions.js).

## Tech Stack

- **Frontend:** Vite, Leaflet.js, Vanilla JS + CSS
- **Backend:** Node.js WebSocket Server
- **Data:** 20 GUB regions, 30+ hotspot locations, 28+ source providers
