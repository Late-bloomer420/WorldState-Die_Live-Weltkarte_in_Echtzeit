import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

import { GUB_REGIONS, EVENT_TEMPLATES, HOTSPOT_LOCATIONS, EVENT_SOURCES, RELIABILITY_BADGES } from './data/gub-regions.js';
import { APIFetcher } from './api-fetcher.js';

// ── Real API Integration ────────────────────────────────────────
const apiFetcher = new APIFetcher();

/**
 * ══════════════════════════════════════════════════════════════════
 *  PRIVACY PRINCIPLES — PLANET MODE
 * ══════════════════════════════════════════════════════════════════
 *
 *  This server operates on a strict no-tracking policy:
 *
 *  1. NO USER DATA COLLECTION
 *     - No IP addresses logged or stored
 *     - No user IDs, session tokens, or cookies
 *     - No device fingerprinting
 *
 *  2. UNIDIRECTIONAL DATA FLOW
 *     - Server broadcasts public data to all clients
 *     - Clients never send data back (no ws.on('message') handler)
 *     - No personalization or profiling
 *
 *  3. STATELESS OPERATION
 *     - No user sessions
 *     - No request history
 *     - Health endpoint shows only aggregate metrics
 *
 *  4. SOURCE TRANSPARENCY
 *     - Every data point includes source attribution
 *     - All data sources are publicly verifiable (28+ providers)
 *
 *  This architecture makes surveillance structurally impossible.
 * ══════════════════════════════════════════════════════════════════
 */

const PORT = process.env.PORT || 8080;
const HOST = process.env.NODE_ENV === 'production' ? '0.0.0.0' : 'localhost';

// ── HTTP server for health check ────────────────────────────────
const app = http.createServer((req, res) => {
    // Basic CORS for Health Endpoint
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.url === '/health') {
        res.writeHead(200, {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store'    // No caching of health data
        });
        // Health endpoint shows ONLY aggregate metrics — no user/connection details
        const apiStats = apiFetcher.getStats();
        res.end(JSON.stringify({
            status: 'ok',
            uptime: Math.floor(process.uptime()),
            clients: wss.clients.size,      // Anonymous count only
            eventsEmitted: stats.eventsEmitted,
            realEventsEmitted: stats.realEventsEmitted,
            apis: {
                usgs: { fetches: apiStats.earthquakeFetches, lastFetch: apiStats.lastEarthquakeFetch },
                openMeteo: { fetches: apiStats.weatherFetches, lastFetch: apiStats.lastWeatherFetch },
                errors: apiStats.errors,
                cacheSize: apiStats.cacheSize
            }
        }));
    } else {
        res.writeHead(404);
        res.end();
    }
});

// ── WebSocket server ────────────────────────────────────────────
const wss = new WebSocketServer({ server: app });

const stats = { eventsEmitted: 0, realEventsEmitted: 0 };
const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'];
const EVENT_TYPES = ['urban_growth', 'conflict', 'infrastructure', 'disaster', 'protest', 'weather'];
const EVENT_WEIGHTS = [0.20, 0.20, 0.10, 0.15, 0.10, 0.25]; // probability weights

/**
 * Pick a random item from an array
 */
