
/**
 * Resort Dashboard Module
 * Handles the display of detailed resort information and stats
 */

export function initDashboard() {
    const dashboard = document.getElementById('dashboard-panel');
    if (!dashboard) return;

    // Listen for resort selection from map
    window.addEventListener('resort-selected', (e) => {
        const resortId = e.detail;
        // For demo, we just open the panel. In real app, fetch specific data.
        openDashboard();
    });

    // Close button logic (if needed)
}

function openDashboard() {
    const dashboard = document.getElementById('dashboard-panel');
    dashboard.classList.add('open');
}

export function updateDashboard(resortData) {
    const container = document.querySelector('.dash-content');
    if (!container) return;

    container.innerHTML = resortData.map(resort => createResortCard(resort)).join('');

    // Add Avalanche Section
    const avalancheHTML = `
    <div class="avalanche-section">
      <div class="avalanche-header">
        <span>Avalanche Danger</span>
        <span style="color:#f97316">Level 3 - Considerable</span>
      </div>
      <div class="avalanche-bar">
        <div class="av-seg active lvl-1"></div>
        <div class="av-seg active lvl-2"></div>
        <div class="av-seg active lvl-3"></div>
        <div class="av-seg lvl-4"></div>
        <div class="av-seg lvl-5"></div>
      </div>
    </div>
  `;
    container.insertAdjacentHTML('beforeend', avalancheHTML);

    // Add SOS Button
    const sosHTML = `
    <button class="sos-btn">
      <span>SOS / EMERGENCY</span>
    </button>
  `;
    container.insertAdjacentHTML('beforeend', sosHTML);
}

function createResortCard(resort) {
    const statusClass = resort.stats.lifts_open === resort.stats.lifts_total ? 'open' : 'partial';
    const statusText = statusClass === 'open' ? 'OPEN' : 'PARTIAL';

    return `
    <div class="resort-card">
      <div class="resort-card-header">
        <div class="resort-name">
          <span class="resort-flag">${resort.countryCode === 'CH' ? '🇨🇭' : (resort.countryCode === 'FR' ? '🇫🇷' : '🇦🇹')}</span>
          ${resort.name}
        </div>
        <div class="status-pill ${statusClass}">${statusText}</div>
      </div>
      
      <div class="resort-stats">
        <div class="stat-box">
          <span class="stat-val">${resort.stats.temp}°</span>
          <span class="stat-lbl">Temp</span>
        </div>
        <div class="stat-box">
          <span class="stat-val">${resort.stats.lifts_open}/${resort.stats.lifts_total}</span>
          <span class="stat-lbl">Lifts</span>
        </div>
        <div class="stat-box">
          <span class="stat-val">${resort.stats.snow_depth}cm</span>
          <span class="stat-lbl">Snow</span>
        </div>
      </div>
      <i class="fav-star" style="position:absolute; top:12px; right:12px;">★</i>
    </div>
  `;
}
