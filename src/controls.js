/**
 * WorldState — Control Panel
 * Layer toggles, time filters, and region preset buttons
 */

import { REGION_PRESETS } from './map.js';

// ── Layer Definitions ────────────────────────────────
const LAYER_DEFS = [
    { id: 'gub_boundaries', label: 'GUB Boundaries', color: '#06b6d4', icon: '🗺' },
    { id: 'urban_growth', label: 'Urban Growth', color: '#06b6d4', icon: '🏗' },
    { id: 'weather', label: 'Weather', color: '#38bdf8', icon: '🌦' },
    { id: 'conflict', label: 'Conflicts', color: '#ef4444', icon: '⚔' },
    { id: 'infrastructure', label: 'Infrastructure', color: '#f59e0b', icon: '⚡' },
    { id: 'disaster', label: 'Disasters', color: '#a855f7', icon: '🌋' },
    { id: 'protest', label: 'Protests', color: '#ec4899', icon: '✊' }
];

// ── Time Filters ─────────────────────────────────────
const TIME_FILTERS = [
    { id: '1h', label: '1H' },
    { id: '6h', label: '6H' },
    { id: '24h', label: '24H', default: true },
    { id: '7d', label: '7D' }
];

export class ControlPanel {
    constructor(worldMap) {
        this.worldMap = worldMap;
        this.activeTimeFilter = '24h';
        this.activeRegion = 'global';
        this.onLayerToggle = null; // callback

        this._renderLayerToggles();
        this._renderTimeFilters();
        this._renderRegionPresets();
    }

    /**
     * Render layer toggle buttons
     */
    _renderLayerToggles() {
        const container = document.getElementById('layer-toggles');
        if (!container) return;

        LAYER_DEFS.forEach(layer => {
            const btn = document.createElement('button');
            btn.className = 'layer-toggle active';
            btn.dataset.layer = layer.id;
            btn.innerHTML = `
        <span class="layer-toggle-dot" style="color:${layer.color}"></span>
        <span class="layer-toggle-label">${layer.icon} ${layer.label}</span>
        <span class="layer-toggle-count" id="count-${layer.id}">0</span>
      `;

            btn.addEventListener('click', () => {
                const isActive = btn.classList.toggle('active');
                this.worldMap.toggleLayer(layer.id, isActive);
                if (this.onLayerToggle) this.onLayerToggle(layer.id, isActive);
            });

            container.appendChild(btn);
        });
    }

    /**
     * Render time filter buttons
     */
    _renderTimeFilters() {
        const container = document.getElementById('time-filters');
        if (!container) return;

        TIME_FILTERS.forEach(tf => {
            const btn = document.createElement('button');
            btn.className = `time-btn ${tf.default ? 'active' : ''}`;
            btn.textContent = tf.label;
            btn.dataset.time = tf.id;

            btn.addEventListener('click', () => {
                container.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeTimeFilter = tf.id;
                // Time filter is cosmetic in this prototype — events continue streaming
            });

            container.appendChild(btn);
        });
    }

    /**
     * Render region preset buttons
     */
    _renderRegionPresets() {
        const container = document.getElementById('region-presets');
        if (!container) return;

        Object.entries(REGION_PRESETS).forEach(([key, region]) => {
            const btn = document.createElement('button');
            btn.className = `region-btn ${key === 'global' ? 'active' : ''}`;
            btn.textContent = region.label;
            btn.dataset.region = key;

            btn.addEventListener('click', () => {
                container.querySelectorAll('.region-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.activeRegion = key;
                this.worldMap.flyToRegion(key);
            });

            container.appendChild(btn);
        });
    }

    /**
     * Update layer counts in the control panel
     */
    updateCounts(counts) {
        for (const [name, count] of Object.entries(counts)) {
            const el = document.getElementById(`count-${name}`);
            if (el) el.textContent = count;
        }
    }

    /**
     * Update connection status badge
     */
    updateStatus(state) {
        const badge = document.getElementById('status-badge');
        if (!badge) return;

        const dot = badge.querySelector('.status-dot');
        const text = badge.querySelector('.status-text');

        badge.className = 'status-badge';

        switch (state) {
            case 'connected':
                badge.classList.add('connected');
                text.textContent = 'Live';
                break;
            case 'connecting':
                badge.classList.add('reconnecting');
                text.textContent = 'Connecting…';
                break;
            case 'reconnecting':
                badge.classList.add('reconnecting');
                text.textContent = 'Reconnecting…';
                break;
            case 'disconnected':
                badge.classList.add('disconnected');
                text.textContent = 'Disconnected';
                break;
            case 'error':
            case 'failed':
                badge.classList.add('disconnected');
                text.textContent = 'Error';
                break;
        }
    }
}
