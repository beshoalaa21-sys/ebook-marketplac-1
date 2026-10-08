# 📚 E-Book Marketplace

A modern, scalable e-book marketplace platform built with **Next.js**, **TypeScript**, and **PostgreSQL**. Supports multiple languages (Arabic & English), AI-powered content moderation, and secure payment processing.

---

## 🎯 Features

### 👥 User Management
- **Multi-role RBAC**: Reader, Author, Moderator, Admin, Super Admin
- Secure authentication with **Argon2id** password hashing
- Opaque session tokens with HttpOnly cookies
- Email verification & password reset flows
- Profile management with multi-language support

### 📖 Content Management
- Full book lifecycle: Draft → Publishing → Published
- Versioning system for book updates
- Multiple content formats: Novels, Poetry, Short Stories
- Genre & tag taxonomy with Arabic/English support
- Book series organization

### 🤖 AI & Moderation
- Automated content screening (language quality, plagiarism detection)
- AI-suggested age ratings (with human final approval)
- Flag system for content issues
- Human review workflow with moderation actions
- Separate AI suggestions from final decisions

### 💰 Commerce
- Multi-currency support (USD, EGP, etc.)
- Dynamic pricing with coupons & discounts
- Commission system (snapshot at sale time for historical accuracy)
- Payout management & earnings tracking
- Payment processing integration

### 📊 Security & Compliance
- Row-Level Security (RLS) in database
- Server-side authorization checks
- CSRF protection with Origin validation
- Age rating gates (EVERYONE, 11+, 13+, 16+, 18+)
- Copyright declaration & report tracking

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 15 (App Router), React 19, TypeScript |
| **Backend** | Next.js API Routes, Node.js |
| **Database** | PostgreSQL with migrations (no ORM) |
| **Auth** | Argon2id, JWT-like sessions, HttpOnly cookies |
| **Utilities** | Zod (validation), pdf-lib, pdfjs-dist, Nodemailer |

---

## 📦 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- npm or yarn

### Installation

```bash
# 1. Clone & install dependencies
git clone https://github.com/beshoalaa21-sys/ebook-marketplac-1.git
cd ebook-marketplac-1
npm install

# 2. Setup environment variables
cp .env.example .env
# Edit .env with your database URL, email config, etc.

# 3. Run database migrations
npm run db:migrate

# 4. Seed initial data (roles, settings, genres, founder)
npm run db:seed

# 5. Start development server
npm run dev
```

Visit `http://localhost:3000`

### Available Scripts

```bash
npm run dev          # Start development server (hot reload)
npm run build        # Production build
npm run start        # Start production server
npm run db:migrate   # Run all SQL migrations from db/
npm run db:seed      # Seed roles, settings, genres, founder
```

---

## 📁 Project Structure

```
ebook-marketplac-1/
├── db/                 # SQL migrations (001_schema.sql, etc.)
├── scripts/            # Seed scripts, utilities
├── src/
│   ├── app/
│   │   ├── api/        # API routes (auth, me, etc.)
│   │   └── [locale]/   # i18n page routes
│   ├── components/     # React components
│   ├── lib/
│   │   ├── db.ts       # postgres client & queries
│   │   ├── auth/       # password, session, rbac logic
│   │   ├── security/   # CSRF, validation helpers
│   │   └── i18n/       # Translation keys, locale helpers
│   └── styles/         # Design tokens, global CSS
├── messages/           # i18n JSON (ar.json, en.json)
├── tsconfig.json       # TypeScript config
├── package.json        # Dependencies & scripts
└── .env.example        # Environment template
```

---

## 🔐 Security Architecture

### Authentication
- Passwords hashed with **Argon2id** (never stored plaintext)
- Sessions stored as salted SHA-256 token hashes in DB
- Tokens are cryptographically random UUIDs
- Expiry checked on every request
- HttpOnly, SameSite=Lax cookies prevent XSS/CSRF

### Authorization
- **Server-side RBAC** in `src/lib/auth/rbac.ts`
- Role-based access control for all endpoints
- **Row-Level Security (RLS)** in PostgreSQL as second layer
- User can only access/modify their own data

### Data Protection
- All money stored as **integer minor units** (cents/piasters), never floats
- Commission snapshotted at sale time (audit trail)
- Protected files stored by key only (no public URLs leaked)
- Soft-delete via `deleted_at` for historical accuracy
- Sensitive data (payout info, identity) encrypted at app level

---

## 🌍 Internationalization (i18n)

The platform supports **Arabic** and **English** with full RTL support.

```
messages/
├── ar.json          # Arabic translations
└── en.json          # English translations
```

- Locale derived from user preference or URL
- Direction (ltr/rtl) automatically applied
- All UI text from translation keys

Example usage in components:
```typescript
import { t } from "@/lib/i18n";
const locale = await getLocale();
const label = t(locale, "auth.login");
```

---

## 📊 Database Schema Highlights

### Core Tables
- **users**: Identity, email, password hash, locale, status
- **profiles**: Display name, avatar, bio, country, birth year
- **roles**: READER, AUTHOR, MODERATOR, ADMIN, SUPER_ADMIN
- **user_roles**: User ↔ Role assignments with grant tracking

