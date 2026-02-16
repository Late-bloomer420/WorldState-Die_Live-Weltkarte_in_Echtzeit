/**
 * WorldState — WebSocket Client
 * Auto-reconnecting WebSocket with event dispatching
 */

export class WSClient {
    constructor() {
        this.url = this._getWebSocketURL();
        this.ws = null;
        this.reconnectAttempts = 0;
        this.maxReconnectAttempts = 20;
        this.listeners = {
            init: [],
            event: [],
            status: []
        };
        this._reconnectTimer = null;
    }

    /**
     * Determine WebSocket URL based on environment
     */
    _getWebSocketURL() {
        // Production: Use environment variable
        if (import.meta.env.VITE_WS_URL) {
            return import.meta.env.VITE_WS_URL;
        }

        // Development fallback
        if (import.meta.env.DEV) {
            return 'ws://localhost:8080';
        }

        // Universal fallback (same domain)
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        return `${protocol}//${window.location.host}`;
    }

    /**
     * Register an event listener
     */
    on(type, callback) {
        if (!this.listeners[type]) {
            this.listeners[type] = [];
        }
        this.listeners[type].push(callback);
        return this;
    }

    /**
     * Emit to listeners
     */
    _emit(type, data) {
        (this.listeners[type] || []).forEach(fn => fn(data));
    }

    /**
     * Connect to WebSocket server
     */
    connect() {
        try {
            console.log('[WS] Connecting to:', this.url);
            this.ws = new WebSocket(this.url);
            this._emit('status', { state: 'connecting' });

            this.ws.onopen = () => {
                console.log('[WS] Connected to', this.url);
                this.reconnectAttempts = 0;
                this._emit('status', { state: 'connected' });
            };

            this.ws.onmessage = (e) => {
                try {
                    const msg = JSON.parse(e.data);
                    if (msg.type === 'init') {
                        this._emit('init', msg.payload);
                    } else if (msg.type === 'event') {
                        this._emit('event', msg.payload);
                    }
                } catch (err) {
                    console.error('[WS] Parse error:', err);
                }
            };

            this.ws.onclose = (e) => {
                console.log('[WS] Disconnected, code:', e.code);
                this._emit('status', { state: 'disconnected' });
                this._scheduleReconnect();
            };

            this.ws.onerror = (err) => {
                console.error('[WS] Error:', err);
                this._emit('status', { state: 'error' });
            };
        } catch (err) {
            console.error('[WS] Connection failed:', err);
            this._emit('status', { state: 'error' });
            this._scheduleReconnect();
        }
    }

    /**
     * Schedule reconnection with exponential backoff
     */
    _scheduleReconnect() {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.log('[WS] Max reconnect attempts reached');
            this._emit('status', { state: 'failed' });
            return;
        }

        const delay = Math.min(1000 * Math.pow(1.5, this.reconnectAttempts), 15000);
        this.reconnectAttempts++;

        console.log(`[WS] Reconnecting in ${(delay / 1000).toFixed(1)}s (attempt ${this.reconnectAttempts})`);
        this._emit('status', { state: 'reconnecting', attempt: this.reconnectAttempts });

        this._reconnectTimer = setTimeout(() => {
            this.connect();
        }, delay);
    }

    /**
     * Disconnect
     */
    disconnect() {
        clearTimeout(this._reconnectTimer);
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
    }
}
