-- Enable PostGIS Extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table
-- Stores citizens, officials, and admins.
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    phone VARCHAR(20) UNIQUE NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(20) CHECK (role IN ('CITIZEN', 'OFFICIAL', 'ADMIN')) NOT NULL DEFAULT 'CITIZEN',
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Departments Table
-- Municipal departments like Roads, Sanitation, etc.
CREATE TABLE departments (
    dept_id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    contact_email VARCHAR(100)
);

-- 3. Ward Boundaries
-- Stores the geospatial polygon for each ward.
CREATE TABLE wards (
    ward_id SERIAL PRIMARY KEY,
    ward_number INT UNIQUE NOT NULL,
    boundary GEOMETRY(POLYGON, 4326)
);

-- 4. Reports (The Issue)
-- The core table linking users, location, images, and status.
CREATE TABLE reports (
    report_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(user_id),
    category VARCHAR(50) NOT NULL, -- e.g., 'Pothole', 'Garbage'
    description TEXT,
    image_url TEXT NOT NULL,
    
    -- Location Data
    latitude DECIMAL(9,6) NOT NULL,
    longitude DECIMAL(9,6) NOT NULL,
    location GEOMETRY(POINT, 4326), -- Auto-populated via trigger or app
    
    -- Auto-assigned relations
    ward_id INT REFERENCES wards(ward_id),
    
    -- Status Tracking
    status VARCHAR(20) DEFAULT 'OPEN' CHECK (status IN ('OPEN', 'IN_PROGRESS', 'RESOLVED', 'REJECTED')),
    priority_score INT DEFAULT 0,
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Assignments
-- Tracks which official/department is handling a report.
CREATE TABLE assignments (
    assignment_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    report_id UUID REFERENCES reports(report_id),
    dept_id INT REFERENCES departments(dept_id),
    official_user_id UUID REFERENCES users(user_id),
    assigned_at TIMESTAMP DEFAULT NOW(),
    notes TEXT
);

-- Indexes for performance
CREATE INDEX idx_reports_location ON reports USING GIST (location);
CREATE INDEX idx_reports_status ON reports(status);
CREATE INDEX idx_reports_user ON reports(user_id);
CREATE INDEX idx_wards_boundary ON wards USING GIST (boundary);

-- Seed Data (Basic Departments)
INSERT INTO departments (name, contact_email) VALUES 
('Roads & Bridges', 'roads@city.gov'),
('Sanitation (Garbage)', 'sanitation@city.gov'),
('Street Lights', 'electrical@city.gov'),
('Water Supply', 'water@city.gov');

-- Seed Data (Demo User)
INSERT INTO users (phone, full_name, role) VALUES 
('+919876543210', 'Demo Citizen', 'CITIZEN'),
('+919998887776', 'Admin User', 'ADMIN');
