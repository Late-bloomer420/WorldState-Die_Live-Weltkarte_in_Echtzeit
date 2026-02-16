/**
 * GUB (Global Urban Boundaries) Region Data
 * Simulated urban boundary polygons for major world cities
 * Based on Landsat/Sentinel-2 derived impervious surface data (2000–2024)
 */

export const GUB_REGIONS = [
    {
        id: 'gub-tokyo',
        name: 'Tokyo Metropolitan',
        country: 'Japan',
        center: [35.6762, 139.6503],
        population: 37_400_000,
        imperviousKm2: { y2000: 2180, y2010: 2340, y2020: 2420, y2024: 2460 },
        polygon: [
            [35.85, 139.45], [35.90, 139.75], [35.82, 140.05],
            [35.55, 140.15], [35.40, 139.95], [35.45, 139.55],
            [35.60, 139.40], [35.85, 139.45]
        ]
    },
    {
        id: 'gub-shanghai',
        name: 'Shanghai',
        country: 'China',
        center: [31.2304, 121.4737],
        population: 28_500_000,
        imperviousKm2: { y2000: 1100, y2010: 2200, y2020: 3100, y2024: 3350 },
        polygon: [
            [31.45, 121.15], [31.50, 121.55], [31.40, 121.80],
            [31.10, 121.85], [30.95, 121.55], [31.05, 121.20],
            [31.25, 121.10], [31.45, 121.15]
        ]
    },
    {
        id: 'gub-delhi',
        name: 'Delhi NCR',
        country: 'India',
        center: [28.7041, 77.1025],
        population: 32_900_000,
        imperviousKm2: { y2000: 680, y2010: 1200, y2020: 1850, y2024: 2100 },
        polygon: [
            [28.90, 76.85], [28.95, 77.25], [28.85, 77.45],
            [28.50, 77.50], [28.35, 77.20], [28.45, 76.90],
            [28.65, 76.80], [28.90, 76.85]
        ]
    },
    {
        id: 'gub-saopaulo',
        name: 'São Paulo',
        country: 'Brazil',
        center: [-23.5505, -46.6333],
        population: 22_400_000,
        imperviousKm2: { y2000: 1800, y2010: 2050, y2020: 2250, y2024: 2320 },
        polygon: [
            [-23.35, -46.85], [-23.30, -46.50], [-23.40, -46.30],
            [-23.65, -46.35], [-23.75, -46.60], [-23.65, -46.90],
            [-23.45, -46.95], [-23.35, -46.85]
        ]
    },
    {
        id: 'gub-cairo',
        name: 'Greater Cairo',
        country: 'Egypt',
        center: [30.0444, 31.2357],
        population: 21_300_000,
        imperviousKm2: { y2000: 450, y2010: 680, y2020: 920, y2024: 1050 },
        polygon: [
            [30.20, 31.05], [30.25, 31.35], [30.15, 31.50],
            [29.90, 31.45], [29.80, 31.20], [29.90, 31.00],
            [30.05, 30.95], [30.20, 31.05]
        ]
    },
    {
        id: 'gub-lagos',
        name: 'Lagos',
        country: 'Nigeria',
        center: [6.5244, 3.3792],
        population: 16_600_000,
        imperviousKm2: { y2000: 280, y2010: 520, y2020: 880, y2024: 1100 },
        polygon: [
            [6.70, 3.15], [6.75, 3.45], [6.65, 3.65],
            [6.40, 3.60], [6.30, 3.35], [6.40, 3.10],
            [6.55, 3.05], [6.70, 3.15]
        ]
    },
    {
        id: 'gub-london',
        name: 'Greater London',
        country: 'United Kingdom',
        center: [51.5074, -0.1278],
        population: 9_500_000,
        imperviousKm2: { y2000: 1580, y2010: 1610, y2020: 1640, y2024: 1660 },
        polygon: [
            [51.65, -0.35], [51.68, 0.05], [51.60, 0.25],
            [51.40, 0.30], [51.30, 0.05], [51.35, -0.35],
            [51.50, -0.45], [51.65, -0.35]
        ]
    },
    {
        id: 'gub-newyork',
        name: 'New York Metro',
        country: 'United States',
        center: [40.7128, -74.0060],
        population: 20_100_000,
        imperviousKm2: { y2000: 3200, y2010: 3280, y2020: 3350, y2024: 3380 },
        polygon: [
            [40.95, -74.25], [40.98, -73.85], [40.88, -73.65],
            [40.55, -73.70], [40.45, -74.00], [40.55, -74.25],
            [40.75, -74.35], [40.95, -74.25]
        ]
    },
    {
        id: 'gub-istanbul',
        name: 'Istanbul',
        country: 'Turkey',
        center: [41.0082, 28.9784],
        population: 15_800_000,
        imperviousKm2: { y2000: 520, y2010: 850, y2020: 1200, y2024: 1350 },
        polygon: [
            [41.20, 28.70], [41.22, 29.05], [41.15, 29.30],
            [40.90, 29.25], [40.80, 28.95], [40.88, 28.65],
            [41.05, 28.60], [41.20, 28.70]
        ]
    },
    {
        id: 'gub-beijing',
        name: 'Beijing',
        country: 'China',
        center: [39.9042, 116.4074],
        population: 21_500_000,
        imperviousKm2: { y2000: 900, y2010: 1650, y2020: 2300, y2024: 2500 },
        polygon: [
            [40.10, 116.10], [40.15, 116.55], [40.05, 116.80],
            [39.70, 116.85], [39.60, 116.50], [39.70, 116.15],
            [39.90, 116.05], [40.10, 116.10]
        ]
    },
    {
        id: 'gub-mumbai',
        name: 'Mumbai Metropolitan',
        country: 'India',
        center: [19.0760, 72.8777],
        population: 21_600_000,
        imperviousKm2: { y2000: 380, y2010: 600, y2020: 850, y2024: 980 },
        polygon: [
            [19.30, 72.75], [19.28, 73.00], [19.15, 73.10],
            [18.90, 73.05], [18.85, 72.80], [18.95, 72.70],
            [19.10, 72.65], [19.30, 72.75]
        ]
    },
    {
        id: 'gub-nairobi',
        name: 'Nairobi',
        country: 'Kenya',
        center: [-1.2921, 36.8219],
        population: 5_100_000,
        imperviousKm2: { y2000: 120, y2010: 220, y2020: 380, y2024: 460 },
        polygon: [
            [-1.15, 36.68], [-1.12, 36.90], [-1.22, 37.00],
            [-1.40, 36.95], [-1.45, 36.75], [-1.35, 36.65],
            [-1.22, 36.60], [-1.15, 36.68]
        ]
    },
    {
        id: 'gub-berlin',
        name: 'Berlin-Brandenburg',
        country: 'Germany',
        center: [52.5200, 13.4050],
        population: 6_200_000,
        imperviousKm2: { y2000: 890, y2010: 920, y2020: 960, y2024: 985 },
        polygon: [
            [52.68, 13.10], [52.70, 13.55], [52.62, 13.75],
            [52.38, 13.78], [52.30, 13.45], [52.38, 13.10],
            [52.52, 13.00], [52.68, 13.10]
        ]
    },
    {
        id: 'gub-moscow',
        name: 'Moscow',
        country: 'Russia',
        center: [55.7558, 37.6173],
        population: 12_600_000,
        imperviousKm2: { y2000: 1050, y2010: 1250, y2020: 1480, y2024: 1560 },
        polygon: [
            [55.95, 37.30], [55.98, 37.75], [55.88, 38.00],
            [55.58, 37.95], [55.50, 37.60], [55.58, 37.25],
            [55.75, 37.15], [55.95, 37.30]
        ]
    },
    {
        id: 'gub-jakarta',
        name: 'Greater Jakarta',
        country: 'Indonesia',
        center: [-6.2088, 106.8456],
        population: 34_500_000,
        imperviousKm2: { y2000: 800, y2010: 1350, y2020: 1900, y2024: 2150 },
        polygon: [
            [-6.05, 106.60], [-6.00, 106.95], [-6.10, 107.15],
            [-6.35, 107.10], [-6.45, 106.85], [-6.35, 106.55],
            [-6.18, 106.50], [-6.05, 106.60]
        ]
    },
    {
        id: 'gub-dubai',
        name: 'Dubai-Sharjah-Ajman',
        country: 'UAE',
        center: [25.2048, 55.2708],
        population: 3_500_000,
        imperviousKm2: { y2000: 120, y2010: 450, y2020: 680, y2024: 780 },
        polygon: [
            [25.35, 55.10], [25.38, 55.40], [25.30, 55.55],
            [25.10, 55.50], [25.00, 55.30], [25.08, 55.10],
            [25.20, 55.00], [25.35, 55.10]
        ]
    },
    {
        id: 'gub-losangeles',
        name: 'Los Angeles Metro',
        country: 'United States',
        center: [34.0522, -118.2437],
        population: 13_200_000,
        imperviousKm2: { y2000: 4200, y2010: 4350, y2020: 4480, y2024: 4520 },
        polygon: [
            [34.30, -118.60], [34.35, -118.10], [34.20, -117.85],
            [33.85, -117.90], [33.75, -118.20], [33.85, -118.55],
            [34.05, -118.70], [34.30, -118.60]
        ]
    },
    {
        id: 'gub-paris',
        name: 'Île-de-France',
        country: 'France',
        center: [48.8566, 2.3522],
        population: 12_300_000,
        imperviousKm2: { y2000: 2350, y2010: 2420, y2020: 2500, y2024: 2540 },
        polygon: [
            [49.00, 2.10], [49.05, 2.50], [48.95, 2.70],
            [48.70, 2.65], [48.60, 2.35], [48.70, 2.05],
            [48.85, 1.95], [49.00, 2.10]
        ]
    },
    {
        id: 'gub-sydney',
        name: 'Greater Sydney',
        country: 'Australia',
        center: [-33.8688, 151.2093],
        population: 5_400_000,
        imperviousKm2: { y2000: 1250, y2010: 1350, y2020: 1460, y2024: 1520 },
        polygon: [
            [-33.65, 150.95], [-33.62, 151.30], [-33.75, 151.45],
            [-33.95, 151.40], [-34.05, 151.15], [-33.95, 150.90],
            [-33.80, 150.85], [-33.65, 150.95]
        ]
    },
    {
        id: 'gub-mexico',
        name: 'Mexico City ZMVM',
        country: 'Mexico',
        center: [19.4326, -99.1332],
        population: 21_800_000,
        imperviousKm2: { y2000: 1350, y2010: 1580, y2020: 1780, y2024: 1870 },
        polygon: [
            [19.60, -99.35], [19.65, -99.00], [19.55, -98.80],
            [19.25, -98.85], [19.15, -99.10], [19.25, -99.40],
            [19.42, -99.50], [19.60, -99.35]
        ]
    }
];

