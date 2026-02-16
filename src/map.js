import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import cyberOnboarding from './cyber-onboarding.js';
import protectionGuide from './protection-guide.js';


// Alps Region Bounds for "WorldState: Alps"
const ALPS_VIEW = {
    center: [46.5, 9.5],
    zoom: 8
};

let map;
let resortsLayer;
let connectionsLayer;
let cyberLayer;
let eventMarkers = {};


/**
 * Initialize Leaflet Map
 */
export function initMap() {
    map = L.map('map', {
        zoomControl: false,
        attributionControl: false
    }).setView(ALPS_VIEW.center, ALPS_VIEW.zoom);

    // Dark Matter Tiles (CartoDB) - perfect for neon overlays
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 16,
        subdomains: 'abcd'
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    resortsLayer = L.layerGroup().addTo(map);
    connectionsLayer = L.layerGroup().addTo(map);
    cyberLayer = L.layerGroup().addTo(map);

}

/**
 * Render Alps Resorts on Map
 */
export function renderResorts(resorts) {
    resortsLayer.clearLayers();

    resorts.forEach(resort => {
        // Custom Icon with Neon Glow
        const icon = L.divIcon({
            className: 'resort-pin',
            html: `<div class="resort-marker" data-id="${resort.id}">
               <span>${resort.name}</span>
             </div>`
        });

        const marker = L.marker(resort.coords, { icon }).addTo(resortsLayer);

        // Simple popup for now, Dashboard will handle details
        marker.bindPopup(`
      <div style="color:#000">
        <strong>${resort.name}</strong><br>
        Temp: ${resort.stats.temp}°C<br>
        Lifts: ${resort.stats.lifts_open}/${resort.stats.lifts_total}
      </div>
    `);

        // Click handler to open dashboard (dispatched via event)
        marker.on('click', () => {
            window.dispatchEvent(new CustomEvent('resort-selected', { detail: resort.id }));
        });
    });
}

/**
 * Handle Real-Time Ski Events
 */
export function handleMapEvent(event) {
    const { coords, type, severity } = event;

    // Create pulse marker
    const color = getEventColor(type);
    const pulseIcon = L.divIcon({
        className: `event-pulse ${severity}`,
        html: `<div class="pulse-ring" style="border-color:${color}"></div>
           <div class="pulse-core" style="background:${color}"></div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const marker = L.marker(coords, { icon: pulseIcon }).addTo(map);

    // Auto-remove after 10s
    setTimeout(() => {
        map.removeLayer(marker);
    }, 10000);
}

/**
 * Toggle Cyber Layer (with onboarding)
 */
export async function toggleCyberLayer(enabled) {
    if (enabled && cyberOnboarding.shouldShow()) {
        const accepted = await cyberOnboarding.show();
        if (!accepted) {
            return false; // User declined
        }
    }

    if (enabled) {
        if (!map.hasLayer(cyberLayer)) {
            map.addLayer(cyberLayer);
        }
    } else {
        if (map.hasLayer(cyberLayer)) {
            map.removeLayer(cyberLayer);
        }
    }
    return true;
}

/**
 * Handle Cyber Threat Events
 */
export function handleCyberEvent(event) {
    if (!map.hasLayer(cyberLayer)) return;

    const { location, subtype, severity } = event;
    const coords = [location.lat, location.lng];

    const icon = L.divIcon({
        className: `cyber-marker cyber-marker--${subtype === 'c2_server' ? 'c2' : 'malware'}`,
        html: `
            <div class="marker-pulse"></div>
            <div class="marker-icon">${subtype === 'c2_server' ? '🔴' : '🟣'}</div>
        `,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
    });

    const marker = L.marker(coords, { icon }).addTo(cyberLayer);

    // Create detailed popup
    const popupContent = createCyberPopupContent(event);
    marker.bindPopup(popupContent, {
        className: 'cyber-popup',
        maxWidth: 320,
        closeButton: false
    });

    // Auto-open if critical
    if (severity === 'critical') {
        marker.openPopup();
    }

    // Auto-remove after 5 minutes (threats are transient)
    setTimeout(() => {
        if (cyberLayer.hasLayer(marker)) {
            cyberLayer.removeLayer(marker);
        }
    }, 5 * 60 * 1000);
}

function createCyberPopupContent(event) {
    const { title, message, technical, educational, protection } = event;

    // Convert technical details to DL
    const techDetails = Object.entries(technical).map(([key, val]) =>
        `<dt>${key}</dt><dd>${val}</dd>`
    ).join('');

    return `
        <div class="popup-cyber">
            <div class="popup-header">
                <h3>${title}</h3>
                <span class="popup-badge--high">HIGH SEVERITY</span>
            </div>
            <p>${message}</p>
            
            <div class="popup-educational">
                <h4>🎓 Was bedeutet das?</h4>
                <p>${educational.what}</p>
            </div>

            <details class="popup-technical">
                <summary>Technische Details anzeigen</summary>
                <dl>${techDetails}</dl>
            </details>

            <button class="popup-btn--guide" onclick="showProtectionGuide('${event.subtype}')">
                🛡️ Schutzmaßnahmen ansehen
            </button>
        </div>
    `;
}


/**
 * Helper: Get color for event type
 */
function getEventColor(type) {
    switch (type) {
        case 'powder_alert': return '#13ecec'; // Cyan
        case 'lift_closure': return '#ef4444'; // Red
        case 'grooming_report': return '#3b82f6'; // Blue
        case 'avalanche_warning': return '#f97316'; // Orange
        default: return '#8b5cf6'; // Purple
    }
}

/**
 * Fly to a specific resort
 */
export function flyToResort(coords) {
    map.flyTo(coords, 13, { duration: 1.5 });
}
