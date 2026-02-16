/**
 * cyber-onboarding.js
 * Educational Onboarding for Cyber Threat Intelligence Layer
 * 
 * PRINCIPLES:
 * - Transparency: Explain what data is shown and why
 * - Education: Empower defenders, not attackers
 * - Consent: Require explicit activation
 * - Attribution: Clear source citations
 */

export class CyberOnboarding {
  constructor() {
    this.shown = localStorage.getItem('cyber-onboarding-seen') === 'true';
  }

  /**
   * Check if onboarding should be shown
   */
  shouldShow() {
    return !this.shown;
  }

  /**
   * Mark onboarding as seen
   */
  markAsSeen() {
    this.shown = true;
    localStorage.setItem('cyber-onboarding-seen', 'true');
  }

  /**
   * Reset onboarding (for testing or re-showing)
   */
  reset() {
    this.shown = false;
    localStorage.removeItem('cyber-onboarding-seen');
  }

  /**
   * Create and show the onboarding modal
   */
  show() {
    if (!this.shouldShow()) {
      return Promise.resolve(true); // Already seen, auto-accept
    }

    return new Promise((resolve) => {
      const modal = this.createModal(resolve);
      document.body.appendChild(modal);
      
      // Fade in
      requestAnimationFrame(() => {
        modal.classList.add('cyber-onboarding--visible');
      });
    });
  }

  /**
   * Create the modal DOM element
   */
  createModal(onDecision) {
    const modal = document.createElement('div');
    modal.className = 'cyber-onboarding';
    modal.innerHTML = `
      <div class="cyber-onboarding__backdrop"></div>
      <div class="cyber-onboarding__content">
        <div class="cyber-onboarding__header">
          <div class="cyber-onboarding__icon">🛡️</div>
          <h2>Cyber Threat Intelligence Layer</h2>
          <p class="cyber-onboarding__subtitle">Educational Security Visualization</p>
        </div>

        <div class="cyber-onboarding__body">
          <section class="cyber-onboarding__section">
            <h3>🎯 Was zeigt dieser Layer?</h3>
            <p>
              Dieser Layer visualisiert <strong>öffentlich bekannte Cyber-Bedrohungen</strong> 
              in Echtzeit. Datenquellen: <a href="https://abuse.ch" target="_blank">abuse.ch</a> 
              (Feodo Tracker & URLhaus).
            </p>
            <ul>
              <li><strong>Botnet C2 Server:</strong> Kommandozentralen von Malware-Netzwerken</li>
              <li><strong>Malware-Hosts:</strong> Server die aktiv Schadsoftware verteilen</li>
            </ul>
          </section>

          <section class="cyber-onboarding__section cyber-onboarding__section--education">
            <h3>📚 Zweck: Bildung & Verteidigung</h3>
            <p>Dieser Layer hat ein klares Ziel:</p>
            <ul>
              <li>✅ <strong>Systemadministratoren</strong> bei der Netzwerk-Härtung unterstützen</li>
              <li>✅ <strong>IT-Security-Teams</strong> Kontext für Threat Intelligence geben</li>
              <li>✅ <strong>Interessierte</strong> über Cyber-Bedrohungen aufklären</li>
              <li>❌ <strong>NICHT</strong> zum Angriff oder zur Ausnutzung gedacht</li>
            </ul>
          </section>

          <section class="cyber-onboarding__section cyber-onboarding__section--privacy">
            <h3>🔒 Datenschutz & Ethik</h3>
            <div class="cyber-onboarding__guarantees">
              <div class="cyber-onboarding__guarantee">
                <span class="cyber-onboarding__guarantee-icon">✅</span>
                <div>
                  <strong>Nur öffentliche Daten</strong>
                  <p>Keine persönlichen Informationen, keine Opfer-Daten</p>
                </div>
              </div>
              <div class="cyber-onboarding__guarantee">
                <span class="cyber-onboarding__guarantee-icon">✅</span>
                <div>
                  <strong>Zero Tracking</strong>
                  <p>Deine Interaktion mit dem Layer wird nicht getrackt</p>
                </div>
              </div>
              <div class="cyber-onboarding__guarantee">
                <span class="cyber-onboarding__guarantee-icon">✅</span>
                <div>
                  <strong>Transparente Attribution</strong>
                  <p>Jeder Datenpunkt ist zur Quelle zurückverfolgbar</p>
                </div>
              </div>
            </div>
          </section>

          <section class="cyber-onboarding__section cyber-onboarding__section--usage">
            <h3>🛠️ Verantwortungsvoller Umgang</h3>
            <p>Wenn du diesen Layer aktivierst:</p>
            <ul>
              <li>Nutze die Informationen zur <strong>Verteidigung</strong>, nicht zum Angriff</li>
              <li>Jeder Marker enthält <strong>Schutzmaßnahmen</strong> (Firewall-Regeln, IDS-Signaturen)</li>
              <li>Die Daten sind öffentlich, aber <strong>handle verantwortungsvoll</strong></li>
              <li>Melde verdächtige Aktivitäten an <strong>abuse.ch</strong> oder dein CERT</li>
            </ul>
          </section>

          <div class="cyber-onboarding__legal">
            <p>
              <strong>Rechtlicher Hinweis:</strong> Diese Daten dienen ausschließlich 
              Informations- und Bildungszwecken. Der Betreiber übernimmt keine Haftung 
              für die Nutzung dieser Informationen. Alle Aktionen auf eigene Verantwortung.
            </p>
          </div>
        </div>

        <div class="cyber-onboarding__footer">
          <button class="cyber-onboarding__btn cyber-onboarding__btn--secondary" data-action="decline">
            Abbrechen
          </button>
          <button class="cyber-onboarding__btn cyber-onboarding__btn--primary" data-action="accept">
            Verstanden & Aktivieren
          </button>
        </div>
      </div>
    `;

    // Event Listeners
    const acceptBtn = modal.querySelector('[data-action="accept"]');
    const declineBtn = modal.querySelector('[data-action="decline"]');

    acceptBtn.addEventListener('click', () => {
      this.markAsSeen();
      this.closeModal(modal, () => onDecision(true));
    });

    declineBtn.addEventListener('click', () => {
      this.closeModal(modal, () => onDecision(false));
    });

    // Close on backdrop click
    const backdrop = modal.querySelector('.cyber-onboarding__backdrop');
    backdrop.addEventListener('click', () => {
      this.closeModal(modal, () => onDecision(false));
    });

    return modal;
  }

