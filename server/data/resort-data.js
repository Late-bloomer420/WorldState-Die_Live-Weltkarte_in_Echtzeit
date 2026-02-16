/**
 * Alps Resort Data
 * Real-time ski resort monitoring for major Alpine destinations
 */

export const ALPS_RESORTS = [
    {
        id: 'zermatt',
        name: 'Zermatt',
        country: 'Switzerland',
        countryCode: 'CH',
        coords: [46.0207, 7.7491],
        stats: {
            temp: -8,
            wind: 12,
            snow_depth: 145, // cm
            lifts_open: 48,
            lifts_total: 52,
            runs_open: 72,
            runs_total: 78,
            avalanche_level: 3 // 1-5 scale
        },
        webcams: [
            { name: 'Gornergrat', url: '/api/cam/zermatt/gornergrat', live: true },
            { name: 'Matterhorn Glacier', url: '/api/cam/zermatt/glacier', live: true }
        ]
    },
    {
        id: 'chamonix',
        name: 'Chamonix Mont-Blanc',
        country: 'France',
        countryCode: 'FR',
        coords: [45.9237, 6.8694],
        stats: {
            temp: -5,
            wind: 18,
            snow_depth: 120,
            lifts_open: 42,
            lifts_total: 49,
            runs_open: 58,
            runs_total: 65,
            avalanche_level: 3
        },
        webcams: [
            { name: 'Aiguille du Midi', url: '/api/cam/chamonix/midi', live: true },
            { name: 'Brévent', url: '/api/cam/chamonix/brevent', live: false }
        ]
    },
    {
        id: 'st-anton',
        name: 'St. Anton am Arlberg',
        country: 'Austria',
        countryCode: 'AT',
        coords: [47.1296, 10.2682],
        stats: {
            temp: -6,
            wind: 8,
            snow_depth: 160,
            lifts_open: 85,
            lifts_total: 88,
            runs_open: 300, // km
            runs_total: 305,
            avalanche_level: 2
        },
        webcams: [
            { name: 'Valluga', url: '/api/cam/stanton/valluga', live: true },
            { name: 'Galzig', url: '/api/cam/stanton/galzig', live: true }
        ]
    },
    {
        id: 'verbier',
        name: 'Verbier 4Vallées',
        country: 'Switzerland',
        countryCode: 'CH',
        coords: [46.0961, 7.2286],
        stats: {
            temp: -4,
            wind: 25,
            snow_depth: 110,
            lifts_open: 35,
            lifts_total: 40,
            runs_open: 180, // km
            runs_total: 210,
            avalanche_level: 4 // High wind risk
        },
        webcams: [
            { name: 'Mont Fort', url: '/api/cam/verbier/montfort', live: true },
            { name: 'Medran', url: '/api/cam/verbier/medran', live: true }
        ]
    }
];

/**
 * Event templates for ski/mountain conditions
 */
export const SKI_EVENT_TEMPLATES = {
    powder_alert: [
        '20cm fresh powder recorded at summit',
        'Heavy snowfall continuing through night',
        'Powder alarm: 15cm fresh at mid-station',
        'Snowstorm intensifying, visibility low',
        'Fresh tracks reported in sector 5',
        'Dumping! 30cm expected by morning',
        'Perfect powder conditions on north face',
        'Snow line dropping to 1200m'
    ],
    lift_closure: [
        'Glacier Express chairlift closed due to high winds',
        'Gondola standby: wind gusts > 80km/h',
        'Upper sector lifts on hold - storm warning',
        'Technical issue at base station, delays expected',
        'Avalanche control work in progress, sector closed',
        'Peak tram closed for maintenance',
        'Wind hold on exposed ridges',
        'Lift evacuation drill in progress (simulated)'
    ],
    grooming_report: [
        'Piste 23 freshly groomed - perfect corduroy',
        'Valley run grooming complete',
        'Black run 7 moguls smoothed out',
        'Night grooming schedule active in sector A',
        'Fun park shaping in progress',
        'Cross-country track freshly cut',
        'Icy patches reported on lower slopes',
        'Groomers deploying to west face'
    ],
    event_alert: [
        'Après-ski jazz session starting at Base Camp',
        'Night skiing open tonight 19:00-22:00',
        'Freeride World Tour qualifier on North Face',
        'Torchlight descent scheduled for 20:00',
        'Live DJ set at mountain hut',
        'Village parade starting in 30 mins',
        'Ski test center open at mid-station',
        'Mountain yoga session at sunrise'
    ],
    avalanche_warning: [
        'Avalanche risk raised to Level 4 (High)',
        'Spontaneous slide reported in couloir',
        'Controlled blasting scheduled for 08:00',
        'Off-piste strictly prohibited in Sector C',
        'Slab instability detected on south slopes',
        'Wet snow slide warning for afternoon',
        'Cornice collapse risk high on ridge',
        'Rescue helicopter active in backcountry'
    ]
};
