# 💍 ShaadiBio — Marriage BioData Generator

A full-stack web application to create, customize, preview, and download professional Indian marriage biodata documents.

---

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ (v18+ recommended)
- MongoDB (local or MongoDB Atlas)
- npm v8+

---

## 📁 Project Structure

```
shaadibio/
├── client/     React 18 + Vite + Redux Toolkit
└── server/      Node.js + Express + MongoDB
```

---

## ⚙️ Setup

### 1. Backend Setup

```bash
cd server
npm install
```

Edit `backend/.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/shaadibio
JWT_SECRET=your_super_secret_key_change_in_production
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

Start backend:
```bash
npm run dev        # Development (nodemon)
npm start          # Production
```

Backend will run at: `http://localhost:5000`

---

### 2. Frontend Setup

```bash
cd client
npm install
```

Edit `frontend/.env` (already configured):
```env
VITE_API_URL=http://localhost:5000
VITE_APP_NAME=ShaadiBio
```

Start frontend:
```bash
npm run dev        # Development
npm run build      # Production build
```

Frontend will run at: `http://localhost:5173`

---

## 🌐 Pages & Routes

| Path | Page | Auth Required |
|------|------|--------------|
| `/` | Home — hero + feature cards | No |
| `/login` | Sign in | No |
| `/register` | Create account | No |
| `/create` | Create biodata (form + live preview) | No (guest) |
| `/edit/:id` | Edit saved biodata | Yes |
| `/preview/:id` | Full-screen preview + PDF | Yes |
| `/dashboard` | All saved biodatas | Yes |

---

## 🎨 Templates

### Template 1 — Traditional
- Warm saffron / gold / deep red theme
- Sanskrit blessing header: ॥ श्री गणेशाय नमः ॥
- Georgia serif font
- Classic Indian style

### Template 2 — Modern
- Navy blue sidebar + white content
- Clean Segoe UI sans-serif
- Professional minimal layout

---

## 🔑 API Endpoints

### Auth
```
POST   /api/auth/register     Register new user
POST   /api/auth/login        Login
GET    /api/auth/me           Get current user [protected]
POST   /api/auth/logout       Logout [protected]
```

### Biodata
```
POST   /api/biodata           Create biodata [protected]
GET    /api/biodata           Get all my biodata [protected]
GET    /api/biodata/:id       Get single biodata [protected]
PUT    /api/biodata/:id       Update biodata [protected]
DELETE /api/biodata/:id       Delete biodata [protected]
POST   /api/biodata/:id/photo Upload photo [protected]
GET    /api/biodata/:id/pdf   Export PDF/HTML [protected]
```

---

## ✨ Features

- ✅ **5-tab form** — Personal, Education, Family, Horoscope, Contact
- ✅ **Live preview** — 300ms debounced real-time template render
- ✅ **2 templates** — Traditional & Modern
- ✅ **Photo upload** — Instant FileReader preview
- ✅ **Age auto-calc** — From DOB, no submit needed
- ✅ **Privacy toggles** — Hide income / hide contact
- ✅ **Print / PDF** — Browser print dialog
- ✅ **JWT auth** — Persist across sessions
- ✅ **Dashboard** — Manage all saved biodatas
- ✅ **Guest mode** — Create without account

---

## 🛠️ Tech Stack

**Frontend**
- React 18 + Vite
- Redux Toolkit + React Redux
- React Router v6
- Axios

**Backend**
- Node.js + Express
- MongoDB + Mongoose
- JWT + bcryptjs
- Multer (photo uploads)
- express-validator

---

## 📝 Notes

- Guest users can create biodatas but cannot save them (requires login)
- Uploaded photos are stored in `server/uploads/`
- For production, configure a proper JWT_SECRET and use MongoDB Atlas
- PDF export uses browser print dialog; for server-side PDF add puppeteer
