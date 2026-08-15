# PathPilot AI — Production Deployment Guide & Checklist

This document provides the complete deployment checklist and pre-flight verification steps for releasing PathPilot AI to production on platforms like Vercel, AWS Amplify, or Docker.

---

## 📋 Pre-Flight Checklist

- [x] **TypeScript Compilation**: Passed with strict type checking (`npx tsc --noEmit`).
- [x] **Unit & Integration Tests**: 100% test pass rate across schemas, components, and API routes (`npm test`).
- [x] **Accessibility Verification**: Verified for WCAG 2.1 Level AA compliance (contrast, semantic HTML, keyboard focus, ARIA attributes).
- [x] **Environment Variables Configured**: `ANTHROPIC_API_KEY` documented with `.env.example`.
- [x] **Fallback Protection**: Curated domain generator active to ensure 100% uptime if Anthropic quota/auth fails.
- [x] **State Persistence**: `localStorage` verified across reloads without hydration mismatch errors.
- [x] **Responsive Mobile Layout**: Tested across mobile (375px), tablet (768px), and desktop (1280px+).
- [x] **Production Bundle**: Verified Next.js 16 build output (`npm run build`).

---

## 🚀 Deploying to Vercel (Recommended)

Vercel is the native platform for Next.js 16 App Router applications.

### Option 1: Vercel CLI

1. Install Vercel CLI globally:
   ```bash
   npm i -g vercel
   ```

2. Link project and deploy:
   ```bash
   vercel
   ```

3. Set production environment variables:
   ```bash
   vercel env add ANTHROPIC_API_KEY production
   ```

4. Deploy to production:
   ```bash
   vercel --prod
   ```

### Option 2: Vercel Web Dashboard (Git Integration)

1. Push your repository to GitHub / GitLab / Bitbucket.
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository.
3. In **Project Settings > Environment Variables**, add:
   - **Key**: `ANTHROPIC_API_KEY`
   - **Value**: `sk-ant-api03-...`
4. Click **Deploy**.
5. Vercel automatically creates a preview deployment for every branch and a production deployment for `main`.

---

## 🐳 Docker Deployment

To containerize PathPilot AI:

1. Create a `Dockerfile`:
   ```dockerfile
   FROM node:20-alpine AS base

   # Install dependencies
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci

   # Build application
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   # Production runner
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static

   EXPOSE 3000
   ENV PORT=3000
   CMD ["node", "server.js"]
   ```

2. Build and run the image:
   ```bash
   docker build -t pathpilot-ai .
   docker run -p 3000:3000 -e ANTHROPIC_API_KEY="your_key" pathpilot-ai
   ```

---

## 🔒 Security Best Practices

1. **Never Expose API Keys Client-Side**: All Anthropic Claude API invocations occur strictly inside the server-side Next.js route handler (`/app/api/roadmap/route.ts`).
2. **Strict Request Validation**: Every request is parsed and validated using Zod runtime schemas before processing.
3. **HTTP Headers**: Configure security headers in `next.config.ts` (Content Security Policy, X-Content-Type-Options, Referrer-Policy, Strict-Transport-Security).

---

## 🩺 Post-Deployment Verification

1. Access production URL and load the homepage.
2. Select a quick preset (e.g. "Full-Stack Web Developer") and trigger generation.
3. Verify that phases, capstone deliverables, and tasks render cleanly.
4. Check off multiple tasks and refresh the page to verify `localStorage` persistence.
5. Export the roadmap to Markdown and verify the downloaded file format.
