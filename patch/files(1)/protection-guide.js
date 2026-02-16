/**
 * protection-guide.js
 * Practical Protection Guide for Cyber Threats
 * 
 * Provides actionable defense strategies for:
 * - System Administrators
 * - Network Security Teams
 * - Individual Users
 */

export class ProtectionGuide {
  constructor() {
    this.guides = {
      c2_server: this.getC2ServerGuide(),
      malware_host: this.getMalwareHostGuide(),
      general: this.getGeneralGuide()
    };
  }

  /**
   * Get protection guide for Botnet C2 Servers
   */
  getC2ServerGuide() {
    return {
      title: 'Schutz vor Botnet C2 Servern',
      icon: '🔴',
      threat_level: 'high',
      
      for_admins: {
        title: 'Für Systemadministratoren',
        measures: [
          {
            action: 'Firewall-Regel erstellen',
            description: 'Blockiere ausgehende Verbindungen zur C2-IP',
            example: 'iptables -A OUTPUT -d [C2_IP] -j DROP',
            priority: 'critical'
          },
          {
            action: 'IDS/IPS Signature',
            description: 'Konfiguriere Intrusion Detection für diese Malware-Familie',
            example: 'Snort/Suricata Rule mit Malware-Signatur',
            priority: 'high'
          },
          {
            action: 'Network Monitoring',
            description: 'Überwache ausgehende Verbindungen zu dieser IP',
            example: 'tcpdump -n dst [C2_IP] or Zeek/Wireshark',
            priority: 'high'
          },
          {
            action: 'Endpoint-Scan',
            description: 'Scanne alle Endgeräte auf Infektion',
            example: 'ClamAV, YARA-Rules, EDR-Lösungen',
            priority: 'critical'
          },
          {
            action: 'DNS Sinkhole',
            description: 'Leite DNS-Anfragen zur C2-Domain ins Leere',
            example: 'Pi-hole, BIND RPZ, DNS Firewall',
            priority: 'medium'
          }
        ]
      },
      
      for_users: {
        title: 'Für Endnutzer',
        measures: [
          {
            action: 'Antivirus-Scan durchführen',
            description: 'Prüfe dein System auf Malware',
            tools: ['Windows Defender', 'Malwarebytes', 'Bitdefender']
          },
          {
            action: 'Verdächtige Prozesse prüfen',
            description: 'Öffne Task-Manager und suche nach unbekannten Prozessen',
            tools: ['Process Explorer', 'Task Manager', 'Activity Monitor (Mac)']
          },
          {
            action: 'Netzwerkaktivität überwachen',
            description: 'Prüfe aktive Verbindungen deines Systems',
            tools: ['netstat -ano', 'TCPView', 'Little Snitch (Mac)']
          },
          {
            action: 'System-Update installieren',
            description: 'Halte dein Betriebssystem aktuell',
            tools: ['Windows Update', 'apt update (Linux)', 'Software Update (Mac)']
          }
        ]
      },
      
      indicators: {
        title: 'Kompromittierungs-Indikatoren',
        signs: [
          'Ungewöhnlich hoher Netzwerk-Traffic',
          'System läuft langsamer als gewohnt',
          'Unbekannte Prozesse im Task-Manager',
          'Antivirus meldet Quarantäne-Aktionen',
          'Firewall zeigt blockierte Verbindungen'
        ]
      }
    };
  }

