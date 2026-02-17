const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const dbPath = path.resolve(__dirname, 'civic.sqlite');
const db = new sqlite3.Database(dbPath);

const officialUser = {
    email: 'official@civic.com',
    password: 'official123',
    role: 'OFFICIAL',
    phone_number: '+919876543210'
};

const saltRounds = 10;

db.serialize(async () => {
    // Check if user exists
    db.get("SELECT * FROM users WHERE email = ?", [officialUser.email], async (err, row) => {
        if (err) {
            console.error(err.message);
            return;
        }

        if (row) {
            console.log('Official user already exists.');
        } else {
            console.log('Creating Official user...');
            const hashedPassword = await bcrypt.hash(officialUser.password, saltRounds);
            const stmt = db.prepare(`
                INSERT INTO users (user_id, email, password, role, phone_number, provider, created_at)
                VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
            `);

            stmt.run(uuidv4(), officialUser.email, hashedPassword, officialUser.role, officialUser.phone_number, 'LOCAL');
            stmt.finalize();
            console.log(`Official user created: ${officialUser.email} / ${officialUser.password}`);
        }
    });
});

// Close the database connection
// db.close() is called inside serialize or automatically? 
// sqlite3 operations are asynchronous. We shoould wait. 
// For simplicity in this script, we can just let existing process handle it or simple timeout
setTimeout(() => {
    db.close();
}, 2000);
