
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'civic.sqlite');
const db = new sqlite3.Database(dbPath);

const reports = [
    {
        title: 'Pothole on Avinashi Road',
        description: 'Large pothole near Fun Republic Mall causing traffic slowdowns.',
        category: 'ROAD_MAINTENANCE',
        location: 'Avinashi Road, Coimbatore',
        latitude: 11.0247,
        longitude: 77.0108,
        status: 'PENDING',
        image_url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&q=80&w=400',
        user_id: 1 // Assuming admin/demo user ID 1 exists
    },
    {
        title: 'Garbage Pileup in Gandhipuram',
        description: 'Uncollected garbage at the bus stand entrance for 3 days.',
        category: 'SANITATION',
        location: 'Gandhipuram, Coimbatore',
        latitude: 11.0168,
        longitude: 76.9558,
        status: 'IN_PROGRESS',
        image_url: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?auto=format&fit=crop&q=80&w=400',
        user_id: 1
    },
    {
        title: 'Broken Street Light in RS Puram',
        description: 'Street lights not working on DB Road, making it unsafe at night.',
        category: 'STREET_LIGHT',
        location: 'RS Puram, Coimbatore',
        latitude: 11.0067,
        longitude: 76.9507,
        status: 'RESOLVED',
        image_url: 'https://images.unsplash.com/photo-1549144837-de94e19ed7fb?auto=format&fit=crop&q=80&w=400',
        user_id: 1
    },
    {
        title: 'Water Leakage in Saravanampatti',
        description: 'Main pipe leakage near KCT Tech Park entrance.',
        category: 'WATER_SUPPLY',
        location: 'Saravanampatti, Coimbatore',
        latitude: 11.0797,
        longitude: 76.9997,
        status: 'PENDING',
        image_url: 'https://images.unsplash.com/photo-1528643806124-7f28ed55f41c?auto=format&fit=crop&q=80&w=400',
        user_id: 1
    },
    {
        title: 'Damaged Park Bench',
        description: 'Broken benches in VOC Park need repair.',
        category: 'COMMUNITY',
        location: 'VOC Park, Coimbatore',
        latitude: 11.0016,
        longitude: 76.9696,
        status: 'REJECTED',
        image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&q=80&w=400',
        user_id: 1
    }
];

db.serialize(() => {
    const stmt = db.prepare(`
        INSERT INTO reports (title, description, category, location, latitude, longitude, status, image_url, user_id, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `);

    reports.forEach(report => {
        stmt.run(
            report.title,
            report.description,
            report.category,
            report.location,
            report.latitude,
            report.longitude,
            report.status,
            report.image_url,
            report.user_id
        );
    });

    stmt.finalize();
    console.log('Seeded Coimbatore reports successfully.');
});

db.close();