/**
 * Event templates for different types of global events
 */
export const EVENT_TEMPLATES = {
    urban_growth: [
        'New residential zone detected via Sentinel-2',
        'Impervious surface expansion identified',
        'Urban sprawl boundary shift detected',
        'Construction activity cluster identified',
        'New industrial zone development',
        'Suburban growth corridor emerging',
        'Land use change: agricultural → urban',
        'Road network expansion detected'
    ],
    conflict: [
        'Armed clash reported near border region',
        'Artillery fire detected via acoustic sensors',
        'Military convoy movement tracked',
        'Drone strike reported',
        'Cross-border incident escalation',
        'Ceasefire violation detected',
        'IED detonation reported',
        'Militia activity surge detected'
    ],
    infrastructure: [
        'Undersea cable maintenance alert',
        'Pipeline pressure anomaly detected',
        'Power grid overload warning',
        'Port congestion alert — vessel queue growing',
        'Railway disruption reported',
        'Telecom tower outage detected',
        'Dam water level critical threshold',
        'Refinery incident reported'
    ],
    disaster: [
        'Earthquake detected — magnitude assessment pending',
        'Tropical storm formation tracked',
        'Flood warning issued',
        'Wildfire spread accelerating',
        'Volcanic activity increase detected',
        'Landslide risk elevated',
        'Tsunami advisory issued',
        'Severe drought conditions expanding'
    ],
    protest: [
        'Large-scale demonstration forming',
        'Anti-government protest reported',
        'Labor strike — major industry affected',
        'Student protest movement growing',
        'Environmental activism blockade',
        'Election-related unrest detected',
        'Social media mobilization surge',
        'Transport workers strike affecting services'
    ],
    weather: [
        'Severe storm warning issued',
        'Heat wave advisory — temperatures exceeding threshold',
        'Heavy rainfall warning — flash flood risk',
        'Snow storm approaching — travel disruption expected',
        'Dense fog advisory — visibility reduced',
        'High wind warning — gusts exceeding 80 km/h',
        'Freezing rain alert — surface icing expected',
        'Thunderstorm cluster detected — lightning rate increasing'
    ]
};

