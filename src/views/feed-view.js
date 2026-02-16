/**
 * WorldState — Feed View (App Mode)
 * Full-screen scrollable real-time event feed with category filters
 */

import { EventStore } from '../event-store.js';

const CATEGORIES = [
    { id: 'all', label: 'Alle', active: true },
    { id: 'weather', label: 'Wetter', types: ['disaster'] },
    { id: 'economy', label: 'Wirtschaft', types: ['infrastructure'] },
    { id: 'politics', label: 'Politik', types: ['conflict'] },
    { id: 'traffic', label: 'Verkehr', types: ['urban_growth'] },
    { id: 'weather', label: 'Wetter', types: ['weather'] },
    { id: 'social', label: 'Social', types: ['protest'] }
];

const TYPE_ICONS = {
    urban_growth: '🏗',
    weather: '🌦',
    conflict: '⚔',
    infrastructure: '⚡',
    disaster: '🌋',
    protest: '✊',
    weather: '🌩'
};

const TYPE_LABELS = {
    urban_growth: 'Verkehr',
    weather: 'Wetter',
    conflict: 'Politik',
    infrastructure: 'Wirtschaft',
    disaster: 'Wetter',
    protest: 'Social'
};

const SEV_COLORS = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444',
    critical: '#dc2626'
};

const TYPE_GLOW = {
    urban_growth: '0 0 20px rgba(6, 182, 212, 0.15)',
    weather: '0 0 20px rgba(56, 189, 248, 0.15)',
    conflict: '0 0 20px rgba(239, 68, 68, 0.15)',
    infrastructure: '0 0 20px rgba(245, 158, 11, 0.15)',
    disaster: '0 0 20px rgba(168, 85, 247, 0.15)',
    protest: '0 0 20px rgba(236, 72, 153, 0.15)'
};

export class FeedView {
    constructor(onEventClick) {
        this.onEventClick = onEventClick;
        this.el = null;
        this.listEl = null;
        this.activeCategory = 'all';
    }

    render(container) {
        this.el = container;
        this.el.classList.add('feed-view');

        this.el.innerHTML = `
            <div class="view-header">
                <h2 class="view-title">
                    <span class="live-dot"></span>
                    Live Feed
                </h2>
                <button class="view-header-btn" id="feed-filter-btn">
                    <span>⚙</span>
                </button>
            </div>
            <div class="category-chips" id="feed-category-chips"></div>
            <div class="feed-scroll-list" id="app-feed-list"></div>
        `;

        // Render category chips
        const chipsEl = this.el.querySelector('#feed-category-chips');
        CATEGORIES.forEach(cat => {
            const chip = document.createElement('button');
            chip.className = `category-chip${cat.active ? ' active' : ''}`;
            chip.textContent = cat.label;
            chip.dataset.category = cat.id;
            chip.addEventListener('click', () => {
                chipsEl.querySelectorAll('.category-chip').forEach(c => c.classList.remove('active'));
                chip.classList.add('active');
                this.activeCategory = cat.id;
                this._renderFeed();
            });
            chipsEl.appendChild(chip);
        });

        this.listEl = this.el.querySelector('#app-feed-list');

        // Listen for new events
        EventStore.onEvent(() => this._renderFeed());
        this._renderFeed();
    }

    _getFilteredEvents() {
        if (this.activeCategory === 'all') return EventStore.getAll();
        const cat = CATEGORIES.find(c => c.id === this.activeCategory);
        if (!cat || !cat.types) return EventStore.getAll();
        return EventStore.getAll().filter(e => cat.types.includes(e.type));
    }

    _renderFeed() {
        if (!this.listEl) return;
        const events = this._getFilteredEvents().slice(0, 50);

        if (events.length === 0) {
            this.listEl.innerHTML = `
                <div class="feed-empty-state">
                    <span class="feed-empty-icon">📡</span>
                    <p>Warte auf Events…</p>
                </div>
            `;
            return;
        }

        this.listEl.innerHTML = events.map(event => {
            const icon = TYPE_ICONS[event.type] || '📍';
            const typeLabel = TYPE_LABELS[event.type] || event.type;
            const location = event.metadata.city || event.metadata.location || 'Unbekannt';
            const message = event.metadata.message || '';
            const sevColor = SEV_COLORS[event.severity] || SEV_COLORS.low;
            const glow = TYPE_GLOW[event.type] || '';
            const time = this._timeAgo(event.timestamp);
            const isLive = event.severity === 'critical';

            return `
                <div class="feed-card" data-event-id="${event.id}" style="box-shadow: ${glow}">
                    <div class="feed-card-top">
                        <span class="feed-card-type">
                            ${icon} ${typeLabel}
                        </span>
                        ${isLive ? '<span class="feed-card-live">LIVE</span>' : ''}
                        <span class="feed-card-time">${time}</span>
                    </div>
                    <div class="feed-card-body">
                        <strong>${location}</strong>
                        <p>${message}</p>
                    </div>
                    <div class="feed-card-footer">
                        <span class="feed-card-sev-bar" style="background:${sevColor}"></span>
                        <span class="feed-card-source">
                            ${event.metadata.verified ? '✓ Verifiziert' : '⏳ Prüfung'}
                        </span>
                    </div>
                    ${event.source ? `
                    <div class="source-info">
                        <div class="source-badge" style="border-color:${event.source.badge?.color || '#00F0FF'}">
                            <span class="badge-icon">${event.source.badge?.icon || '📎'}</span>
                            <span class="badge-label">${event.source.badge?.label || 'Quelle'}</span>
                        </div>
                        <div class="source-freshness">
                            <span class="freshness-label">Aktualisierung:</span>
                            <span class="freshness-value">${event.source.updateFrequency || '—'}</span>
                        </div>
                        <a class="source-link" href="${event.source.url}" target="_blank" rel="noopener">
                            📎 ${event.source.name}
                        </a>
                    </div>` : ''}
                </div>
            `;
        }).join('');

        // Click handlers
        this.listEl.querySelectorAll('.feed-card').forEach(card => {
            card.addEventListener('click', () => {
                const id = card.dataset.eventId;
                const event = EventStore.getAll().find(e => e.id === id);
                if (event && this.onEventClick) {
                    this.onEventClick(event);
                }
            });
        });
    }

    _timeAgo(timestamp) {
        const diff = Date.now() - new Date(timestamp).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'jetzt';
        if (mins < 60) return `vor ${mins} Min`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `vor ${hrs} Std`;
        return `vor ${Math.floor(hrs / 24)} Tagen`;
    }
}