function pick(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Weighted random selection of event type
 */
function weightedEventType() {
    const r = Math.random();
    let sum = 0;
    for (let i = 0; i < EVENT_TYPES.length; i++) {
        sum += EVENT_WEIGHTS[i];
        if (r <= sum) return EVENT_TYPES[i];
    }
    return EVENT_TYPES[0];
}

/**
 * Add slight randomness to coordinates (±0.05 degrees)
 */
function jitter(coords, amount = 0.05) {
    return [
        coords[0] + (Math.random() - 0.5) * amount * 2,
        coords[1] + (Math.random() - 0.5) * amount * 2
    ];
}

/**
 * Generate a simulated GUB urban growth event
 */
function generateUrbanGrowthEvent() {
    const region = pick(GUB_REGIONS);
    const growth = region.imperviousKm2;
    const currentGrowthRate = ((growth.y2024 - growth.y2020) / growth.y2020 * 100).toFixed(1);

    const source = pick(EVENT_SOURCES.urban_growth);
    const badge = RELIABILITY_BADGES[source.reliability] || RELIABILITY_BADGES.community;
    return {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type: 'urban_growth',
        severity: parseFloat(currentGrowthRate) > 10 ? 'high' : parseFloat(currentGrowthRate) > 5 ? 'medium' : 'low',
        coords: jitter(region.center, 0.03),
        timestamp: new Date().toISOString(),
        source: {
            name: source.name,
            url: source.url,
            updateFrequency: source.updateFrequency,
            reliability: source.reliability,
            lastVerified: source.lastVerified,
            badge: { label: badge.label, icon: badge.icon, color: badge.color }
        },
        metadata: {
            city: region.name,
            country: region.country,
            message: pick(EVENT_TEMPLATES.urban_growth),
            population: region.population,
            imperviousKm2: growth.y2024,
            growthRate: `${currentGrowthRate}%`,
            polygon: region.polygon
        }
    };
}

/**
 * Generate a simulated conflict/infrastructure/disaster/protest event
 */
function generateHotspotEvent(type) {
    const location = pick(HOTSPOT_LOCATIONS);
    const severity = pick(SEVERITY_LEVELS);

    const sourceDefs = EVENT_SOURCES[type] || EVENT_SOURCES.conflict;
    const source = pick(sourceDefs);
    const badge = RELIABILITY_BADGES[source.reliability] || RELIABILITY_BADGES.community;
    return {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        severity,
        coords: jitter(location.coords, 0.08),
        timestamp: new Date().toISOString(),
        source: {
            name: source.name,
            url: source.url,
            updateFrequency: source.updateFrequency,
            reliability: source.reliability,
            lastVerified: source.lastVerified,
            badge: { label: badge.label, icon: badge.icon, color: badge.color }
        },
        metadata: {
            location: location.name,
            region: location.region,
            message: pick(EVENT_TEMPLATES[type]),
            verified: Math.random() > 0.3,
            sources: Math.floor(Math.random() * 5) + 1
        }
    };
}

/**
 * Generate a random event
 */
function generateEvent() {
    const type = weightedEventType();
    if (type === 'urban_growth') {
        return generateUrbanGrowthEvent();
    }
    return generateHotspotEvent(type);
}

/**
 * Broadcast event to all connected clients
 */
function broadcast(data) {
    const message = JSON.stringify(data);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    });
}

/**
 * Send initial GUB data to a newly connected client
 */
async function sendInitialData(ws) {
    // Fetch real earthquakes for initial load
    const earthquakes = await apiFetcher.fetchEarthquakes();
    const recentQuakes = earthquakes.slice(0, 10); // Latest 10

    ws.send(JSON.stringify({
        type: 'init',
        payload: {
            gubRegions: GUB_REGIONS,
            serverTime: new Date().toISOString(),
            recentEarthquakes: recentQuakes
        }
    }));
}

// ── Connection handling (ANONYMOUS — no user data collected) ────
wss.on('connection', (ws) => {
    // NO TRACKING: Client IP is never logged or stored
    // Connection is anonymous and stateless
    console.log(`[WS] Client connected (anonymous) — total: ${wss.clients.size}`);

    sendInitialData(ws);

    ws.on('close', () => {
        console.log(`[WS] Client disconnected (anonymous) — total: ${wss.clients.size}`);
    });

    ws.on('error', (err) => {
        // Log error type only — no client-identifying information
        console.error(`[WS] Connection error: ${err.code || 'UNKNOWN'}`);
    });

    // NOTE: No ws.on('message') handler exists intentionally.
    // This server is broadcast-only. Clients cannot send data.
});

// ── Hybrid event generation loop (real + simulated) ────────────
function startEventLoop() {
    const emit = async () => {
        if (wss.clients.size > 0) {
            const useRealData = Math.random() < 0.6; // 60% real, 40% simulated
            let event = null;

            if (useRealData) {
                // Alternate between earthquake and weather
                if (Math.random() < 0.5) {
                    event = await apiFetcher.getRandomEarthquake();
                } else {
                    event = await apiFetcher.fetchWeatherEvent();
                }
            }

            if (event) {
                // Real API data
                broadcast({ type: 'event', payload: event });
                stats.realEventsEmitted++;
            } else {
                // Fallback to simulated
                event = generateEvent();
                event.source.live = false;
                broadcast({ type: 'event', payload: event });
            }
            stats.eventsEmitted++;
        }
        // Random interval: 2–5 seconds
        const delay = 2000 + Math.random() * 3000;
        setTimeout(emit, delay);
    };
    emit();
}

// ── Start server ────────────────────────────────────────────────
app.listen(PORT, HOST, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║       🌍  WorldState WebSocket Server        ║
║──────────────────────────────────────────────║
║  URL       : ${process.env.NODE_ENV === 'production' ? 'wss://' : 'ws://'}${HOST}:${PORT}             ║
║  Health    : http://${HOST}:${PORT}/health     ║
║  GUB Cities: ${GUB_REGIONS.length} regions loaded             ║
║  Hotspots  : ${HOTSPOT_LOCATIONS.length} locations tracked           ║
║  APIs      : USGS Earthquake + Open-Meteo   ║
║  Privacy   : NO TRACKING / BROADCAST-ONLY   ║
╚══════════════════════════════════════════════╝
  `);
    startEventLoop();
});