  /**
   * Get protection guide for Malware Distribution Hosts
   */
  getMalwareHostGuide() {
    return {
      title: 'Schutz vor Malware-Hosts',
      icon: '🟣',
      threat_level: 'high',
      
      for_admins: {
        title: 'Für Systemadministratoren',
        measures: [
          {
            action: 'DNS-Blocking',
            description: 'Blockiere Domain in DNS-Resolver',
            example: 'Unbound, Pi-hole, DNS Firewall',
            priority: 'critical'
          },
          {
            action: 'Web-Filter aktivieren',
            description: 'Füge URL zur Blocklist hinzu',
            example: 'Squid Proxy, pfSense, FortiGate',
            priority: 'high'
          },
          {
            action: 'Email-Gateway-Filter',
            description: 'Blockiere Mails mit dieser URL',
            example: 'SpamAssassin, Postfix Policy',
            priority: 'high'
          },
          {
            action: 'Safe Browsing API',
            description: 'Melde URL an Google/Microsoft Safe Browsing',
            example: 'https://safebrowsing.google.com/safebrowsing/report_phish/',
            priority: 'medium'
          },
          {
            action: 'SSL/TLS Inspection',
            description: 'Scanne verschlüsselte Verbindungen',
            example: 'SSL-Proxy, Deep Packet Inspection',
            priority: 'medium'
          }
        ]
      },
      
      for_users: {
        title: 'Für Endnutzer',
        measures: [
          {
            action: 'NIEMALS auf Link klicken',
            description: 'Diese URL verteilt aktiv Malware - nicht öffnen!',
            tools: ['Gesunder Menschenverstand']
          },
          {
            action: 'Browser-Schutz aktivieren',
            description: 'Stelle sicher dass Safe Browsing aktiv ist',
            tools: ['Chrome Safe Browsing', 'Firefox Tracking Protection', 'Edge SmartScreen']
          },
          {
            action: 'Download-Scanner nutzen',
            description: 'Lasse alle Downloads von Antivirus prüfen',
            tools: ['Windows Defender', 'VirusTotal', 'Browser-integrierter Scanner']
          },
          {
            action: 'Verdächtige Mails melden',
            description: 'Wenn diese URL per Mail kam: als Phishing melden',
            tools: ['Email-Client "Report Phishing"', 'IT-Abteilung kontaktieren']
          }
        ]
      },
      
      indicators: {
        title: 'Kompromittierungs-Indikatoren',
        signs: [
          'Download wurde automatisch gestartet',
          'Browser zeigt Sicherheitswarnung',
          'Datei hat verdächtige Endung (.exe, .scr, .bat)',
          'Antivirus blockiert Download',
          'URL kam in unerwarteter Mail'
        ]
      }
    };
  }

  /**
   * Get general protection guide
   */
  getGeneralGuide() {
    return {
      title: 'Allgemeine Cyber-Hygiene',
      icon: '🛡️',
      
      best_practices: [
        {
          category: 'Prävention',
          tips: [
            'Software immer aktuell halten (OS, Browser, Plugins)',
            'Starke, einzigartige Passwörter für jeden Dienst',
            'Multi-Faktor-Authentifizierung aktivieren',
            'Regelmäßige Backups erstellen (3-2-1 Regel)',
            'Firewall auf allen Geräten aktiviert'
          ]
        },
        {
          category: 'Erkennung',
          tips: [
            'Netzwerk-Traffic regelmäßig monitoren',
            'Log-Dateien auf Anomalien prüfen',
            'Unbekannte Prozesse untersuchen',
            'Verdächtige Login-Versuche beobachten',
            'Plötzliche Performance-Einbußen ernst nehmen'
          ]
        },
        {
          category: 'Reaktion',
          tips: [
            'Verdächtige Geräte sofort vom Netz trennen',
            'Passwörter kompromittierter Accounts ändern',
            'Incident Response Plan aktivieren',
            'Forensische Analyse durchführen',
            'Incident an CERT/Behörden melden'
          ]
        }
      ],
      
      resources: [
        {
          name: 'BSI für Bürger',
          url: 'https://www.bsi-fuer-buerger.de',
          description: 'IT-Sicherheitstipps vom Bundesamt für Sicherheit in der Informationstechnik'
        },
        {
          name: 'abuse.ch',
          url: 'https://abuse.ch',
          description: 'Melde Malware und C2-Server'
        },
        {
          name: 'MITRE ATT&CK',
          url: 'https://attack.mitre.org',
          description: 'Framework für Angriffstechniken und Verteidigung'
        },
        {
          name: 'OWASP Top 10',
          url: 'https://owasp.org/Top10',
          description: 'Die 10 kritischsten Web-Sicherheitsrisiken'
        }
      ]
    };
  }

  /**
   * Get guide for specific threat type
   */
  getGuideForThreat(threatType) {
    return this.guides[threatType] || this.guides.general;
  }

