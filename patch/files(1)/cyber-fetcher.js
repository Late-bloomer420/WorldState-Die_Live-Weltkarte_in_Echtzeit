/**
 * cyber-fetcher.js
 * Educational Cyber Threat Intelligence Layer
 * 
 * PRIVACY & ETHICS PRINCIPLES:
 * ✅ Only public threat indicators (C2 IPs, Malware URLs)
 * ✅ No PII, no victim data, no personal information
 * ✅ Educational purpose: empower defenders, not attackers
 * ✅ Transparent attribution to abuse.ch
 * ✅ Rate-limit respectful caching (60 min TTL)
 * 
 * DATA SOURCES:
 * - Feodo Tracker (abuse.ch): Botnet C2 servers
 * - URLhaus (abuse.ch): Malware distribution URLs
 */

import fetch from 'node-fetch';

class CyberFetcher {
  constructor() {
    this.cache = {
      feodo: { data: null, timestamp: 0 },
      urlhaus: { data: null, timestamp: 0 },
      geocode: new Map() // IP -> {lat, lng, country}
    };
    this.TTL = 60 * 60 * 1000; // 60 minutes
    this.enabled = process.env.ENABLE_CYBER_LAYER === 'true';
    
    console.log(`[CyberFetcher] Initialized (enabled: ${this.enabled})`);
  }

