
/**
 * Control Panel Module
 * Manages layer toggles and region presets
 */

import { toggleCyberLayer } from './map.js';


export function initControls(map) {
  const panel = document.getElementById('control-panel');
  if (!panel) return;

  panel.innerHTML = `
    <div class="header-subtitle" style="margin-left:0; padding-left:0; border:none; margin-bottom:12px;">LAYERS</div>
    
    <div class="toggle-group">
      <div class="toggle-btn active" data-layer="resorts">
        <span class="toggle-icon">🏔</span>
        <span class="label">Resorts</span>
      </div>
      <div class="toggle-btn" data-layer="runs">
        <span class="toggle-icon">⛷</span>
        <span class="label">Ski Runs</span>
      </div>
      <div class="toggle-btn" data-layer="lifts">
        <span class="toggle-icon">🚡</span>
        <span class="label">Lifts</span>
      </div>
      <div class="toggle-btn" data-layer="avalanche">
        <span class="toggle-icon">⚠️</span>
        <span class="label">Avalanche Risk</span>
      </div>
        <span class="toggle-icon">📷</span>
        <span class="label">Webcams</span>
      </div>
      <div class="toggle-btn layer-toggle--cyber" data-layer="cyber">
        <span class="toggle-icon">🛡️</span>
        <span class="label">Cyber Threats</span>
        <span class="layer-toggle__badge">BETA</span>
      </div>

    </div>

    <div class="header-subtitle" style="margin-top:20px; margin-left:0; padding-left:0; border:none; margin-bottom:12px;">TIME</div>
    <div class="time-pills" style="display:flex; gap:4px;">
      <div class="pill active" style="padding:4px 8px; font-size:10px; background:rgba(19, 236, 236, 0.2); color:#13ecec; border-radius:12px;">NO</div>
      <div class="pill" style="padding:4px 8px; font-size:10px; background:rgba(255,255,255,0.1); color:#94a3b8; border-radius:12px;">1H</div>
      <div class="pill" style="padding:4px 8px; font-size:10px; background:rgba(255,255,255,0.1); color:#94a3b8; border-radius:12px;">24H</div>
    </div>
  `;

  // Simple toggle logic for demo visuals
  const toggles = panel.querySelectorAll('.toggle-btn');
  toggles.forEach(btn => {
    btn.addEventListener('click', async () => {
      const layer = btn.dataset.layer;
      if (layer === 'cyber') {
        const isNowActive = !btn.classList.contains('active');
        const success = await toggleCyberLayer(isNowActive);
        if (success) {
          btn.classList.toggle('active');
        }
      } else {
        btn.classList.toggle('active');
      }
    });
  });

}
