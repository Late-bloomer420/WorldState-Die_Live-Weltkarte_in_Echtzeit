
/**
 * Sidebar / Event Feed Module
 * Handles real-time event list updates
 */

const feedList = document.getElementById('feed-list');
const MAX_FEED_ITEMS = 50;

/**
 * Add a new event to the feed
 */
export function addEventToFeed(event) {
    if (!feedList) return;

    const item = createEventItem(event);
    feedList.prepend(item);

    // Animate entry
    requestAnimationFrame(() => {
        item.style.opacity = '1';
        item.style.transform = 'translateX(0)';
    });

    // Prune old events
    if (feedList.children.length > MAX_FEED_ITEMS) {
        feedList.removeChild(feedList.lastChild);
    }
}

/**
 * Create DOM element for event
 */
function createEventItem(event) {
    const div = document.createElement('div');
    div.className = `feed-item ${event.type}`;
    div.style.opacity = '0';
    div.style.transform = 'translateX(-20px)';

    // Format timestamp (just time for simplicity)
    const time = new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Badge Text Map
    const badges = {
        'powder_alert': 'POWDER',
        'lift_closure': 'CLOSED',
        'grooming_report': 'GROOMED',
        'avalanche_warning': 'WARNING'
    };

    div.innerHTML = `
    <span class="feed-timestamp">${time}</span>
    <span class="feed-badge">${badges[event.type] || 'EVENT'}</span>
    <div class="feed-msg">${event.metadata.message}</div>
    <div class="feed-loc">
      <span>📍 ${event.metadata.resortName}</span>
    </div>
  `;

    // Click to zoom
    div.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('map-fly-to', { detail: event.coords }));
    });

    return div;
}

/**
 * Clear all events
 */
export function clearFeed() {
    if (feedList) feedList.innerHTML = '';
}
