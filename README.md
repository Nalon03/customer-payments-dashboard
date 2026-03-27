# Customer Payments Dashboard

A focused React app for reviewing customer payment records: filter and search the list, sort columns, page through results against a real API, and open any row for full detail (including linked invoices when the backend sends them). Loading, empty, and error states are handled explicitly so the UI behaves predictably in production—not just in demos.

## What it does

- **List & filters** — Text search (debounced), optional date range, clear-all.
- **Table** — Sortable columns, striped rows, skeleton loading, responsive horizontal scroll on small screens.
- **Pagination** — Rows-per-page control and pager; the client loads data in **500-row server chunks** and slices the current page inside the loaded chunk, refetching only when the chunk index changes.
- **Detail** — Modal with payment summary, payee, payment modes, invoices, and remarks where present; focus is trapped in the dialog for keyboard users.
- **Formatting** — Dates and **GHS** amounts use `Intl` formatters.

## Tech stack

- React 19, Vite 8  
- Tailwind CSS 4 (`@tailwindcss/vite`)  
- Axios for HTTP, Lucide for icons  
- ESLint (flat config) with React Hooks and React Refresh plugins  

## Prerequisites

Use a current **Node.js LTS** (20.x or 22.x works well with this toolchain). Install dependencies with npm (or your preferred compatible client).

## Quick start

```bash
git clone https://github.com/Nalon03/customer-payments-dashboard.git
cd customer-payments-dashboard
npm install
npm run dev
```

Then open the URL Vite prints (usually `http://localhost:5173`).

## Configuration

All API calls go through a single Axios instance (`src/services/apiClient.js`). The base URL comes from:

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Base URL for the payments API. If unset, it defaults to **`/api`** (same origin as the app). |

Create a `.env.local` (or `.env.development` / `.env.production`) in the project root when you need to override it, for example:

```env
VITE_API_BASE_URL=https://your-api.example.com
```

Vite only exposes variables prefixed with `VITE_` to the client—never put secrets in those files.

### Local dev and `/api`

With the default base URL, the browser requests paths like `/api/Payments`. In development, Vite’s dev server can **proxy** `/api` to your real backend so you avoid CORS friction. The proxy **target** and **path rewrite** live in `vite.config.js`; adjust them to match your environment. The proxy is not used by `vite build` output—production either serves the app behind a reverse proxy that forwards `/api`, or you set `VITE_API_BASE_URL` to the full API origin (and ensure CORS is configured on the server if it’s a different host).

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Dev server with HMR |
| `npm run build` | Production bundle to `dist/` |
| `npm run preview` | Serve `dist/` locally to sanity-check the build |
| `npm run lint` | Run ESLint on the project |

## API expectations

The UI is built around a JSON API that roughly matches the following (names align with query params and paths in `src/services/paymentsService.js`):

- **`GET`** list endpoint with query parameters such as `PageNumber`, `PageSize`, `StartDate`, `EndDate`, `SearchQuery`.
- **`GET`** single payment by id for the detail modal.
- Optional **`X-Pagination`** response header: JSON object with fields like `totalCount`, `pageSize`, `currentPage`, `totalPages`. If missing, the client falls back to sensible defaults from the response body.

If your API differs, update `paymentsService.js` and the hook layer (`usePayments`, `usePaymentDetail`) rather than scattering fetch logic in components.

## Project layout (high level)

```
src/
  App.jsx                 # Shell: header, summary, filters, table, modal host
  components/payments/    # Filter bar, table, row, detail modal
  components/ui/          # Modal, buttons, badges, empty/error states, spinner
  hooks/                  # Data fetching and list state
  services/               # API client + payments API helpers
  constants/              # API paths, table column config
  utils/                  # Dates, currency, status → badge mapping
```

## Building for production

```bash
npm run build
```

Ship the contents of **`dist/`** as static files (any CDN or static host). Point `VITE_API_BASE_URL` at build time to wherever the browser should call the API, or terminate TLS at a gateway that routes `/api` to your backend.

---

Repository: [github.com/Nalon03/customer-payments-dashboard](https://github.com/Nalon03/customer-payments-dashboard)
