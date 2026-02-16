import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
import { ALPS_RESORTS, SKI_EVENT_TEMPLATES } from './data/resort-data.js';
import CyberFetcher from './cyber-fetcher.js';


const PORT = 8080;

// ── HTTP server for health check ────────────────────────────────
const httpServer = http.createServer((req, res) => {
    if (req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            status: 'ok',
            uptime: process.uptime(),
            clients: wss.clients.size,
            eventsEmitted: stats.eventsEmitted,
            mode: 'ALPS_EDITION',
            cyber: cyberFetcher.getHealth()
        }));
    } else {
        res.writeHead(404);
        res.end();
    }
});


const wss = new WebSocketServer({ server: httpServer });
const cyberFetcher = new CyberFetcher();

const stats = { eventsEmitted: 0 };

const SEVERITY_LEVELS = ['low', 'medium', 'high', 'critical'];
const EVENT_TYPES = ['powder_alert', 'lift_closure', 'grooming_report', 'event_alert', 'avalanche_warning'];
const EVENT_WEIGHTS = [0.25, 0.15, 0.25, 0.25, 0.10]; // probability weights

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
 * Add slight randomness to coordinates (±0.005 degrees - tighter for resorts)
 */
function jitter(coords, amount = 0.008) {
    return [
        coords[0] + (Math.random() - 0.5) * amount * 2,
        coords[1] + (Math.random() - 0.5) * amount * 2
    ];
}

/**
 * Generate a simulated ski event
 */
function generateEvent() {
    const type = weightedEventType();
    const resort = pick(ALPS_RESORTS);

    // Determine severity based on type
    let severity = 'low';
    if (type === 'powder_alert') severity = 'medium'; // Info/Good news
    if (type === 'lift_closure') severity = 'high';
    if (type === 'avalanche_warning') severity = 'critical';

    // Override severity randomly sometimes
    if (Math.random() > 0.8) severity = pick(SEVERITY_LEVELS);

    return {
        id: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        type,
        severity,
        coords: jitter(resort.coords, 0.015), // Jitter around resort center
        timestamp: new Date().toISOString(),
        metadata: {
            resortId: resort.id,
            resortName: resort.name,
            country: resort.country,
            message: pick(SKI_EVENT_TEMPLATES[type]),
            temp: resort.stats.temp + Math.floor(Math.random() * 3) - 1, // Slight temp variation
            wind: resort.stats.wind + Math.floor(Math.random() * 10) - 5
        }
    };
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
 * Send initial data to a newly connected client
 */
function sendInitialData(ws) {
    ws.send(JSON.stringify({
        type: 'init',
        payload: {
            resorts: ALPS_RESORTS,
            serverTime: new Date().toISOString()
        }
    }));
}

// ── Connection handling ─────────────────────────────────────────
wss.on('connection', (ws, req) => {
    const clientIp = req.socket.remoteAddress;
    console.log(`[WS] Client connected (${clientIp}) — total: ${wss.clients.size}`);

    sendInitialData(ws);

    ws.on('close', () => {
        console.log(`[WS] Client disconnected — total: ${wss.clients.size}`);
    });

    ws.on('error', (err) => {
        console.error(`[WS] Error:`, err.message);
    });
});

/**
 * Generate a cyber threat event (if enabled)
 */
async function generateCyberEvent() {
    if (!cyberFetcher.enabled) return null;

    // 10% chance to try generating a cyber event
    if (Math.random() < 0.1) {
        return await cyberFetcher.getRandomCyberThreat();
    }
    return null;
}

// ── Event generation loop ───────────────────────────────────────
function startEventLoop() {
    const emit = async () => {
        if (wss.clients.size > 0) {
            // Check for cyber event first
            const cyberEvent = await generateCyberEvent();
            if (cyberEvent) {
                broadcast({ type: 'event', payload: cyberEvent });
                console.log(`[Event] 🛡️ Cyber Threat: ${cyberEvent.subtype} in ${cyberEvent.location.country}`);
            } else {
                // Normal ski event
                const event = generateEvent();
                broadcast({ type: 'event', payload: event });
            }
            stats.eventsEmitted++;
        }
        // Ski events every 2-5 seconds
        const delay = 2000 + Math.random() * 3000;
        setTimeout(emit, delay);
    };
    emit();
}

// ── Start server ────────────────────────────────────────────────
httpServer.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════╗
║    🏔 WorldState: ALPS EDITION Server       ║
║──────────────────────────────────────────────║
║  WebSocket : ws://localhost:${PORT}             ║
║  Resorts   : ${ALPS_RESORTS.length} major hubs             ║
║  Status    : Ready for powder!               ║
╚══════════════════════════════════════════════╝
  `);
    startEventLoop();
});