/**
 * Source attribution for each event type
 * Each source includes: name, url, updateFrequency, reliability tier, lastVerified
 */
export const EVENT_SOURCES = {
    urban_growth: [
        { name: 'ESA Copernicus Sentinel-2', url: 'https://sentinels.copernicus.eu/web/sentinel/missions/sentinel-2', updateFrequency: '5-Tage-Zyklus', reliability: 'scientific', lastVerified: '2026-02-15' },
        { name: 'NASA Landsat Program', url: 'https://landsat.gsfc.nasa.gov/', updateFrequency: '16-Tage-Zyklus', reliability: 'scientific', lastVerified: '2026-02-15' },
        { name: 'Global Human Settlement Layer', url: 'https://ghsl.jrc.ec.europa.eu/', updateFrequency: 'Jährlich', reliability: 'scientific', lastVerified: '2026-01-10' },
        { name: 'World Bank Urban Development', url: 'https://www.worldbank.org/en/topic/urbandevelopment', updateFrequency: 'Quartal', reliability: 'governmental', lastVerified: '2026-02-01' }
    ],
    conflict: [
        { name: 'ACLED – Armed Conflict Data', url: 'https://acleddata.com/', updateFrequency: 'Wöchentlich', reliability: 'scientific', lastVerified: '2026-02-14' },
        { name: 'Uppsala Conflict Data Program', url: 'https://ucdp.uu.se/', updateFrequency: 'Monatlich', reliability: 'scientific', lastVerified: '2026-02-10' },
        { name: 'International Crisis Group', url: 'https://www.crisisgroup.org/', updateFrequency: 'Wöchentlich', reliability: 'scientific', lastVerified: '2026-02-13' },
        { name: 'OSCE Conflict Prevention', url: 'https://www.osce.org/conflict-prevention', updateFrequency: 'Täglich', reliability: 'governmental', lastVerified: '2026-02-15' }
    ],
    infrastructure: [
        { name: 'IEA – International Energy Agency', url: 'https://www.iea.org/', updateFrequency: 'Monatlich', reliability: 'governmental', lastVerified: '2026-02-01' },
        { name: 'World Bank Infrastructure', url: 'https://www.worldbank.org/en/topic/infrastructure', updateFrequency: 'Quartal', reliability: 'governmental', lastVerified: '2026-01-15' },
        { name: 'ITU – International Telecom Union', url: 'https://www.itu.int/', updateFrequency: 'Jährlich', reliability: 'governmental', lastVerified: '2026-01-20' },
        { name: 'MarineTraffic', url: 'https://www.marinetraffic.com/', updateFrequency: 'Echtzeit', reliability: 'commercial', lastVerified: '2026-02-15' }
    ],
    disaster: [
        { name: 'USGS Earthquake Hazards', url: 'https://earthquake.usgs.gov/', updateFrequency: 'Echtzeit', reliability: 'scientific', lastVerified: '2026-02-15' },
        { name: 'NOAA – National Weather Service', url: 'https://www.weather.gov/', updateFrequency: 'Echtzeit', reliability: 'scientific', lastVerified: '2026-02-15' },
        { name: 'GDACS – Global Disaster Alert', url: 'https://www.gdacs.org/', updateFrequency: 'Echtzeit', reliability: 'governmental', lastVerified: '2026-02-15' },
        { name: 'ReliefWeb – OCHA', url: 'https://reliefweb.int/', updateFrequency: 'Täglich', reliability: 'governmental', lastVerified: '2026-02-14' }
    ],
    protest: [
        { name: 'ACLED – Disorder Tracker', url: 'https://acleddata.com/early-warning-research-hub/disorder-tracker/', updateFrequency: 'Wöchentlich', reliability: 'scientific', lastVerified: '2026-02-14' },
        { name: 'CIVICUS Monitor', url: 'https://monitor.civicus.org/', updateFrequency: 'Monatlich', reliability: 'community', lastVerified: '2026-02-01' },
        { name: 'V-Dem Institute', url: 'https://www.v-dem.net/', updateFrequency: 'Jährlich', reliability: 'scientific', lastVerified: '2026-01-15' },
        { name: 'Freedom House', url: 'https://freedomhouse.org/', updateFrequency: 'Jährlich', reliability: 'community', lastVerified: '2026-01-20' }
    ],
    weather: [
        { name: 'ECMWF – European Weather Centre', url: 'https://www.ecmwf.int/', updateFrequency: 'Echtzeit', reliability: 'scientific', lastVerified: '2026-02-15' },
        { name: 'DWD – Deutscher Wetterdienst', url: 'https://www.dwd.de/', updateFrequency: 'Echtzeit', reliability: 'governmental', lastVerified: '2026-02-15' },
        { name: 'NOAA Climate.gov', url: 'https://www.climate.gov/', updateFrequency: 'Täglich', reliability: 'scientific', lastVerified: '2026-02-15' },
        { name: 'Copernicus Climate Service', url: 'https://climate.copernicus.eu/', updateFrequency: 'Echtzeit', reliability: 'scientific', lastVerified: '2026-02-15' }
    ]
};

