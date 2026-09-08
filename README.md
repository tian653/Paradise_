# Paradise Community — Official Profile Website

Website profil resmi komunitas **Paradise**. Dibuat dengan React + Vite (frontend), HonoJS (backend), dan SQLite + Drizzle ORM (database).

---

## Struktur Project

```
paradise-community/
├── apps/
│   ├── web/          # Frontend: React + Vite + TypeScript
│   │   └── src/
│   │       ├── components/
│   │       │   ├── public/   # Navbar, Hero, About, dll.
│   │       │   └── admin/    # Admin layout dan komponen
│   │       ├── pages/
│   │       │   ├── public/   # PublicPage.tsx
│   │       │   └── admin/    # Dashboard, Profile, Activities, dll.
│   │       ├── hooks/        # useAuth, useApi
│   │       └── lib/          # api.ts, types.ts
│   │
│   └── server/       # Backend: HonoJS + Drizzle + SQLite
│       ├── src/
│       │   ├── routes/       # profile, activities, gallery, officers, contact, auth
│       │   ├── db/           # schema.ts, migrate.ts, seed.ts
│       │   └── middleware/   # auth middleware JWT
│       └── uploads/          # Folder penyimpanan foto yang diupload
│
├── package.json      # Root monorepo (npm workspaces)
└── README.md
```

---

## Prasyarat

- **Node.js** v18 atau lebih baru
- **npm** v8 atau lebih baru

---

## 1. Install Dependencies

```bash
# Di root directory paradise-community/
npm install
```

Perintah ini akan menginstall semua dependencies untuk kedua `apps/web` dan `apps/server` sekaligus.

---

## 2. Setup Database

### Jalankan Migrasi (buat tabel)

```bash
npm run db:migrate
```

Ini akan membuat file `paradise.db` di `apps/server/` dengan semua tabel yang dibutuhkan.

### Jalankan Seed (isi data awal)

```bash
npm run db:seed
```

Seed akan mengisi database dengan:
- Data profil awal komunitas Paradise
- 6 kegiatan contoh
- 8 foto galeri (dari Unsplash)
- 5 pengurus contoh
- Informasi kontak placeholder
- **Admin default**: username `admin`, password `paradise2026`

---

## 3. Jalankan Development Server

```bash
# Jalankan backend dan frontend bersamaan
npm run dev
```

Atau jalankan terpisah:

```bash
# Backend saja (port 3001)
npm run dev:server

# Frontend saja (port 5173)
npm run dev:web
```

Setelah berjalan:
- **Website publik**: [http://localhost:5173](http://localhost:5173)
- **Admin Panel**: [http://localhost:5173/admin](http://localhost:5173/admin)

---

## 4. Login ke Admin Panel

Buka [http://localhost:5173/admin](http://localhost:5173/admin)

Gunakan kredensial default:
```
Username: admin
Password: paradise2026
```

> ⚠️ **Ganti password default** setelah setup awal untuk keamanan.

---

## 5. Mengubah Konten Website

Semua konten website dikelola melalui Admin Panel:

| Konten | Menu Admin |
|--------|-----------|
| Nama, tagline, visi, misi, sejarah | Admin → Profil |
| Logo dan foto hero | Admin → Profil |
| Kegiatan | Admin → Kegiatan |
| Foto galeri | Admin → Galeri |
| Daftar pengurus | Admin → Kepengurusan |
| Instagram, WhatsApp, Email | Admin → Kontak |

---

## 6. Upload Foto

Foto yang diupload melalui Admin Panel disimpan di:
```
apps/server/uploads/
```

Di frontend, foto diakses via URL `/uploads/namafile.jpg` yang diproxy ke backend.

**Maksimal ukuran file**: 5MB  
**Format yang didukung**: JPEG, PNG, WebP, GIF

---

## 7. API Endpoints

### Public (tanpa autentikasi)
```
GET /api/profile
GET /api/activities
GET /api/gallery
GET /api/officers
GET /api/contact
```

### Auth
```
POST /api/auth/login    { username, password }
POST /api/auth/logout
```

### Admin (memerlukan Bearer token)
```
PUT    /api/admin/profile
POST   /api/admin/profile/upload-logo
POST   /api/admin/profile/upload-hero

GET    /api/admin/activities
POST   /api/admin/activities
PUT    /api/admin/activities/:id
DELETE /api/admin/activities/:id

GET    /api/admin/gallery
POST   /api/admin/gallery
PUT    /api/admin/gallery/:id
DELETE /api/admin/gallery/:id

GET    /api/admin/officers
POST   /api/admin/officers
PUT    /api/admin/officers/:id
DELETE /api/admin/officers/:id

GET /api/admin/contact
PUT /api/admin/contact

POST /api/admin/upload    (multipart/form-data, field: file)
```

---

## 8. Build Production

```bash
# Build frontend untuk production
npm run build
```

Output ada di `apps/web/dist/`. Untuk production, serve file statik ini menggunakan HonoJS atau web server lain (Nginx, dll.).

---

## 9. Environment Variables (Opsional)

Buat file `.env` di `apps/server/`:

```env
PORT=3001
JWT_SECRET=ganti-dengan-secret-yang-kuat-dan-panjang
```

---

## 10. Tech Stack

| Komponen | Teknologi |
|----------|-----------|
| Frontend | React 18 + Vite 6 + TypeScript |
| Backend | HonoJS + @hono/node-server |
| Database | SQLite (better-sqlite3) |
| ORM | Drizzle ORM |
| Auth | JWT (jsonwebtoken) + bcryptjs |
| Styling | Vanilla CSS (CSS Modules) |
| Font | Plus Jakarta Sans + Inter |
| Icons | Lucide React |

---

## Troubleshooting

**Error: Cannot find module 'better-sqlite3'**
```bash
cd apps/server && npm rebuild better-sqlite3
```

**Port sudah digunakan**
```bash
# Cek proses di port 3001 atau 5173
lsof -i :3001
lsof -i :5173
```

**Database kosong setelah migrate**
```bash
npm run db:seed
```
# Paradise
# Paradise
# Paradise
# PRDS
