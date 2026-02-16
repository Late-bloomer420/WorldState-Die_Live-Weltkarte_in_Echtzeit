/**
 * ══════════════════════════════════════════════════════════════════
 *  WorldState API Fetcher — Real Data Integration
 * ══════════════════════════════════════════════════════════════════
 *
 *  PRIVACY: All requests are anonymous public API queries.
 *  No user data, no API keys for primary sources, no tracking.
 *
 *  APIs:
 *  - USGS Earthquake Hazards (zero auth, GeoJSON)
 *  - Open-Meteo Weather (zero auth, JSON)
 * ══════════════════════════════════════════════════════════════════
 */

import { RELIABILITY_BADGES } from './data/gub-regions.js';

// ── Weather code → human-readable mapping (WMO standard) ────────
const WMO_WEATHER_CODES = {
    0: { desc: 'Klar', icon: '☀️', severity: 'low' },
    1: { desc: 'Überwiegend klar', icon: '🌤', severity: 'low' },
    2: { desc: 'Teilweise bewölkt', icon: '⛅', severity: 'low' },
    3: { desc: 'Bewölkt', icon: '☁️', severity: 'low' },
    45: { desc: 'Nebel', icon: '🌫', severity: 'medium' },
    48: { desc: 'Reifnebel', icon: '🌫', severity: 'medium' },
    51: { desc: 'Leichter Nieselregen', icon: '🌦', severity: 'low' },
    53: { desc: 'Nieselregen', icon: '🌦', severity: 'low' },
    55: { desc: 'Starker Nieselregen', icon: '🌧', severity: 'medium' },
    61: { desc: 'Leichter Regen', icon: '🌧', severity: 'low' },
    63: { desc: 'Regen', icon: '🌧', severity: 'medium' },
    65: { desc: 'Starkregen', icon: '🌧', severity: 'high' },
    66: { desc: 'Gefrierender Regen', icon: '🧊', severity: 'high' },
    67: { desc: 'Starker Gefrierender Regen', icon: '🧊', severity: 'critical' },
    71: { desc: 'Leichter Schneefall', icon: '🌨', severity: 'medium' },
    73: { desc: 'Schneefall', icon: '🌨', severity: 'medium' },
    75: { desc: 'Starker Schneefall', icon: '❄️', severity: 'high' },
    77: { desc: 'Schneegriesel', icon: '🌨', severity: 'medium' },
    80: { desc: 'Leichte Regenschauer', icon: '🌦', severity: 'low' },
    81: { desc: 'Regenschauer', icon: '🌧', severity: 'medium' },
    82: { desc: 'Heftige Regenschauer', icon: '⛈', severity: 'high' },
    85: { desc: 'Leichte Schneeschauer', icon: '🌨', severity: 'medium' },
    86: { desc: 'Starke Schneeschauer', icon: '❄️', severity: 'high' },
    95: { desc: 'Gewitter', icon: '⛈', severity: 'high' },
    96: { desc: 'Gewitter mit Hagel', icon: '⛈', severity: 'critical' },
    99: { desc: 'Schweres Gewitter mit Hagel', icon: '⛈', severity: 'critical' }
};

// ── Well-known global cities for weather sampling ────────────────
const WEATHER_LOCATIONS = [
    { name: 'Berlin', lat: 52.52, lng: 13.40, region: 'Europa' },
    { name: 'London', lat: 51.51, lng: -0.13, region: 'Europa' },
    { name: 'Paris', lat: 48.86, lng: 2.35, region: 'Europa' },
    { name: 'New York', lat: 40.71, lng: -74.01, region: 'Nordamerika' },
    { name: 'Tokyo', lat: 35.68, lng: 139.69, region: 'Ostasien' },
    { name: 'Sydney', lat: -33.87, lng: 151.21, region: 'Ozeanien' },
    { name: 'São Paulo', lat: -23.55, lng: -46.63, region: 'Südamerika' },
    { name: 'Mumbai', lat: 19.08, lng: 72.88, region: 'Südasien' },
    { name: 'Dubai', lat: 25.20, lng: 55.27, region: 'Naher Osten' },
    { name: 'Nairobi', lat: -1.29, lng: 36.82, region: 'Ostafrika' },
    { name: 'Mexico City', lat: 19.43, lng: -99.13, region: 'Nordamerika' },
    { name: 'Shanghai', lat: 31.23, lng: 121.47, region: 'Ostasien' },
    { name: 'Moscow', lat: 55.76, lng: 37.62, region: 'Osteuropa' },
    { name: 'Lagos', lat: 6.52, lng: 3.38, region: 'Westafrika' },
    { name: 'Jakarta', lat: -6.21, lng: 106.85, region: 'Südostasien' },
    { name: 'Cairo', lat: 30.04, lng: 31.24, region: 'Nordafrika' }
];

// ── Cache with TTL ──────────────────────────────────────────────
class TTLCache {
    constructor() {
        this.store = new Map();
    }

    get(key) {
        const entry = this.store.get(key);
        if (!entry) return null;
        if (Date.now() > entry.expires) {
            this.store.delete(key);
            return null;
        }
        return entry.data;
    }

    set(key, data, ttlMs) {
        this.store.set(key, { data, expires: Date.now() + ttlMs });
    }

    get size() { return this.store.size; }
}

// ── API Fetcher ─────────────────────────────────────────────────
export class APIFetcher {
    constructor() {
        this.cache = new TTLCache();
        this.stats = {
            earthquakeFetches: 0,
            weatherFetches: 0,
            errors: 0,
            lastEarthquakeFetch: null,
            lastWeatherFetch: null
        };
    }