  /**
   * Render protection guide as HTML
   */
  renderGuide(threatType) {
    const guide = this.getGuideForThreat(threatType);
    
    let html = `
      <div class="protection-guide">
        <div class="protection-guide__header">
          <span class="protection-guide__icon">${guide.icon}</span>
          <h3>${guide.title}</h3>
        </div>
    `;

    // Admin section
    if (guide.for_admins) {
      html += `
        <div class="protection-guide__section">
          <h4>${guide.for_admins.title}</h4>
          <div class="protection-guide__measures">
      `;
      
      guide.for_admins.measures.forEach(measure => {
        const priorityClass = `protection-guide__priority--${measure.priority}`;
        html += `
          <div class="protection-guide__measure">
            <div class="protection-guide__measure-header">
              <strong>${measure.action}</strong>
              <span class="protection-guide__priority ${priorityClass}">
                ${measure.priority}
              </span>
            </div>
            <p>${measure.description}</p>
            ${measure.example ? `<code>${measure.example}</code>` : ''}
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    }

    // User section
    if (guide.for_users) {
      html += `
        <div class="protection-guide__section">
          <h4>${guide.for_users.title}</h4>
          <div class="protection-guide__measures">
      `;
      
      guide.for_users.measures.forEach(measure => {
        html += `
          <div class="protection-guide__measure">
            <strong>${measure.action}</strong>
            <p>${measure.description}</p>
            ${measure.tools ? `
              <div class="protection-guide__tools">
                ${measure.tools.map(tool => `<span class="protection-guide__tool">${tool}</span>`).join('')}
              </div>
            ` : ''}
          </div>
        `;
      });
      
      html += `
          </div>
        </div>
      `;
    }

    // Indicators section
    if (guide.indicators) {
      html += `
        <div class="protection-guide__section">
          <h4>${guide.indicators.title}</h4>
          <ul class="protection-guide__indicators">
            ${guide.indicators.signs.map(sign => `<li>${sign}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    html += `</div>`;
    return html;
  }

  /**
   * Show protection guide in a modal/panel
   */
  show(threatType = 'general') {
    const guide = this.renderGuide(threatType);
    
    // Create modal
    const modal = document.createElement('div');
    modal.className = 'protection-guide-modal';
    modal.innerHTML = `
      <div class="protection-guide-modal__backdrop"></div>
      <div class="protection-guide-modal__content">
        ${guide}
        <button class="protection-guide-modal__close">Schließen</button>
      </div>
    `;

    document.body.appendChild(modal);

    // Close handler
    const closeBtn = modal.querySelector('.protection-guide-modal__close');
    const backdrop = modal.querySelector('.protection-guide-modal__backdrop');
    
    const close = () => {
      modal.classList.add('protection-guide-modal--closing');
      setTimeout(() => modal.remove(), 300);
    };

    closeBtn.addEventListener('click', close);
    backdrop.addEventListener('click', close);

    // Show with animation
    requestAnimationFrame(() => {
      modal.classList.add('protection-guide-modal--visible');
    });
  }
}

// ============================================
// CSS STYLES (add to style.css)
// ============================================

export const PROTECTION_GUIDE_STYLES = `
/* Protection Guide */
.protection-guide {
  background: linear-gradient(135deg, #1e1e2e 0%, #2a2a3e 100%);
  border-radius: 12px;
  padding: 1.5rem;
  color: #e5e7eb;
}

.protection-guide__header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(139, 92, 246, 0.3);
}

.protection-guide__icon {
  font-size: 2rem;
}

.protection-guide__header h3 {
  margin: 0;
  font-size: 1.5rem;
  color: #fff;
}

.protection-guide__section {
  margin-bottom: 2rem;
}

.protection-guide__section:last-child {
  margin-bottom: 0;
}

.protection-guide__section h4 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #a78bfa;
}

.protection-guide__measures {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.protection-guide__measure {
  background: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 8px;
  border-left: 4px solid #8b5cf6;
}

.protection-guide__measure-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.protection-guide__measure strong {
  color: #fff;
  font-size: 1.05rem;
}

.protection-guide__measure p {
  margin: 0.5rem 0;
  line-height: 1.6;
}

.protection-guide__measure code {
  display: block;
  margin-top: 0.5rem;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
  color: #22c55e;
  overflow-x: auto;
}

.protection-guide__priority {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.protection-guide__priority--critical {
  background: #dc2626;
  color: #fff;
}

.protection-guide__priority--high {
  background: #f59e0b;
  color: #000;
}

.protection-guide__priority--medium {
  background: #3b82f6;
  color: #fff;
}

.protection-guide__tools {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.protection-guide__tool {
  padding: 0.25rem 0.75rem;
  background: rgba(139, 92, 246, 0.2);
  border: 1px solid #8b5cf6;
  border-radius: 12px;
  font-size: 0.85rem;
  color: #a78bfa;
}

.protection-guide__indicators {
  margin: 0;
  padding-left: 1.5rem;
}

.protection-guide__indicators li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

/* Protection Guide Modal */
.protection-guide-modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.protection-guide-modal--visible {
  opacity: 1;
}

.protection-guide-modal__backdrop {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
}

.protection-guide-modal__content {
  position: relative;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.protection-guide-modal__close {
  margin-top: 1rem;
  width: 100%;
  padding: 0.75rem;
  background: linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s;
}

.protection-guide-modal__close:hover {
  transform: translateY(-2px);
}
`;

export default new ProtectionGuide();
