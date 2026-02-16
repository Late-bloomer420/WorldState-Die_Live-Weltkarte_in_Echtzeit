/**
 * WorldState — Centralized Event Store
 * Shared event storage accessible by all views
 */

const MAX_EVENTS = 500;

class EventStoreClass {
    constructor() {
        this.events = [];
        this.listeners = [];
    }

    add(event) {
        this.events.unshift(event);
        if (this.events.length > MAX_EVENTS) {
            this.events.pop();
        }
        this.listeners.forEach(fn => fn(event, this.events));
    }

    getAll() { return this.events; }

    getRecent(n = 10) { return this.events.slice(0, n); }

    getByType(type) {
        return this.events.filter(e => e.type === type);
    }

    getBySeverity(...levels) {
        return this.events.filter(e => levels.includes(e.severity));
    }

    getAlerts() {
        return this.events.filter(e =>
            e.severity === 'high' || e.severity === 'critical'
        );
    }

    onEvent(callback) {
        this.listeners.push(callback);
    }

    get count() { return this.events.length; }
}

export const EventStore = new EventStoreClass();
