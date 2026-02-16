/**
 * WorldState — Main Entry Point (Dual Mode)
 * Web Mode: Original desktop 3-panel layout
 * App Mode: Mobile-style multi-view SPA
 */

import { WorldMap } from './map.js';
import { WSClient } from './websocket.js';
import { EventFeed } from './sidebar.js';
import { ControlPanel } from './controls.js';
import { EventStore } from './event-store.js';
import { Router } from './router.js';
import { MapView } from './views/map-view.js';
import { FeedView } from './views/feed-view.js';
import { AlertsView } from './views/alerts-view.js';
import { EconomyView } from './views/economy-view.js';
import { ProfileView } from './views/profile-view.js';

// ── State ────────────────────────────────────────────
let totalEvents = 0;
let activeAlerts = 0;
let currentMode = 'web'; // 'web' or 'app'

// ── Initialize Map ───────────────────────────────────
const worldMap = new WorldMap('map');

// ── Initialize Web Mode Controls ─────────────────────
const controls = new ControlPanel(worldMap);

// ── Initialize Web Mode Sidebar Feed ─────────────────
const feed = new EventFeed('feed-list', 'feed-empty', 'feed-clear');

feed.onEventClick = (event) => {
    worldMap.flyToEvent(event.coords, 8);
};

// ── Initialize App Mode ──────────────────────────────
const appViewContainer = document.getElementById('app-view');
const bottomNav = document.getElementById('bottom-nav');
const router = new Router(appViewContainer, bottomNav);

// Create app-mode views
const mapView = new MapView(worldMap);
const feedView = new FeedView((event) => {
    // Navigate to map and fly to event
    router.navigate('/');
    setTimeout(() => worldMap.flyToEvent(event.coords, 8), 300);
});
const alertsView = new AlertsView();
const economyView = new EconomyView();
const profileView = new ProfileView();

// Register routes
router.register('/', mapView);
router.register('/feed', feedView);
router.register('/alerts', alertsView);
router.register('/economy', economyView);
router.register('/profile', profileView);

// ── Initialize WebSocket ─────────────────────────────
const wsUrl = `ws://${window.location.hostname}:8080`;
const ws = new WSClient(wsUrl);

ws.on('init', (data) => {
    console.log(`[App] Loaded ${data.gubRegions.length} GUB regions`);
    worldMap.renderGubBoundaries(data.gubRegions);
    updateStats({ cities: data.gubRegions.length });
});

ws.on('event', (event) => {
    // Add to global event store
    EventStore.add(event);

    // Add to map (always, regardless of mode)
    worldMap.addEvent(event);

    // Add to web mode feed
    feed.addEvent(event);

    // Update web mode stats
    totalEvents++;
    if (event.severity === 'high' || event.severity === 'critical') {
        activeAlerts++;
    }
    updateStats({ events: totalEvents, active: activeAlerts });
    controls.updateCounts(worldMap.getLayerCounts());

    // Update app mode notification badge
    const notifBadge = document.getElementById('app-notif-count');
    if (notifBadge) {
        notifBadge.textContent = EventStore.getBySeverity('high', 'critical').length;
    }
});

ws.on('status', ({ state }) => {
    controls.updateStatus(state);
});

ws.connect();

// ── Mode Switching ───────────────────────────────────
const modeSwitcher = document.getElementById('mode-switcher');
const webMode = document.getElementById('web-mode');
const appMode = document.getElementById('app-mode');
const modeWebBtn = document.getElementById('mode-web');
const modeAppBtn = document.getElementById('mode-app');

function switchMode(mode) {
    currentMode = mode;

    // Update buttons
    modeWebBtn.classList.toggle('active', mode === 'web');
    modeAppBtn.classList.toggle('active', mode === 'app');

    if (mode === 'web') {
        webMode.classList.add('active');
        appMode.classList.remove('active');

        // Return map container to web mode if it was moved
        const mapContainer = document.getElementById('map-container');
        const appMain = document.getElementById('app-main');
        if (mapContainer && appMain) {
            // Insert before event-feed sidebar
            const eventFeed = document.getElementById('event-feed');
            appMain.insertBefore(mapContainer, eventFeed);
            mapContainer.style.display = '';
        }

        setTimeout(() => worldMap.map.invalidateSize(), 100);
    } else {
        webMode.classList.remove('active');
        appMode.classList.add('active');

        // Start app mode router
        if (!router._started) {
            router.start();
            router._started = true;
        } else {
            // Re-trigger current route
            router._onHashChange();
        }
    }
}

modeWebBtn.addEventListener('click', () => switchMode('web'));
modeAppBtn.addEventListener('click', () => switchMode('app'));

// ── Stats Updates ────────────────────────────────────
function updateStats(data) {
    if (data.events !== undefined) {
        document.getElementById('stat-events').textContent = data.events;
    }
    if (data.cities !== undefined) {
        document.getElementById('stat-cities').textContent = data.cities;
    }
    if (data.active !== undefined) {
        document.getElementById('stat-active').textContent = data.active;
    }
}

// ── Clock ────────────────────────────────────────────
function updateClock() {
    const now = new Date();
    const utc = now.toISOString().slice(11, 19);
    const local = now.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
    });
    document.getElementById('clock').textContent = `${local} UTC ${utc}`;
}

updateClock();
setInterval(updateClock, 1000);

// ── Map Overlay ──────────────────────────────────────
const overlay = document.getElementById('map-overlay');
const overlayText = document.getElementById('overlay-text');

worldMap.map.on('mousemove', (e) => {
    overlayText.textContent = `${e.latlng.lat.toFixed(4)}°, ${e.latlng.lng.toFixed(4)}°`;
    overlay.classList.add('visible');
});

worldMap.map.on('mouseout', () => {
    overlay.classList.remove('visible');
});

// ── Keyboard Shortcuts ───────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        worldMap.flyToRegion('global');
    }
    // Toggle mode with Tab
    if (e.key === 'Tab' && e.ctrlKey) {
        e.preventDefault();
        switchMode(currentMode === 'web' ? 'app' : 'web');
    }
});

// ── Log startup ──────────────────────────────────────
console.log(`
╔══════════════════════════════════════════════╗
║    🌍 WorldState — Dual Mode Initialized     ║
║──────────────────────────────────────────────║
║  WebSocket : ${wsUrl}                        
║  Leaflet   : v${L.version}                   
║  Modes     : Web (Desktop) + App (Mobile)    
╚══════════════════════════════════════════════╝
`);
