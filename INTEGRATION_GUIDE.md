# Timetabling System Integration Guide

## 1) Architecture
- Frontend: Next.js (App Router) + Tailwind CSS
- API Layer: Netlify Functions (`/.netlify/functions/*`)
- Database: Neon PostgreSQL
- Auth: JWT (role-based route guard)
- Email: Resend or SendGrid

## 2) Neon PostgreSQL Setup
1. Create project on Neon.
2. Copy connection string:
   - `postgresql://<user>:<password>@<host>/<db>?sslmode=require`
3. Add to Netlify Environment Variables:
   - `DATABASE_URL=...`
4. Recommended schema groups:
   - `users`, `schools`, `teachers`, `schedules`, `substitutes`, `system_contents`, `password_resets`

## 3) Netlify Functions Setup
Create folder:
- `netlify/functions/`

Examples:
- `public-content.ts`
- `login.ts`
- `register.ts`
- `request-substitute.ts`
- `forgot-password.ts`
- `reset-password.ts`
- `admin-free-teachers.ts`
- `super-system-content.ts`

Netlify config example in `netlify.toml`:
```toml
[build]
  command = "npm run build"
  publish = ".next"

[functions]
  directory = "netlify/functions"
  node_bundler = "esbuild"
```

## 4) Auth and Roles
- Login flow:
  1. Client sends email/password to `/.netlify/functions/login`
  2. Function checks `users.password_hash` with bcrypt
  3. Sign JWT with payload `{ user_id, role, school_id }`
  4. Return token to client (prefer secure cookie for production)
- Role redirect:
  - `teacher` -> `/teacher-dashboard`
  - `school_admin` -> `/admin-dashboard`
  - `super_admin` -> `/super-dashboard`

Required env vars:
- `JWT_SECRET`
- `DATABASE_URL`
- `RESEND_API_KEY` or `SENDGRID_API_KEY`

## 5) External Email Service
### Resend
1. Verify domain in Resend.
2. Add key to Netlify env: `RESEND_API_KEY`
3. Send registration/reset emails inside function.

### SendGrid
1. Create API key with Mail Send permission.
2. Add `SENDGRID_API_KEY`
3. Configure sender identity.

## 6) Frontend-to-Function Contract
- Home page:
  - GET `/.netlify/functions/public-content`
  - read from `system_contents`
- Register:
  - GET `/.netlify/functions/schools`
  - POST `/.netlify/functions/register`
- Teacher request substitute:
  - POST `/.netlify/functions/request-substitute`
- Admin free teacher finder:
  - POST `/.netlify/functions/admin-free-teachers`
- Super content update:
  - PUT `/.netlify/functions/super-system-content`

## 7) Security Checklist
- Use bcrypt (cost >= 10)
- Validate and sanitize all inputs
- Enable CORS allowlist by domain
- Never expose DB credentials to browser
- Enforce role checks in every protected function
- Add rate limiting on login and forgot-password endpoints

## 8) Deployment Flow
1. Push repo to GitHub.
2. Connect repo to Netlify.
3. Set environment variables.
4. Deploy and verify function logs in Netlify dashboard.
5. Smoke test:
   - login
   - register
   - request substitute
   - admin free-teacher search
   - reset-password flow
