/**
 * WorldState — Map View (App Mode)
 * Floating layer pills + "Live jetzt" card overlay on the Leaflet map
 */

import { EventStore } from '../event-store.js';

const LAYER_PILLS = [
    { id: 'weather', icon: '🌩', label: 'Wetter', active: true },
    { id: 'economy', icon: '📈', label: 'Wirtschaft', active: false },
    { id: 'conflict', icon: '⚔️', label: 'Konflikte', active: false },
    { id: 'traffic', icon: '🚗', label: 'Verkehr', active: false },
    { id: 'trends', icon: '🔥', label: 'Trends', active: false }
];

const SEV_COLORS = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626'
};

const TYPE_ICONS = {
    urban_growth: '🏗',
    weather: '🌦',
    conflict: '⚔',
    infrastructure: '⚡',
    disaster: '🌋',
    protest: '✊',
    weather: '🌩'
};

export class MapView {
    constructor(worldMap) {
        this.worldMap = worldMap;
        this.el = null;
        this._updateInterval = null;
    }

    render(container) {
        this.el = container;
        this.el.classList.add('map-view');

        // Move the existing map container into this view
        const mapContainer = document.getElementById('map-container');
        if (mapContainer) {
            this.el.appendChild(mapContainer);
            mapContainer.style.display = '';
        }

        // Floating layer pills
        const pillBar = document.createElement('div');
        pillBar.className = 'layer-pill-bar';
        LAYER_PILLS.forEach(pill => {
            const btn = document.createElement('button');
            btn.className = `layer-pill${pill.active ? ' active' : ''}`;
            btn.innerHTML = `${pill.icon} ${pill.label}`;
            btn.addEventListener('click', () => {
                btn.classList.toggle('active');
            });
            pillBar.appendChild(btn);
        });
        this.el.appendChild(pillBar);

        // "Live jetzt" card
        const liveCard = document.createElement('div');
        liveCard.className = 'live-now-card';
        liveCard.id = 'live-now-card';
        liveCard.innerHTML = `
            <div class="live-now-header">
                <span class="live-dot"></span>
                <span>Live jetzt</span>
            </div>
            <div class="live-now-items" id="live-now-items"></div>
        `;
        this.el.appendChild(liveCard);

        // Refresh the map size
        setTimeout(() => {
            this.worldMap.map.invalidateSize();
        }, 100);

        // Listen for new events
        EventStore.onEvent(() => this._updateLiveCard());
        this._updateLiveCard();

        // Periodic refresh
        this._updateInterval = setInterval(() => this._updateLiveCard(), 5000);
    }

    _updateLiveCard() {
        const itemsEl = document.getElementById('live-now-items');
        if (!itemsEl) return;

        const recent = EventStore.getRecent(3);
        if (recent.length === 0) {
            itemsEl.innerHTML = '<div class="live-now-empty">Warte auf Events…</div>';
            return;
        }

        itemsEl.innerHTML = recent.map(event => {
            const icon = TYPE_ICONS[event.type] || '📍';
            const location = event.metadata.city || event.metadata.location || 'Unbekannt';
            const message = event.metadata.message || '';
            const sevColor = SEV_COLORS[event.severity] || SEV_COLORS.low;
            const shortMsg = message.length > 50 ? message.slice(0, 50) + '…' : message;

            return `
                <div class="live-now-item" data-event-id="${event.id}">
                    <span class="live-now-icon">${icon}</span>
                    <div class="live-now-text">
                        <strong>${location}</strong>
                        <span>${shortMsg}</span>
                        ${event.source ? `<span class="live-now-source">📎 ${event.source.name}</span>` : ''}
                    </div>
                    <span class="live-now-sev" style="background:${sevColor}"></span>
                </div>
            `;
        }).join('');

        // Click to fly
        itemsEl.querySelectorAll('.live-now-item').forEach(item => {
            item.addEventListener('click', () => {
                const id = item.dataset.eventId;
                const event = EventStore.getAll().find(e => e.id === id);
                if (event) {
                    this.worldMap.flyToEvent(event.coords, 8);
                }
            });
        });
    }

    _onShow() {
        setTimeout(() => {
            this.worldMap.map.invalidateSize();
        }, 100);
    }
}
