/**
 * WorldState — Profile & Settings View (App Mode)
 * User profile, layer toggles, notification settings
 */

export class ProfileView {
    constructor() {
        this.el = null;
    }

    render(container) {
        this.el = container;
        this.el.classList.add('profile-view');

        this.el.innerHTML = `
            <div class="profile-header-card">
                <div class="profile-avatar">
                    <div class="avatar-ring">
                        <div class="avatar-inner">👤</div>
                    </div>
                </div>
                <h2 class="profile-name">Max Mustermann</h2>
                <span class="profile-badge">WorldState Pro ✦</span>
                <div class="profile-stats">
                    <div class="profile-stat">
                        <span class="profile-stat-value">4</span>
                        <span class="profile-stat-label">Aktive Layer</span>
                    </div>
                    <div class="profile-stat">
                        <span class="profile-stat-value">7</span>
                        <span class="profile-stat-label">Warnungen</span>
                    </div>
                    <div class="profile-stat">
                        <span class="profile-stat-value">Jan '25</span>
                        <span class="profile-stat-label">Seit</span>
                    </div>
                </div>
            </div>

            <section class="profile-section">
                <h3 class="profile-section-title">Meine Layer</h3>
                <div class="profile-toggles">
                    ${this._layerToggle('🌩 Wetter', true)}
                    ${this._layerToggle('📈 Wirtschaft', true)}
                    ${this._layerToggle('⚔️ Konflikte', false)}
                    ${this._layerToggle('🚗 Verkehr', true)}
                    ${this._layerToggle('🔥 Social Trends', true)}
                    ${this._layerToggle('🌡 Klima / CO₂', false)}
                </div>
                <a href="#" class="profile-link">Alle Layer verwalten →</a>
            </section>

            <section class="profile-section">
                <h3 class="profile-section-title">Benachrichtigungen</h3>
                <div class="profile-toggles">
                    ${this._settingToggle('Push-Notifications', true)}
                    ${this._settingToggle('E-Mail Digest', false)}
                    ${this._settingToggle('Kritische Warnungen', true, true)}
                </div>
                <div class="profile-freq-control">
                    <button class="freq-btn">Alle</button>
                    <button class="freq-btn">Wichtig</button>
                    <button class="freq-btn active">Nur kritisch</button>
                </div>
            </section>

            <section class="profile-section">
                <h3 class="profile-section-title">App-Einstellungen</h3>
                <div class="profile-toggles">
                    ${this._settingToggle('Dark Mode', true)}
                </div>
                <div class="profile-settings-rows">
                    <div class="profile-setting-row">
                        <span>Sprache</span>
                        <span class="profile-setting-val">Deutsch ›</span>
                    </div>
                    <div class="profile-setting-row">
                        <span>Datenverbrauch</span>
                        <span class="profile-setting-val">Niedrig ›</span>
                    </div>
                    <div class="profile-setting-row">
                        <span>Kartenqualität</span>
                        <span class="profile-setting-val">Ultra ›</span>
                    </div>
                </div>
            </section>

            <section class="profile-section">
                <h3 class="profile-section-title">🗂 Datenquellen</h3>
                <p class="profile-sources-intro">Alle angezeigten Daten stammen aus folgenden Quellen:</p>
                <div class="profile-sources-grid">
                    <div class="profile-source-group">
                        <strong>🌩 Wetter & Klima</strong>
                        <a href="https://www.ecmwf.int/" target="_blank" rel="noopener">ECMWF</a>
                        <a href="https://www.dwd.de/" target="_blank" rel="noopener">DWD</a>
                        <a href="https://www.climate.gov/" target="_blank" rel="noopener">NOAA Climate</a>
                        <a href="https://climate.copernicus.eu/" target="_blank" rel="noopener">Copernicus Climate</a>
                    </div>
                    <div class="profile-source-group">
                        <strong>📈 Wirtschaft</strong>
                        <a href="https://finance.yahoo.com/" target="_blank" rel="noopener">Yahoo Finance</a>
                        <a href="https://www.coingecko.com/" target="_blank" rel="noopener">CoinGecko</a>
                        <a href="https://tradingeconomics.com/" target="_blank" rel="noopener">Trading Economics</a>
                        <a href="https://www.reuters.com/business/" target="_blank" rel="noopener">Reuters</a>
                    </div>
                    <div class="profile-source-group">
                        <strong>⚔️ Konflikte</strong>
                        <a href="https://acleddata.com/" target="_blank" rel="noopener">ACLED</a>
                        <a href="https://ucdp.uu.se/" target="_blank" rel="noopener">UCDP Uppsala</a>
                        <a href="https://www.crisisgroup.org/" target="_blank" rel="noopener">Crisis Group</a>
                        <a href="https://www.osce.org/conflict-prevention" target="_blank" rel="noopener">OSCE</a>
                    </div>
                    <div class="profile-source-group">
                        <strong>🌋 Katastrophen</strong>
                        <a href="https://earthquake.usgs.gov/" target="_blank" rel="noopener">USGS Earthquakes</a>
                        <a href="https://www.weather.gov/" target="_blank" rel="noopener">NOAA Weather</a>
                        <a href="https://www.gdacs.org/" target="_blank" rel="noopener">GDACS</a>
                        <a href="https://reliefweb.int/" target="_blank" rel="noopener">ReliefWeb</a>
                    </div>
                    <div class="profile-source-group">
                        <strong>🏗 Urban Growth</strong>
                        <a href="https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-2" target="_blank" rel="noopener">ESA Sentinel-2</a>
                        <a href="https://landsat.gsfc.nasa.gov/" target="_blank" rel="noopener">NASA Landsat</a>
                        <a href="https://ghsl.jrc.ec.europa.eu/" target="_blank" rel="noopener">GHSL</a>
                        <a href="https://data-starcloud.pcl.ac.cn/resource/9" target="_blank" rel="noopener">GUB Dataset</a>
                    </div>
                    <div class="profile-source-group">
                        <strong>✊ Proteste & Social</strong>
                        <a href="https://monitor.civicus.org/" target="_blank" rel="noopener">CIVICUS Monitor</a>
                        <a href="https://www.v-dem.net/" target="_blank" rel="noopener">V-Dem Institute</a>
                        <a href="https://freedomhouse.org/" target="_blank" rel="noopener">Freedom House</a>
                    </div>
                    <div class="profile-source-group">
                        <strong>🗺 Kartendaten</strong>
                        <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>
                        <a href="https://carto.com/attributions" target="_blank" rel="noopener">CARTO Basemaps</a>
                        <a href="https://leafletjs.com/" target="_blank" rel="noopener">Leaflet.js</a>
                    </div>
                </div>
            </section>

            <button class="profile-logout-btn">Abmelden</button>
        `;

        // Wire up toggle switches
        this.el.querySelectorAll('.toggle-switch input').forEach(input => {
            input.addEventListener('change', () => {
                // Cosmetic only in prototype
            });
        });

        // Wire up freq buttons
        this.el.querySelectorAll('.freq-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                this.el.querySelectorAll('.freq-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });
    }

    _layerToggle(label, checked) {
        return `
            <div class="profile-toggle-row">
                <span>${label}</span>
                <label class="toggle-switch">
                    <input type="checkbox" ${checked ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;
    }

    _settingToggle(label, checked, isCritical = false) {
        return `
            <div class="profile-toggle-row">
                <span>${label}${isCritical ? ' <span class="critical-indicator">●</span>' : ''}</span>
                <label class="toggle-switch">
                    <input type="checkbox" ${checked ? 'checked' : ''}>
                    <span class="toggle-slider"></span>
                </label>
            </div>
        `;
    }
}