  /**
   * Fetch Feodo Tracker data (Botnet C2 servers)
   */
  async fetchFeodoTracker() {
    const now = Date.now();
    if (this.cache.feodo.data && (now - this.cache.feodo.timestamp) < this.TTL) {
      console.log('[CyberFetcher] Using cached Feodo data');
      return this.cache.feodo.data;
    }

    try {
      console.log('[CyberFetcher] Fetching Feodo Tracker...');
      const response = await fetch('https://feodotracker.abuse.ch/downloads/ipblocklist.json');
      
      if (!response.ok) {
        throw new Error(`Feodo API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter to only recent, active threats (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const filtered = data.filter(entry => {
        const lastSeen = new Date(entry.last_online || entry.first_seen);
        return lastSeen >= thirtyDaysAgo;
      });

      console.log(`[CyberFetcher] Feodo: ${filtered.length} active threats (of ${data.length} total)`);
      
      this.cache.feodo = { data: filtered, timestamp: now };
      return filtered;
    } catch (error) {
      console.error('[CyberFetcher] Feodo fetch failed:', error.message);
      return this.cache.feodo.data || []; // Return stale data if available
    }
  }

  /**
   * Fetch URLhaus data (Malware distribution)
   */
  async fetchURLhaus() {
    const now = Date.now();
    if (this.cache.urlhaus.data && (now - this.cache.urlhaus.timestamp) < this.TTL) {
      console.log('[CyberFetcher] Using cached URLhaus data');
      return this.cache.urlhaus.data;
    }

    try {
      console.log('[CyberFetcher] Fetching URLhaus...');
      const response = await fetch('https://urlhaus.abuse.ch/downloads/json_recent/');
      
      if (!response.ok) {
        throw new Error(`URLhaus API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Filter to online threats only
      const filtered = data.urls?.filter(entry => 
        entry.url_status === 'online'
      ) || [];

      console.log(`[CyberFetcher] URLhaus: ${filtered.length} active threats`);
      
      this.cache.urlhaus = { data: filtered, timestamp: now };
      return filtered;
    } catch (error) {
      console.error('[CyberFetcher] URLhaus fetch failed:', error.message);
      return this.cache.urlhaus.data || [];
    }
  }

  /**
   * Geocode an IP address using ip-api.com (free, no auth required)
   * Cached to avoid redundant lookups
   */
  async geocodeIP(ip) {
    // Check cache first
    if (this.cache.geocode.has(ip)) {
      return this.cache.geocode.get(ip);
    }

    try {
      const response = await fetch(`http://ip-api.com/json/${ip}?fields=status,lat,lon,country,city`);
      const data = await response.json();

      if (data.status === 'success') {
        const result = {
          lat: data.lat,
          lng: data.lon,
          country: data.country,
          city: data.city || 'Unknown'
        };
        
        this.cache.geocode.set(ip, result);
        return result;
      }
    } catch (error) {
      console.error(`[CyberFetcher] Geocode failed for ${ip}:`, error.message);
    }

    // Fallback: return null location
    return null;
  }

  /**
   * Get random sample of cyber threats for the event stream
   * Returns a mix of C2 servers and malware hosts
   */
  async getRandomCyberThreat() {
    if (!this.enabled) {
      return null;
    }

    // 70% Feodo (C2), 30% URLhaus (Malware)
    const useFeodo = Math.random() < 0.7;

    if (useFeodo) {
      const feodoData = await this.fetchFeodoTracker();
      if (feodoData.length === 0) return null;

      const threat = feodoData[Math.floor(Math.random() * feodoData.length)];
      const location = await this.geocodeIP(threat.ip_address);

      if (!location) return null; // Skip if geocoding fails

      return {
        type: 'cyber',
        subtype: 'c2_server',
        title: `Botnet C2 Server erkannt`,
        message: `${threat.malware || 'Unknown'} Command & Control Server aktiv`,
        location: {
          lat: location.lat,
          lng: location.lng,
          region: location.city,
          country: location.country
        },
        severity: 'high',
        technical: {
          ip: threat.ip_address,
          malware_family: threat.malware,
          first_seen: threat.first_seen,
          last_seen: threat.last_online || threat.first_seen,
          port: threat.dst_port || 'Unknown',
          confidence: 'High (abuse.ch verified)'
        },
        educational: {
          what: 'Ein Command & Control (C2) Server ist der zentrale Kontrollpunkt eines Botnets. Infizierte Geräte kontaktieren diesen Server, um Befehle zu empfangen.',
          risk: 'Wenn dein Gerät diesen Server kontaktiert, könnte es Teil eines Botnets sein.',
          protection: [
            'Firewall-Regel: Blockiere diese IP auf Netzwerk-Ebene',
            'IDS/IPS: Konfiguriere Intrusion Detection für diese Malware-Familie',
            'Endpoint-Scan: Prüfe Geräte auf Infektionen mit dieser Malware',
            'Traffic-Monitoring: Überwache ausgehende Verbindungen zu dieser IP'
          ]
        },
        source: {
          name: 'abuse.ch Feodo Tracker',
          url: 'https://feodotracker.abuse.ch/',
          quality: 'verified',
          live: true,
          updated: new Date().toISOString()
        },
        badge: {
          icon: '🔬',
          label: 'Wissenschaftlich',
          color: '#00ff88'
        }
      };
    } else {
      const urlhausData = await this.fetchURLhaus();
      if (urlhausData.length === 0) return null;

      const threat = urlhausData[Math.floor(Math.random() * urlhausData.length)];
      
      // Extract domain/IP for geocoding
      let ip = null;
      try {
        const url = new URL(threat.url);
        // Simple check: is it an IP address?
        if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(url.hostname)) {
          ip = url.hostname;
        }
      } catch (e) {
        // Invalid URL, skip
        return null;
      }

      if (!ip) return null; // Only process IP-based URLs for now

      const location = await this.geocodeIP(ip);
      if (!location) return null;

      return {
        type: 'cyber',
        subtype: 'malware_host',
        title: `Malware Distribution Server`,
        message: `${threat.threat || 'Malware'} wird aktiv verteilt`,
        location: {
          lat: location.lat,
          lng: location.lng,
          region: location.city,
          country: location.country
        },
        severity: 'high',
        technical: {
          url: threat.url,
          ip: ip,
          threat_type: threat.threat,
          malware_family: threat.tags?.join(', ') || 'Unknown',
          first_seen: threat.dateadded,
          confidence: 'High (abuse.ch verified)'
        },
        educational: {
          what: 'Dieser Server hostet aktiv Malware-Dateien. Wenn diese URL aufgerufen wird, wird schädliche Software heruntergeladen.',
          risk: 'Downloads von dieser URL könnten dein System kompromittieren. Die URL könnte in Phishing-Mails oder kompromittierten Webseiten eingebettet sein.',
          protection: [
            'DNS-Blocking: Blockiere diese Domain in deinem DNS-Resolver',
            'Web-Filter: Füge diese URL zu deiner Blocklist hinzu',
            'Email-Filter: Blockiere Mails mit dieser URL',
            'Browser-Warnung: Melde diese URL an Safe Browsing APIs'
          ]
        },
        source: {
          name: 'abuse.ch URLhaus',
          url: 'https://urlhaus.abuse.ch/',
          quality: 'verified',
          live: true,
          updated: new Date().toISOString()
        },
        badge: {
          icon: '🔬',
          label: 'Wissenschaftlich',
          color: '#00ff88'
        }
      };
    }
  }

  /**
   * Health check for monitoring
   */
  getHealth() {
    return {
      enabled: this.enabled,
      cache: {
        feodo: {
          cached: this.cache.feodo.data !== null,
          count: this.cache.feodo.data?.length || 0,
          age: Date.now() - this.cache.feodo.timestamp
        },
        urlhaus: {
          cached: this.cache.urlhaus.data !== null,
          count: this.cache.urlhaus.data?.length || 0,
          age: Date.now() - this.cache.urlhaus.timestamp
        },
        geocode: {
          size: this.cache.geocode.size
        }
      }
    };
  }
}

export default CyberFetcher;
