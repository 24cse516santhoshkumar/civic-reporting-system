# Civic Issue Reporting System - Setup Guide

## Prerequisites
- Docker & Docker Compose
- Node.js (v18+)
- Flutter SDK
- PostgreSQL (if not using Docker)

## 1. Database Setup
Start the PostgreSQL database with PostGIS:
```bash
cd civic-reporting-system
docker-compose up -d
```

## 2. Backend (API)
The backend runs on port 3000.
```bash
cd civic-reporting-system/backend
npm install
npm run start
```
*Swagger API Docs (Auto-generated): http://localhost:3000/api*

### Feature Highlights
- **Auth**: JWT-based. Default Admin created on startup.
- **Routing Engine**: Auto-assigns reports based on category.
- **AI Service**: Mock implementation for image validation.

## 3. Frontend (Admin Dashboard)
The admin dashboard runs on port 5173.
```bash
cd civic-reporting-system/frontend-admin
npm install
npm run dev
```
*Access at: http://localhost:5173*

### Login Credentials (Default)
- **Email**: `admin@civic.com`
- **Password**: `admin123`
- **Social Login**: Google/Apple buttons included (Demo UI).

### Features
- **Dashboard**: Stats, Maps, Issue List.
- **Profile**: Change Password functionality available in top-right menu.

## 4. Mobile App (Citizen)
Run on Android Emulator or Physical Device.
```bash
cd civic-reporting-system/mobile-app
flutter pub get
flutter run
```

## Troubleshooting
- **Database Connection**: Ensure port 5432 is free. Check `backend/src/app.module.ts`.
- **Frontend Build**: Requires TailwindCSS v3 (configured).
