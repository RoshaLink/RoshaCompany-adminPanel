# AGENTS.md — RoshaLink React Admin Panel Guide

> **Source of Truth for AI Coding Agents & Developers working on `OurOwnWebsiteAdmin`.**
> This file describes the design philosophy, folder structure, API integration, and continuous changelog of tasks.
>
> ⚠️ **RULE FOR AGENTS:** Update this file's **Changelog & Task History** section after completing any task or making structural additions!

---

## 1. Project Overview

`OurOwnWebsiteAdmin` is the executive management portal for the **RoshaLink** platform. It provides a real-time command dashboard for reviewing inquiries submitted across all frontend funnels (`ConnectWithUsShowcase`, `ContactPage`, `GetStartedModal`, and `RoshaChatWidget`), changing lead statuses, inspecting communication details, and monitoring system health.

---

## 2. Design System & Aesthetics

The Admin Panel adheres 100% to RoshaLink's design language:
- **Theme Modes:** Light (White Smokey & Sky Blue) and Dark (Obsidian & Cyan Neon).
- **Glassmorphism:** Translucent blurred cards (`.glass-card`, `backdrop-blur-xl`), subtle borders, glowing radial ambient lighting (`.ambient-glow-cyan`, `.ambient-glow-purple`).
- **Typography:** `Montserrat` / `Vazirmatn` for headers, `Inter` for data tables and body text, `Geist` for code/meta tags.
- **Icons:** `lucide-react` with consistent stroke width and subtle hover transitions.
- **Animation:** `framer-motion` for fluid tab transitions, modal entrances, and status changes.

---

## 3. Directory Structure

```
OurOwnWebsiteAdmin/
├── AGENTS.md                         # Architecture guide & changelog
├── README.md                         # Onboarding and run instructions
├── .env / .env.example               # API base URL configuration
├── package.json                      # Dependencies & scripts
├── vite.config.js                    # Dev server and proxy to backend
├── index.html                        # Fonts, Tailwind CDN & theme setup
└── src/
    ├── config/
    │   └── api.js                    # Centralized API requests client
    ├── context/
    │   ├── ThemeContext.jsx          # Dark/Light mode provider
    │   └── AdminContext.jsx          # Lead management, stats & toast notifications state
    ├── components/
    │   ├── Layout/
    │   │   ├── AdminSidebar.jsx      # Navigation sidebar with tab switcher
    │   │   ├── AdminNavbar.jsx       # Header with search, stats, theme toggle, live refresh
    │   │   └── AdminLayout.jsx       # Main layout wrapper
    │   ├── Leads/
    │   │   ├── LeadsTable.jsx        # Data table for inquiries with multi-column sorting
    │   │   ├── LeadDetailModal.jsx   # Drawer/Modal with customer details & quick actions
    │   │   ├── LeadStatusBadge.jsx   # Status pill with quick updater dropdown
    │   │   └── LeadFilters.jsx       # Filters by status, source, search & export
    │   ├── Dashboard/
    │   │   ├── StatsOverview.jsx     # KPI metric cards (Total, New, Contacted, Closed)
    │   │   ├── SourceDistribution.jsx# Visual distribution of leads by frontend source
    │   │   └── RecentLeadsCard.jsx   # Quick view of latest submissions
    │   └── ui/
    │       ├── GlassCard.jsx         # Glassmorphic container wrapper
    │       ├── ThemeSwitch.jsx       # Dark/Light toggle
    │       └── Toast.jsx             # Action feedback notifications
    ├── pages/
    │   ├── DashboardPage.jsx         # Executive overview & KPIs
    │   ├── LeadsManagementPage.jsx   # Dedicated Inquiries/Leads management tab
    │   ├── AnalyticsPage.jsx         # In-depth analytics & source breakdown
    │   └── SystemHealthPage.jsx      # MongoDB connection and server health monitor
    ├── index.css                     # Design tokens, custom scrollbars, glass utilities
    ├── App.jsx                       # Tab routing & notifications
    └── main.jsx                      # App root mount
```

---

## 4. API Endpoints Used

| Action | HTTP Verb | Backend Endpoint |
|---|---|---|
| Health Check | `GET` | `/api/health` |
| Admin Login | `POST` | `/api/auth/login` |
| Current Admin Profile| `GET` | `/api/auth/me` |
| Retrieve Inquiries | `GET` | `/api/leads?page=1&limit=20&status=&source=&search=` (Requires JWT) |
| Inquiry Stats | `GET` | `/api/leads/stats` (Requires JWT) |
| Single Inquiry Detail | `GET` | `/api/leads/:id` (Requires JWT) |
| Update Status | `PATCH` | `/api/leads/:id/status` (Requires JWT) |
| Delete Inquiry | `DELETE` | `/api/leads/:id` (Requires JWT) |

---

## 5. Changelog & Task History

### Task #1: Initial Admin Panel Setup & Lead Management Portal (2026-08-29)
- Configured Vite + React 19 single-page app matching RoshaLink's design system.
- Implemented Dark / Light theme persistence with ambient glow effects and Glassmorphism styling.
- Created dedicated **Leads & Inquiries Tab** (`LeadsManagementPage.jsx`) with live search, status filtering, source filtering, quick status updates, detailed view drawer, and CSV export.
- Built **Dashboard Overview** (`DashboardPage.jsx`) with KPI metrics, source distribution charts, and recent activity.
- Built **System Health Monitor** (`SystemHealthPage.jsx`) for checking live MongoDB and backend status.
- Created comprehensive `AGENTS.md` and `README.md`.

### Task #2: Authentication, Security & Login Page (2026-08-29)
- Implemented `AuthContext.jsx` with token persistence in `localStorage` and dynamic JWT Bearer token header injection in `api.js`.
- Created glassmorphic `LoginPage.jsx` with password visibility toggle, error handling, brute-force awareness, and quick-login chips for team members (`Bella`, `Milad`, `Morteza`, `Sohrab`, `Mina`).
- Updated `AdminNavbar` and `AdminSidebar` with active user indicator and Logout functionality.
- Protected all admin routes and verified zero-error production build.