### Content
- **books**: Metadata, status, versions, pricing, age ratings
- **book_versions**: Version control (1.0, 1.1, 2.0, etc.)
- **book_files**: Protected storage keys (ORIGINAL_PDF, PREVIEW_PDF)
- **previews**: Page ranges for free previews (AI-suggested or confirmed)
- **free_chapters**: Free chapters by chapter number

### Commerce
- **coupons**: Discount codes (% or fixed amount)
- **sales**: Purchase records with snapshotted commission
- **author_earnings**: Earnings log (commission never changes)
- **payouts**: Payout requests and history

### AI & Moderation
- **ai_reviews**: Automated screening results
- **ai_flags**: Issues detected (plagiarism, language, etc.)
- **ai_suggestions**: Suggested changes (tags, price, preview, etc.)
- **human_reviews**: Manual review workflow
- **review_actions**: Moderation decisions (approve, request changes, reject)

### Reports & Appeals
- **reports**: Copyright, unauthorized, ownership, content reports
- **author_applications**: Author onboarding with identity verification

---

## ⚙️ Configuration & Features

### Environment Variables
See `.env.example` for the full template. Key variables:

```bash
DATABASE_URL=postgresql://user:pass@localhost/ebook_market
FOUNDER_EMAIL=founder@example.com
FOUNDER_PASSWORD=secure_password
FOUNDER_DISPLAY_NAME=Founder Name
FOUNDER_USERNAME=founder_username
# Add email provider (Nodemailer), payment provider keys, etc.
```

### Feature Flags
Defined in `scripts/seed.ts`, configurable via Admin Settings:

- `ai_search` — AI-powered book search
- `ai_recommendations` — Personalized recommendations
- `subscriptions` — Subscription model
- `whatsapp_notifications` — WhatsApp alerts
- `author_followers` — Follow author feature
- `advanced_age_verification` — Enhanced age gating
- `whatsapp_button` — Direct messaging via WhatsApp

### Platform Settings
All editable from Admin Settings UI:
- `commission_bps` — Commission in basis points (3000 = 30%)
- `min_payout_minor` — Minimum payout threshold
- `currencies` — Supported currencies
- `languages` — Supported languages
- `download_rate_limit` — Max downloads per user per window
- `preview_max_pages` — Max pages in free preview
- `max_pdf_mb` — Max upload size (50 MB)
- `max_pdf_pages` — Max page count (3000)
- `ai_max_chunks` — Max text chunks for AI analysis

---

## 🚀 Deployment

### Production Checklist
- [ ] Replace in-memory `rateLimit` with Redis
- [ ] Set up email verification & password reset flows (Phase 8)
- [ ] Configure payment provider (Stripe, PayPal, etc.)
- [ ] Enable PostgreSQL backups
- [ ] Set environment variables securely
- [ ] Enable HTTPS and secure cookie flags
- [ ] Configure CDN for static assets
- [ ] Set up monitoring & error tracking

### Hosting Options
- **Vercel** (recommended for Next.js)
- **AWS** (EC2, RDS for database)
- **DigitalOcean** (App Platform)
- **Railway, Render, Fly.io** (PaaS with database)

---

## 📝 Development Workflow

### Adding a New Feature
1. Create database migration in `db/`
2. Update `src/lib/db.ts` with new query helpers
3. Add RBAC rules in `src/lib/auth/rbac.ts`
4. Implement API route in `src/app/api/`
5. Create UI components in `src/components/`
6. Add translations to `messages/{ar,en}.json`

### Running Migrations
```bash
# Single migration
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f db/002_add_feature.sql

# All migrations (from npm script)
npm run db:migrate
```

---

## 🐛 Known Limitations & TODOs

| Item | Status | Phase |
|------|--------|-------|
| Rate limiting (in-memory) | ⚠️ Dev-only | Production |
| Email verification flow | ⏳ Planned | Phase 8 |
| Password reset flow | ⏳ Planned | Phase 8 |
| Commission payouts UI | ⏳ Placeholder | Admin Settings |
| Semantic search (vector DB) | ⏳ Planned | Future |
| WhatsApp integration | ⏳ Feature flag | Phase 9 |

---

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` — Create account
- `POST /api/auth/login` — Sign in
- `POST /api/auth/logout` — Sign out
- `POST /api/auth/verify-email` — Verify email (token from link)
- `GET /api/auth/me` — Current user info

### Book Management (Authors)
- `POST /api/books` — Create draft
- `PUT /api/books/:id` — Update
- `POST /api/books/:id/versions` — Create new version
- `POST /api/books/:id/publish` — Submit for review

### Admin & Moderation
- `POST /api/admin/reviews/:id/approve` — Approve book
- `POST /api/admin/reviews/:id/request-changes` — Request edits
- `POST /api/admin/reviews/:id/reject` — Reject book
- `GET /api/admin/settings` — Get platform settings

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is proprietary. All rights reserved © 2024 E-Book Marketplace.

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/beshoalaa21-sys/ebook-marketplac-1/issues)
- **Email**: support@ebook-marketplace.com (configure in settings)

---

## 🙏 Credits

Built with ❤️ by the E-Book Marketplace team.

**Key Technologies:**
- [Next.js](https://nextjs.org) - React framework
- [PostgreSQL](https://www.postgresql.org) - Database
- [Argon2](https://argon2-cffi.readthedocs.io) - Password hashing
- [Zod](https://zod.dev) - Schema validation
- [pdf-lib](https://pdf-lib.js.org) - PDF manipulation
