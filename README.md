# RoshaLink Admin Portal

A modern, responsive React 19 management dashboard designed with the **RoshaLink** White-Smokey & Sky-Blue Glassmorphic design system.

## Key Features

- 📊 **Executive Dashboard:** Live metrics for total submissions, new leads, conversion status, and source breakdown.
- 📋 **Inquiries & Leads Management Tab:**
  - Real-time tabular and card views of leads stored in MongoDB.
  - Search by Name, Email, Phone, Company, Service, or Message content.
  - Filter by Status (`new`, `in-progress`, `contacted`, `closed`, `archived`) and Source (`connect-with-us`, `contact`, `get-started`, `chat`).
  - Quick status changer pill directly from the table.
  - Detailed lead inspection modal with one-click email reply, call, and data export (CSV/JSON).
  - Delete with safety confirmation.
- 🩺 **System & Database Health:** Live monitoring of MongoDB connectivity, uptime, and API latency.
- 🌓 **Aesthetics & Theme:** Full Dark/Light mode support, fluid glassmorphic cards, ambient lighting, and smooth Framer Motion animations.

## Getting Started

### 1. Installation

```bash
cd OurOwnWebsiteAdmin
npm install
```

### 2. Development

Start the development server:

```bash
npm run dev
```

The portal will be available at `http://localhost:5174`. Ensure `OurOwnWebstieBackend` is running on port `5000` (`npm run dev` in `OurOwnWebstieBackend`).

### 3. Production Build

```bash
npm run build
npm run preview
```

---

See [AGENTS.md](./AGENTS.md) for full architectural guidelines.