/**
 * Reliability tier badges for UI display
 */
export const RELIABILITY_BADGES = {
    scientific: {
        label: 'Wissenschaftlich',
        icon: '🔬',
        color: '#00ff88',
        description: 'Peer-reviewed, wissenschaftliche Standards'
    },
    governmental: {
        label: 'Behördlich',
        icon: '🏛',
        color: '#4a9eff',
        description: 'Offizielle Regierungs- oder UN-Daten'
    },
    commercial: {
        label: 'Kommerziell',
        icon: '📈',
        color: '#ffa500',
        description: 'Kommerzielle Anbieter, öffentliche APIs'
    },
    community: {
        label: 'Community',
        icon: '🌐',
        color: '#9d4edd',
        description: 'Community-gepflegt, open data'
    }
};

/**
 * Source for GUB satellite boundary data
 */
export const GUB_DATA_SOURCE = {
    name: 'Global Urban Boundaries – Tsinghua University / ESA',
    url: 'https://data-starcloud.pcl.ac.cn/resource/9',
    satellite: 'Sentinel-2 / Landsat-8',
    resolution: '10m'
};

/**
 * Hotspot locations for non-GUB events
 */
export const HOTSPOT_LOCATIONS = [
    { name: 'Kyiv', coords: [50.4501, 30.5234], region: 'Europe' },
    { name: 'Gaza', coords: [31.3547, 34.3088], region: 'MENA' },
    { name: 'Khartoum', coords: [15.5007, 32.5599], region: 'Africa' },
    { name: 'Yangon', coords: [16.8661, 96.1951], region: 'Asia' },
    { name: 'Taipei', coords: [25.0330, 121.5654], region: 'Asia' },
    { name: 'Caracas', coords: [10.4806, -66.9036], region: 'Americas' },
    { name: 'Tehran', coords: [35.6892, 51.3890], region: 'MENA' },
    { name: 'Kabul', coords: [34.5553, 69.2075], region: 'Asia' },
    { name: 'Mogadishu', coords: [2.0469, 45.3182], region: 'Africa' },
    { name: 'Bogota', coords: [4.7110, -74.0721], region: 'Americas' },
    { name: 'Dhaka', coords: [23.8103, 90.4125], region: 'Asia' },
    { name: 'Tripoli', coords: [32.9022, 13.1800], region: 'MENA' },
    { name: 'Port-au-Prince', coords: [18.5944, -72.3074], region: 'Americas' },
    { name: 'Donetsk', coords: [48.0159, 37.8028], region: 'Europe' },
    { name: 'Aleppo', coords: [36.2021, 37.1343], region: 'MENA' },
    { name: 'Bamako', coords: [12.6392, -8.0029], region: 'Africa' },
    { name: 'Odesa', coords: [46.4825, 30.7233], region: 'Europe' },
    { name: 'Aden', coords: [12.7855, 45.0187], region: 'MENA' },
    { name: 'Manila', coords: [14.5995, 120.9842], region: 'Asia' },
    { name: 'Addis Ababa', coords: [9.0250, 38.7469], region: 'Africa' },
    // Infrastructure locations
    { name: 'Strait of Hormuz', coords: [26.5667, 56.2500], region: 'MENA' },
    { name: 'Suez Canal', coords: [30.4550, 32.3500], region: 'MENA' },
    { name: 'Panama Canal', coords: [9.0800, -79.6800], region: 'Americas' },
    { name: 'Strait of Malacca', coords: [2.5000, 101.5000], region: 'Asia' },
    { name: 'Bosphorus', coords: [41.1200, 29.0500], region: 'Europe' },
    // Natural disaster prone
    { name: 'Ring of Fire - Japan', coords: [35.0000, 139.0000], region: 'Asia' },
    { name: 'San Andreas Fault', coords: [35.0000, -119.0000], region: 'Americas' },
    { name: 'Caribbean Basin', coords: [18.0000, -68.0000], region: 'Americas' },
    { name: 'Bay of Bengal', coords: [15.0000, 88.0000], region: 'Asia' },
    { name: 'Sahel Region', coords: [14.0000, 0.0000], region: 'Africa' }
];
