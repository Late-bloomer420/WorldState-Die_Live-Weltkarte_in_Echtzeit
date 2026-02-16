/**
 * WorldState — Leaflet Map Module
 * Handles map initialization, layer management, and marker/polygon rendering
 */

// ── Tile Layers ──────────────────────────────────────
const TILE_LAYERS = {
    dark: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
    },
    darkNoLabels: {
        url: 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png',
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
    }
};

// ── Region Presets ───────────────────────────────────
export const REGION_PRESETS = {
    global: { center: [25, 10], zoom: 2, label: '🌍 Global' },
    europe: { center: [50, 15], zoom: 4, label: '🇪🇺 Europe' },
    mena: { center: [28, 42], zoom: 4, label: '🕌 MENA' },
    asia: { center: [30, 105], zoom: 3, label: '🌏 Asia' },
    americas: { center: [15, -80], zoom: 3, label: '🌎 Americas' },
    africa: { center: [5, 20], zoom: 3, label: '🌍 Africa' },
    oceania: { center: [-25, 140], zoom: 4, label: '🏝 Oceania' }
};

// ── Severity Colors ──────────────────────────────────
const SEV_COLORS = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626'
};

// ── Event Type Colors ────────────────────────────────
const TYPE_COLORS = {
    urban_growth: '#06b6d4',
    weather: '#38bdf8',
    conflict: '#ef4444',
    infrastructure: '#f59e0b',
    disaster: '#a855f7',
    protest: '#ec4899'
};

const TYPE_ICONS = {
    urban_growth: '🏗',
    weather: '🌦',
    conflict: '⚔',
    infrastructure: '⚡',
    disaster: '🌋',
    protest: '✊'
};

// ── Map Class ────────────────────────────────────────
export class WorldMap {
    constructor(containerId) {
        this.map = L.map(containerId, {
            center: [25, 10],
            zoom: 2,
            minZoom: 2,
            maxZoom: 16,
            zoomControl: true,
            preferCanvas: true,
            worldCopyJump: true
        });

        // Base tile layer
        L.tileLayer(TILE_LAYERS.dark.url, {
            attribution: TILE_LAYERS.dark.attribution,
            maxZoom: 19,
            subdomains: 'abcd'
        }).addTo(this.map);

        // Layer groups
        this.layers = {
            urban_growth: L.layerGroup().addTo(this.map),
            weather: L.layerGroup().addTo(this.map),
            conflict: L.layerGroup().addTo(this.map),
            infrastructure: L.layerGroup().addTo(this.map),
            disaster: L.layerGroup().addTo(this.map),
            protest: L.layerGroup().addTo(this.map),
            gub_boundaries: L.layerGroup().addTo(this.map)
        };

        // Active layers state
        this.activeLayers = new Set(Object.keys(this.layers));

        // Event markers index
        this.markers = new Map();

        // Move zoom control
        this.map.zoomControl.setPosition('topright');
    }

    /**
     * Render GUB urban boundary polygons
     */
    renderGubBoundaries(regions) {
        this.layers.gub_boundaries.clearLayers();

        regions.forEach(region => {
            const growth = region.imperviousKm2;
            const growthRate = ((growth.y2024 - growth.y2000) / growth.y2000 * 100).toFixed(0);
            const intensity = Math.min(growthRate / 200, 1); // 0-1 based on growth

            // Polygon color: cyan → magenta based on growth intensity
            const hue = 180 - intensity * 120; // 180 (cyan) → 60 → 0 (red)
            const color = `hsl(${hue}, 80%, 55%)`;
            const fillColor = `hsla(${hue}, 70%, 45%, 0.25)`;

            const polygon = L.polygon(region.polygon, {
                color,
                fillColor,
                fillOpacity: 0.25,
                weight: 2,
                dashArray: '6,4',
                className: 'gub-polygon'
            });

            // Tooltip with GUB data
            const tooltipHtml = `
        <div style="line-height:1.6">
          <strong style="font-size:13px">${region.name}</strong><br/>
          <span style="color:#94a3b8">${region.country}</span><br/>
          <span style="color:#06b6d4">Pop:</span> ${(region.population / 1e6).toFixed(1)}M<br/>
          <span style="color:#06b6d4">Urban:</span> ${growth.y2024.toLocaleString()} km²<br/>
          <span style="color:${intensity > 0.5 ? '#ef4444' : '#22c55e'}">Growth:</span> +${growthRate}% (2000→2024)
        </div>
      `;

            polygon.bindTooltip(tooltipHtml, {
                className: 'gub-tooltip',
                sticky: true,
                direction: 'right',
                offset: [10, 0]
            });

            polygon.on('mouseover', () => {
                polygon.setStyle({ fillOpacity: 0.45, weight: 3 });
            });

            polygon.on('mouseout', () => {
                polygon.setStyle({ fillOpacity: 0.25, weight: 2 });
            });

            this.layers.gub_boundaries.addLayer(polygon);
        });
    }

