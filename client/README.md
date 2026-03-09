# 💍 ShaadiBio v2 — React + Tailwind CSS Frontend

Marriage BioData Generator · React 18 · Redux Toolkit · React Router v6 · Axios · html2pdf.js · Tailwind CSS 3

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# → http://localhost:5173
```

---

## ⚙️ Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18.x | UI framework |
| Redux Toolkit | 2.x | State management |
| React Router DOM | 6.x | Client-side routing |
| Axios | 1.x | HTTP client with JWT interceptors |
| html2pdf.js | 0.10.x | Client-side PDF export |
| Tailwind CSS | 3.x | Utility-first styling |
| Vite | 5.x | Build tool & dev server |

---

## 📁 Structure

```
src/
├── app/
│   ├── App.jsx              # Root with React Router
│   ├── store.js             # Redux store
│   └── ProtectedRoute.jsx   # Auth guard
├── components/
│   ├── ui/
│   │   ├── Button.jsx       # Multi-variant button
│   │   └── FormFields.jsx   # Input, Select, Textarea, Toggle, Modal, Alert
│   ├── layout/Navbar.jsx    # Responsive navbar
│   └── shared/index.jsx     # Loader, EmptyState, Footer, PageHeader
├── features/
│   ├── auth/
│   │   ├── AuthPages.jsx    # Login + Register
│   │   └── authSlice.js     # Redux auth slice
│   └── biodata/
│       ├── CreateBiodata.jsx    # Main form + live preview
│       ├── FormSections.jsx     # All 5 form tabs + PhotoUpload + TemplateSwitcher
│       └── biodataSlice.js      # Redux biodata slice
├── pages/
│   ├── HomePage.jsx         # Hero landing page
│   ├── Dashboard.jsx        # Saved biodatas grid
│   └── PreviewPage.jsx      # Full-screen preview + PDF
├── templates/
│   ├── TraditionalTemplate.jsx  # Gold/red Indian style
│   ├── ModernTemplate.jsx       # Navy/teal minimal
│   └── index.js                 # Template registry
├── services/
│   ├── apiClient.js         # Axios with JWT + 401 handler
│   ├── authService.js       # Auth API calls
│   ├── biodataService.js    # Biodata CRUD API calls
│   └── pdfService.js        # html2pdf + print
├── hooks/useDebounce.js     # 300ms debounce hook
└── utils/
    ├── constants.js         # All dropdown options
    └── helpers.js           # calculateAge, validators
```

---

## 🎨 Design

**Fonts:** Playfair Display · Lato · Noto Serif Devanagari  
**Colors:** Crimson (brand) · Gold (accents) · Navy (modern template) · Cream (backgrounds)

---

## 🔗 Routes

| Path | Page | Auth |
|------|------|------|
| `/` | Home | — |
| `/login` | Login | — |
| `/register` | Register | — |
| `/create` | Create biodata | Guest OK |
| `/edit/:id` | Edit biodata | ✅ Required |
| `/preview/:id` | Full preview | ✅ Required |
| `/dashboard` | My biodatas | ✅ Required |

---

## 📱 Mobile-First Responsive

- Navbar collapses to hamburger on mobile
- Create page: Edit/Preview toggle button on mobile
- All forms: responsive grid (1 col → 2 col)
- Dashboard: responsive card grid (1 → 2 → 3 col)
- Templates: scroll-friendly on small screens

---

## 🔌 Backend API

Set URL in `.env`:

```env
VITE_API_URL=http://localhost:5000
```

Endpoints used:
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`
- `GET /api/biodata`
- `POST /api/biodata`
- `GET /api/biodata/:id`
- `PUT /api/biodata/:id`
- `DELETE /api/biodata/:id`
- `POST /api/biodata/:id/photo`
- `GET /api/biodata/:id/pdf`