    /**
     * Fetch real earthquake data from USGS
     * Returns: array of WorldState-formatted disaster events
     * Cache TTL: 5 minutes
     */
    async fetchEarthquakes() {
        const cacheKey = 'usgs-earthquakes';
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        try {
            const startTime = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
            const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTime}&minmagnitude=2.5&limit=50&orderby=time`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`USGS API: ${response.status}`);

            const geojson = await response.json();
            const badge = RELIABILITY_BADGES.scientific;

            const events = geojson.features.map(f => {
                const [lng, lat, depth] = f.geometry.coordinates;
                const mag = f.properties.mag;
                const place = f.properties.place || 'Unknown location';

                let severity = 'low';
                if (mag >= 7.0) severity = 'critical';
                else if (mag >= 5.0) severity = 'high';
                else if (mag >= 4.0) severity = 'medium';

                return {
                    id: `usgs-${f.id}`,
                    type: 'disaster',
                    severity,
                    coords: [lat, lng],
                    timestamp: new Date(f.properties.time).toISOString(),
                    source: {
                        name: 'USGS Earthquake Hazards',
                        url: 'https://earthquake.usgs.gov/',
                        updateFrequency: 'Echtzeit',
                        reliability: 'scientific',
                        lastVerified: new Date().toISOString().split('T')[0],
                        badge: { label: badge.label, icon: badge.icon, color: badge.color },
                        live: true
                    },
                    metadata: {
                        location: place,
                        region: this._extractRegion(place),
                        message: `Erdbeben M${mag.toFixed(1)} — ${place} (Tiefe: ${depth?.toFixed(0) || '?'} km)`,
                        magnitude: mag,
                        depth: depth,
                        verified: true,
                        sources: 1,
                        usgsUrl: f.properties.url
                    }
                };
            });

            this.cache.set(cacheKey, events, 5 * 60 * 1000); // 5 min TTL
            this.stats.earthquakeFetches++;
            this.stats.lastEarthquakeFetch = new Date().toISOString();
            console.log(`[API] USGS: ${events.length} earthquakes fetched (M2.5+, 24h)`);
            return events;

        } catch (err) {
            console.error(`[API] USGS fetch failed: ${err.message}`);
            this.stats.errors++;
            return [];
        }
    }

    /**
     * Fetch real weather for a random world city from Open-Meteo
     * Returns: a single WorldState-formatted weather event
     * Cache TTL: 30 minutes per location
     */
    async fetchWeatherEvent() {
        const location = WEATHER_LOCATIONS[Math.floor(Math.random() * WEATHER_LOCATIONS.length)];
        const cacheKey = `weather-${location.name}`;
        const cached = this.cache.get(cacheKey);
        if (cached) return cached;

        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${location.lat}&longitude=${location.lng}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&timezone=auto`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`Open-Meteo: ${response.status}`);

            const data = await response.json();
            const current = data.current;

            const weatherCode = current.weather_code;
            const weatherInfo = WMO_WEATHER_CODES[weatherCode] || WMO_WEATHER_CODES[0];
            const temp = current.temperature_2m;
            const wind = current.wind_speed_10m;
            const humidity = current.relative_humidity_2m;

            // Adjust severity based on extreme conditions
            let severity = weatherInfo.severity;
            if (temp > 40) severity = 'critical';
            else if (temp > 35) severity = 'high';
            else if (temp < -15) severity = 'high';
            else if (temp < -25) severity = 'critical';
            if (wind > 100) severity = 'critical';
            else if (wind > 60) severity = 'high';

            const badge = RELIABILITY_BADGES.scientific;

            const event = {
                id: `weather-${location.name.toLowerCase()}-${Date.now()}`,
                type: 'weather',
                severity,
                coords: [location.lat, location.lng],
                timestamp: new Date().toISOString(),
                source: {
                    name: 'Open-Meteo (ECMWF/DWD)',
                    url: 'https://open-meteo.com/',
                    updateFrequency: 'Echtzeit',
                    reliability: 'scientific',
                    lastVerified: new Date().toISOString().split('T')[0],
                    badge: { label: badge.label, icon: badge.icon, color: badge.color },
                    live: true
                },
                metadata: {
                    location: location.name,
                    region: location.region,
                    message: `${weatherInfo.icon} ${location.name}: ${weatherInfo.desc} — ${temp}°C, Wind ${wind} km/h, Luftfeuchtigkeit ${humidity}%`,
                    temperature: temp,
                    windSpeed: wind,
                    humidity: humidity,
                    weatherCode: weatherCode,
                    weatherIcon: weatherInfo.icon,
                    weatherDescription: weatherInfo.desc,
                    verified: true,
                    sources: 1
                }
            };

            this.cache.set(cacheKey, event, 30 * 60 * 1000); // 30 min TTL
            this.stats.weatherFetches++;
            this.stats.lastWeatherFetch = new Date().toISOString();
            console.log(`[API] Open-Meteo: ${location.name} → ${temp}°C, ${weatherInfo.desc}`);
            return event;

        } catch (err) {
            console.error(`[API] Open-Meteo fetch failed (${location.name}): ${err.message}`);
            this.stats.errors++;
            return null;
        }
    }

    /**
     * Get a random real earthquake event from cached data
     */
    async getRandomEarthquake() {
        const earthquakes = await this.fetchEarthquakes();
        if (earthquakes.length === 0) return null;
        return earthquakes[Math.floor(Math.random() * earthquakes.length)];
    }

    /**
     * Get API health stats (no user data, only aggregate metrics)
     */
    getStats() {
        return {
            ...this.stats,
            cacheSize: this.cache.size
        };
    }

    /**
     * Extract rough region from USGS place string
     */
    _extractRegion(place) {
        if (!place) return 'Unbekannt';
        // USGS format: "123 km SSE of City, Country"
        const parts = place.split(', ');
        return parts.length > 1 ? parts[parts.length - 1] : place;
    }
}
