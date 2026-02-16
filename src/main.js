
import './style.css';
import { initMap, renderResorts, handleMapEvent, flyToResort, handleCyberEvent } from './map.js';
import protectionGuide from './protection-guide.js';

import { connectWebSocket } from './websocket.js';
import { addEventToFeed } from './sidebar.js';
import { initControls } from './controls.js';
import { initDashboard, updateDashboard } from './dashboard.js';

let appState = {
    resorts: []
};

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏔 WorldState: Alps Edition — Initializing...');

    // 1. Init Map
    initMap();

    // 2. Init UI Components
    initControls();
    initDashboard();

    // 3. Connect to Real-Time Server
    connectWebSocket({
        onInit: (data) => {
            console.log('✅ Connected to Alps Server', data);
            appState.resorts = data.resorts;
            renderResorts(data.resorts);
            // Populate dashboard with all resorts
            updateDashboard(data.resorts);
        },
        onEvent: (event) => {
            // Add to feed
            addEventToFeed(event);
            // Show on map
            if (event.type === 'cyber') {
                handleCyberEvent(event);
            } else {
                handleMapEvent(event);
            }
        },

        onStatus: (status) => {
            console.log('WS Status:', status);
        }
    });

    // 4. Handle Interactions
    window.addEventListener('resort-selected', (e) => {
        const resortId = e.detail;
        // Open dashboard
        const dashboard = document.getElementById('dashboard-panel');
        if (dashboard) dashboard.classList.add('open');

        // Find resort logic could go here to highlight card
        console.log('Resort selected:', resortId);
    });

    // Handle "Fly To" from feed clicks
    window.addEventListener('map-fly-to', (e) => {
        flyToResort(e.detail);
    });

    // Expose protection guide global
    window.showProtectionGuide = (type) => protectionGuide.show(type);

});
