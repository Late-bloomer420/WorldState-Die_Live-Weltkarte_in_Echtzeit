/**
 * WorldState — Event Feed Sidebar
 * Renders live events in a scrolling feed with click-to-zoom
 */

const TYPE_ICONS = {
    urban_growth: '🏗',
    weather: '🌦',
    conflict: '⚔',
    infrastructure: '⚡',
    disaster: '🌋',
    protest: '✊'
};

const MAX_FEED_ITEMS = 100;

export class EventFeed {
    constructor(listId, emptyId, clearBtnId) {
        this.listEl = document.getElementById(listId);
        this.emptyEl = document.getElementById(emptyId);
        this.clearBtn = document.getElementById(clearBtnId);
        this.items = [];
        this.onEventClick = null; // callback: (event) => {}

        this.clearBtn?.addEventListener('click', () => this.clear());
    }

    /**
     * Add an event to the top of the feed
     */
    addEvent(event) {
        // Hide empty state
        this.emptyEl?.classList.add('hidden');

        const location = event.metadata.city || event.metadata.location || 'Unknown';
        const message = event.metadata.message || '';
        const time = new Date(event.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        const icon = TYPE_ICONS[event.type] || '📍';

        const itemEl = document.createElement('div');
        itemEl.className = 'feed-item flash-event';
        itemEl.dataset.eventId = event.id;
        itemEl.innerHTML = `
      <div class="feed-item-header">
        <span class="feed-item-type ${event.type}">
          ${icon} ${event.type.replace('_', ' ')}
        </span>
        <span class="feed-item-sev ${event.severity}"></span>
      </div>
      <div class="feed-item-message">${message}</div>
      <div class="feed-item-footer">
        <span class="feed-item-location">📍 ${location}</span>
        <span class="feed-item-time">${time}</span>
      </div>
      ${event.source ? `<a class="feed-item-source" href="${event.source.url}" target="_blank" rel="noopener" title="${event.source.name} — ${event.source.badge?.label || 'Quelle'} — ${event.source.updateFrequency || ''}">${event.source.badge?.icon || '📎'} ${event.source.name} <span class="feed-item-badge" style="color:${event.source.badge?.color || '#00F0FF'}">${event.source.badge?.label || ''}</span></a>` : ''}
    `;

        // Click to fly to event
        itemEl.addEventListener('click', () => {
            if (this.onEventClick) {
                this.onEventClick(event);
            }
        });

        // Prepend to list
        this.listEl.prepend(itemEl);
        this.items.unshift(event);

        // Remove flash class after animation
        setTimeout(() => itemEl.classList.remove('flash-event'), 800);

        // Trim old items
        while (this.items.length > MAX_FEED_ITEMS) {
            this.items.pop();
            const last = this.listEl.lastElementChild;
            if (last) this.listEl.removeChild(last);
        }
    }

    /**
     * Clear all feed items
     */
    clear() {
        this.listEl.innerHTML = '';
        this.items = [];
        this.emptyEl?.classList.remove('hidden');
    }

    /**
     * Get total events count
     */
    get count() {
        return this.items.length;
    }
}
