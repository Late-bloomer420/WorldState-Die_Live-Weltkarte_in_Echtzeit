/**
 * WorldState — Alerts View (App Mode)
 * Severity-sorted alert cards with colored borders
 */

import { EventStore } from '../event-store.js';

const SEV_CONFIG = {
    critical: { color: '#dc2626', label: 'KRITISCH', icon: '🔴', order: 0 },
    high: { color: '#ef4444', label: 'HOCH', icon: '🟠', order: 1 },
    medium: { color: '#f59e0b', label: 'MITTEL', icon: '🟡', order: 2 },
    low: { color: '#22c55e', label: 'NIEDRIG', icon: '🟢', order: 3 }
};

const TYPE_ICONS = {
    urban_growth: '🏗',
    weather: '🌦',
    conflict: '⚔',
    infrastructure: '⚡',
    disaster: '🌋',
    protest: '✊'
};

export class AlertsView {
    constructor() {
        this.el = null;
        this.listEl = null;
        this.pushEnabled = true;
        this.soundEnabled = true;
    }

    render(container) {
        this.el = container;
        this.el.classList.add('alerts-view');

        const alertCount = EventStore.getBySeverity('high', 'critical').length;

        this.el.innerHTML = `
            <div class="view-header">
                <h2 class="view-title">⚠️ Warnungen</h2>
                <button class="view-header-btn">⚙</button>
            </div>

            <div class="alerts-toggles">
                <div class="alert-toggle-row">
                    <span>Push-Benachrichtigungen</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="alert-push-toggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
                <div class="alert-toggle-row">
                    <span>Sound</span>
                    <label class="toggle-switch">
                        <input type="checkbox" id="alert-sound-toggle" checked>
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div class="alerts-counter">
                <span class="alerts-counter-badge">${alertCount}</span>
                Aktive Warnungen
            </div>

            <div class="alerts-list" id="alerts-list"></div>
        `;

        this.listEl = this.el.querySelector('#alerts-list');

        // Listen for new events
        EventStore.onEvent(() => this._renderAlerts());
        this._renderAlerts();
    }

    _renderAlerts() {
        if (!this.listEl) return;

        // Get all events sorted by severity
        const events = EventStore.getAll()
            .filter(e => SEV_CONFIG[e.severity])
            .sort((a, b) => {
                const orderA = SEV_CONFIG[a.severity]?.order ?? 99;
                const orderB = SEV_CONFIG[b.severity]?.order ?? 99;
                return orderA - orderB;
            })
            .slice(0, 30);

        // Update counter
        const counterBadge = this.el?.querySelector('.alerts-counter-badge');
        if (counterBadge) {
            counterBadge.textContent = EventStore.getBySeverity('high', 'critical').length;
        }

        if (events.length === 0) {
            this.listEl.innerHTML = `
                <div class="feed-empty-state">
                    <span class="feed-empty-icon">✅</span>
                    <p>Keine aktiven Warnungen</p>
                </div>
            `;
            return;
        }

        this.listEl.innerHTML = events.map(event => {
            const sev = SEV_CONFIG[event.severity];
            const icon = TYPE_ICONS[event.type] || '📍';
            const location = event.metadata.city || event.metadata.location || 'Unbekannt';
            const message = event.metadata.message || '';
            const time = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' UTC';
            const isCritical = event.severity === 'critical';

            return `
                <div class="alert-card${isCritical ? ' pulse-border' : ''}" style="border-left: 4px solid ${sev.color}">
                    <div class="alert-card-header">
                        <span class="alert-sev-badge" style="background: ${sev.color}20; color: ${sev.color}">
                            ${sev.icon} ${sev.label}
                        </span>
                        <span class="alert-time">${time}</span>
                    </div>
                    <div class="alert-card-body">
                        <strong>${icon} ${location}</strong>
                        <p>${message}</p>
                    </div>
                    ${event.metadata.region ? `<span class="alert-region">📍 ${event.metadata.region}</span>` : ''}
                    ${event.source ? `
                    <div class="source-info compact">
                        <div class="source-badge" style="border-color:${event.source.badge?.color || '#00F0FF'}">
                            <span class="badge-icon">${event.source.badge?.icon || '📎'}</span>
                            <span class="badge-label">${event.source.badge?.label || 'Quelle'}</span>
                        </div>
                        <span class="source-freshness-inline">${event.source.updateFrequency || ''}</span>
                        <a class="source-link" href="${event.source.url}" target="_blank" rel="noopener">📎 ${event.source.name}</a>
                    </div>` : ''}
                </div>
            `;
        }).join('');
    }
}
