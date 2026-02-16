/**
 * WorldState — Hash-Based SPA Router
 * Manages app-mode view switching and bottom nav state
 */

const ROUTES = {
    '/': { id: 'map', icon: '🌍', label: 'Globe' },
    '/feed': { id: 'feed', icon: '📰', label: 'Feed' },
    '/alerts': { id: 'alerts', icon: '⚠️', label: 'Alerts' },
    '/economy': { id: 'economy', icon: '📈', label: 'Dashboard' },
    '/profile': { id: 'profile', icon: '👤', label: 'Profil' }
};

export class Router {
    constructor(containerEl, navEl) {
        this.container = containerEl;
        this.navEl = navEl;
        this.views = {};
        this.activeView = null;
        this.activeRoute = '/';

        this._renderNav();
        window.addEventListener('hashchange', () => this._onHashChange());
    }

    /**
     * Register a view factory for a route
     */
    register(routePath, viewFactory) {
        this.views[routePath] = viewFactory;
    }

    /**
     * Start the router — navigate to current hash or default
     */
    start() {
        this._onHashChange();
    }

    /**
     * Navigate to a route
     */
    navigate(routePath) {
        window.location.hash = `#${routePath}`;
    }

    _onHashChange() {
        const hash = window.location.hash.replace('#', '') || '/';
        const route = ROUTES[hash];
        if (!route) {
            window.location.hash = '#/';
            return;
        }

        this.activeRoute = hash;
        this._updateNav(hash);
        this._renderView(hash);
    }

    _renderNav() {
        if (!this.navEl) return;
        this.navEl.innerHTML = '';

        Object.entries(ROUTES).forEach(([path, route]) => {
            const btn = document.createElement('button');
            btn.className = 'bottom-nav-item';
            btn.dataset.route = path;
            btn.innerHTML = `
                <span class="nav-icon">${route.icon}</span>
                <span class="nav-label">${route.label}</span>
            `;
            btn.addEventListener('click', () => this.navigate(path));
            this.navEl.appendChild(btn);
        });
    }

    _updateNav(activeRoute) {
        if (!this.navEl) return;
        this.navEl.querySelectorAll('.bottom-nav-item').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.route === activeRoute);
        });
    }

    _renderView(routePath) {
        const factory = this.views[routePath];
        if (!factory) return;

        // Hide all existing view children
        Array.from(this.container.children).forEach(child => {
            child.style.display = 'none';
        });

        // Check if this view already has a DOM element cached
        const existingEl = this.container.querySelector(`[data-view="${routePath}"]`);
        if (existingEl) {
            existingEl.style.display = '';
            // Notify view it's active again
            if (factory._onShow) factory._onShow();
            return;
        }

        // Create new view
        const viewEl = document.createElement('div');
        viewEl.className = 'app-view-content';
        viewEl.dataset.view = routePath;
        this.container.appendChild(viewEl);
        factory.render(viewEl);
    }
}