    /**
     * Add a real-time event marker to the map
     */
    addEvent(event) {
        const layerGroup = this.layers[event.type];
        if (!layerGroup) return;

        const color = TYPE_COLORS[event.type] || '#3b82f6';
        const sevColor = SEV_COLORS[event.severity] || SEV_COLORS.low;
        const icon = TYPE_ICONS[event.type] || '📍';
        const size = event.severity === 'critical' ? 16 : event.severity === 'high' ? 14 : 12;

        // Create circle marker with pulsing effect for high/critical
        const marker = L.circleMarker([event.coords[0], event.coords[1]], {
            radius: size * 0.6,
            color: sevColor,
            fillColor: color,
            fillOpacity: 0.7,
            weight: 2,
            className: event.severity === 'critical' ? 'marker-pulse' : ''
        });

        // Build popup
        const location = event.metadata.city || event.metadata.location || 'Unknown';
        const message = event.metadata.message || '';
        const time = new Date(event.timestamp).toLocaleTimeString();

        let extraInfo = '';
        if (event.type === 'urban_growth') {
            extraInfo = `
        <div style="margin-top:4px;padding:4px 0;border-top:1px solid rgba(71,85,105,0.3)">
          <span style="color:#94a3b8">Pop:</span> <strong>${(event.metadata.population / 1e6).toFixed(1)}M</strong><br/>
          <span style="color:#94a3b8">Impervious:</span> <strong>${event.metadata.imperviousKm2?.toLocaleString()} km²</strong><br/>
          <span style="color:#94a3b8">Growth:</span> <strong style="color:${color}">${event.metadata.growthRate}</strong>
        </div>
      `;
        } else {
            extraInfo = `
        <div style="margin-top:4px;padding:4px 0;border-top:1px solid rgba(71,85,105,0.3)">
          <span style="color:#94a3b8">Region:</span> <strong>${event.metadata.region || '—'}</strong><br/>
          <span style="color:#94a3b8">Verified:</span> <strong>${event.metadata.verified ? '✓ Yes' : '✗ Pending'}</strong><br/>
          <span style="color:#94a3b8">Sources:</span> <strong>${event.metadata.sources || '—'}</strong>
        </div>
      `;
        }

        const sourceHtml = event.source
            ? `<div class="event-source"><a href="${event.source.url}" target="_blank" rel="noopener" style="color:#00F0FF;font-size:10px;text-decoration:none">📎 ${event.source.name}</a></div>`
            : '';

        const popupHtml = `
      <div class="event-popup">
        <h4>
          ${icon}
          <span>${location}</span>
          <span class="event-type-badge" style="background:${color}22;color:${color}">${event.type.replace('_', ' ')}</span>
        </h4>
        <div class="event-meta">
          ${message}
          ${extraInfo}
        </div>
        <div class="event-time">🕐 ${time}</div>
        ${sourceHtml}
      </div>
    `;

        marker.bindPopup(popupHtml, { maxWidth: 280 });

        // Add to layer
        layerGroup.addLayer(marker);
        this.markers.set(event.id, { marker, layerGroup, event });

        // Auto-remove old markers if too many (keep last 200 per layer)
        const layerMarkers = [...this.markers.entries()]
            .filter(([, v]) => v.layerGroup === layerGroup);
        if (layerMarkers.length > 200) {
            const [oldId, old] = layerMarkers[0];
            old.layerGroup.removeLayer(old.marker);
            this.markers.delete(oldId);
        }

        return marker;
    }

    /**
     * Toggle a layer on/off
     */
    toggleLayer(layerName, visible) {
        const layer = this.layers[layerName];
        if (!layer) return;

        if (visible) {
            this.map.addLayer(layer);
            this.activeLayers.add(layerName);
        } else {
            this.map.removeLayer(layer);
            this.activeLayers.delete(layerName);
        }
    }

    /**
     * Fly to a region preset
     */
    flyToRegion(regionKey) {
        const region = REGION_PRESETS[regionKey];
        if (!region) return;
        this.map.flyTo(region.center, region.zoom, {
            duration: 1.5,
            easeLinearity: 0.4
        });
    }

    /**
     * Fly to specific coordinates
     */
    flyToEvent(coords, zoom = 8) {
        this.map.flyTo(coords, zoom, {
            duration: 1.2,
            easeLinearity: 0.4
        });
    }

    /**
     * Get marker count per layer
     */
    getLayerCounts() {
        const counts = {};
        for (const [name, layer] of Object.entries(this.layers)) {
            counts[name] = layer.getLayers().length;
        }
        return counts;
    }

    /**
     * Clear all events (keep GUB boundaries)
     */
    clearEvents() {
        for (const [name, layer] of Object.entries(this.layers)) {
            if (name !== 'gub_boundaries') {
                layer.clearLayers();
            }
        }
        this.markers.clear();
    }
}