  /**
   * Close modal with animation
   */
  closeModal(modal, callback) {
    modal.classList.remove('cyber-onboarding--visible');
    setTimeout(() => {
      modal.remove();
      callback();
    }, 300); // Match CSS transition duration
  }
}

// ============================================
// CSS STYLES (add to style.css)
// ============================================

export const CYBER_ONBOARDING_STYLES = `
/* Cyber Onboarding Modal */
.cyber-onboarding {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.cyber-onboarding--visible {
  opacity: 1;
}

.cyber-onboarding__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
}

.cyber-onboarding__content {
  position: relative;
  width: 90%;
  max-width: 700px;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 2px solid #8b5cf6;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(139, 92, 246, 0.3);
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cyber-onboarding__header {
  padding: 2rem;
  text-align: center;
  border-bottom: 1px solid rgba(139, 92, 246, 0.3);
}

.cyber-onboarding__icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  animation: pulse 2s ease infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.cyber-onboarding__header h2 {
  margin: 0 0 0.5rem 0;
  font-size: 1.8rem;
  color: #fff;
  font-weight: 700;
}

.cyber-onboarding__subtitle {
  margin: 0;
  color: #a78bfa;
  font-size: 1rem;
}

.cyber-onboarding__body {
  padding: 2rem;
  color: #e5e7eb;
}

.cyber-onboarding__section {
  margin-bottom: 2rem;
}

.cyber-onboarding__section:last-of-type {
  margin-bottom: 0;
}

.cyber-onboarding__section h3 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #fff;
}

.cyber-onboarding__section p {
  margin: 0 0 0.5rem 0;
  line-height: 1.6;
}

.cyber-onboarding__section ul {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}

.cyber-onboarding__section li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

.cyber-onboarding__section a {
  color: #a78bfa;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.2s;
}

.cyber-onboarding__section a:hover {
  border-bottom-color: #a78bfa;
}

.cyber-onboarding__section--education {
  background: rgba(139, 92, 246, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #8b5cf6;
}

.cyber-onboarding__section--privacy {
  background: rgba(34, 197, 94, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #22c55e;
}

.cyber-onboarding__section--usage {
  background: rgba(234, 179, 8, 0.1);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #eab308;
}

.cyber-onboarding__guarantees {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 1rem;
}

.cyber-onboarding__guarantee {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.cyber-onboarding__guarantee-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.cyber-onboarding__guarantee strong {
  display: block;
  color: #fff;
  margin-bottom: 0.25rem;
}

.cyber-onboarding__guarantee p {
  margin: 0;
  font-size: 0.9rem;
  color: #9ca3af;
}

.cyber-onboarding__legal {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: #9ca3af;
}

.cyber-onboarding__footer {
  display: flex;
  gap: 1rem;
  padding: 1.5rem 2rem;
  border-top: 1px solid rgba(139, 92, 246, 0.3);
}

.cyber-onboarding__btn {
  flex: 1;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.cyber-onboarding__btn--primary {
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  color: #fff;
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
}

.cyber-onboarding__btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.5);
}

.cyber-onboarding__btn--secondary {
  background: transparent;
  color: #a78bfa;
  border: 2px solid #a78bfa;
}

.cyber-onboarding__btn--secondary:hover {
  background: rgba(139, 92, 246, 0.1);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .cyber-onboarding__content {
    width: 95%;
    max-height: 95vh;
  }

  .cyber-onboarding__header,
  .cyber-onboarding__body,
  .cyber-onboarding__footer {
    padding: 1.5rem;
  }

  .cyber-onboarding__icon {
    font-size: 3rem;
  }

  .cyber-onboarding__header h2 {
    font-size: 1.5rem;
  }

  .cyber-onboarding__footer {
    flex-direction: column;
  }
}
`;

// Export default instance
export default new CyberOnboarding();
