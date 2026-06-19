# Internal Audit — OHSMS Portal

An ISO 45001 occupational health & safety **internal audit** portal. Plan audits,
raise findings and drive corrective actions (CAPA) to closure across all your
sites — with org-scoped access, admin approvals, and real-time compliance
dashboards.

This is a faithful clone of the original portal, built with the same stack:
**React + Vite + Tailwind CSS + Framer Motion**, backed by **Firebase**
(Authentication + Cloud Firestore).

## Features

- **Multi-tenant, org-scoped.** The first user to register a company becomes its
  admin and approves teammates. Members only ever see their own org's data.
- **Auth flows.** Create an organization, request access to an existing one, sign
  in, reset password, and a pending-approval gate.
- **Audits.** Schedule ISO 45001 audits against sites, view them on a
  year-at-a-glance scheduling matrix, and execute a clause-by-clause checklist.
- **Findings.** Raise nonconformities/observations (inline from an audit or
  standalone), filter and search them, and track each to closure.
- **CAPA.** A corrective/preventive-action board moving items from open →
  in-progress → verified → closed; closing a CAPA closes its linked finding.
- **Dashboards.** Live KPIs (open findings, overdue CAPAs, audits in progress,
  closure rate), recent findings, severity breakdown and upcoming audits.
- **Admin.** Approve/reject join requests, manage roles, edit org settings.
- **Legal pages.** Privacy, Terms, Data & Security, Cookies.

## Tech stack

| Layer       | Choice                                   |
| ----------- | ---------------------------------------- |
| Framework   | React 18 + Vite 5                        |
| Styling     | Tailwind CSS 3                           |
| Animation   | Framer Motion                            |
| Icons       | lucide-react                             |
| Routing     | react-router-dom 6                       |
| Auth & data | Firebase Authentication + Cloud Firestore |

## Prerequisites

- **Node.js 18+** and npm. (If Node isn't installed on Windows:
  `winget install OpenJS.NodeJS.LTS`, then open a new terminal.)
- A **Firebase project** (free Spark plan is fine).

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Configure Firebase (see below), then copy the env template
cp .env.example .env       # on Windows PowerShell: Copy-Item .env.example .env
#   ...and fill in your VITE_FIREBASE_* values

# 3. Run the dev server
npm run dev                # http://localhost:5173
```

### Firebase setup

1. Create a project at <https://console.firebase.google.com>.
2. **Add a Web App** (the `</>` icon) and copy its config into `.env`:
   ```
   VITE_FIREBASE_API_KEY=...
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=...
   VITE_FIREBASE_APP_ID=...
   ```
3. **Authentication → Sign-in method →** enable **Email/Password**.
4. **Firestore Database → Create database** (production mode).
5. **Deploy the security rules** in [`firestore.rules`](firestore.rules):
   - Paste them into **Firestore → Rules** in the console and Publish, or
   - with the Firebase CLI: `firebase deploy --only firestore:rules`.

> Until `.env` is filled in, the app shows a friendly "Firebase isn't
> configured" screen instead of crashing.

## First run walkthrough

1. Go to **/register-org** → create your organization (you become the admin).
2. Sign out, open **/signup** → request access to that org as a teammate.
3. As the admin, go to **Admin** → approve the request.
4. Add a **Site**, schedule an **Audit**, work the clause checklist, **raise a
   finding**, open a **CAPA**, and drive it to **closure** — watch the
   **Dashboard** update in real time.

## Scripts

| Command           | Description                          |
| ----------------- | ------------------------------------ |
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Production build to `dist/`          |
| `npm run preview` | Preview the production build locally |

## Deployment (Vercel)

This is a static SPA. On Vercel, set the env vars (`VITE_FIREBASE_*`) in the
project settings; the included [`vercel.json`](vercel.json) rewrites all routes
to `index.html` for client-side routing. Build command `npm run build`, output
directory `dist`.

## Data model (Firestore)

```
organizations/{orgId}                  name, location, adminUid, createdAt
  ├─ sites/{siteId}                     name, location
  ├─ audits/{auditId}                   title, standard, siteId, scheduledDate,
  │                                     status, auditorUid, clauses[]
  ├─ findings/{findingId}               auditId, siteId, clause, description,
  │                                     severity, status, raisedByUid, dueDate
  └─ capas/{capaId}                     findingId, action, rootCause, assigneeUid,
                                        dueDate, status, verificationNote, closedAt
users/{uid}                            name, email, orgId, role, status, createdAt
```
