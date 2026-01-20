# Community Index Dashboard

Interactive dashboard for neighborhood-level indicators (poverty, benefits access, maternal health resources, housing stability) across time and geography.

## Goals
- Visualize indicators on a map with time slider
- Provide quick trends and comparisons for stakeholders
- Support data export for reports and grants

## Structure
- `frontend/` — Next.js + TypeScript UI
- `backend/` — API spec + schema (Laravel-ready)
- `infra/` — PostGIS docker compose
- `data/` — sample data placeholders

## Mock API (Next.js routes)
- `GET /api/regions` — school-centered Dallas index points from CRI CSV
- `GET /api/trends` — Dallas-wide averages for CRI category indices

## Run the UI
```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000` to view the dashboard.

## Data source
Place the Community Resource Explorer CSVs under:
`data/Community Resource Explorer/CRI_IndexValues_FullFinal.csv`

## Next steps
- Implement Laravel API + PostGIS ingestion
- Add CSV upload + validation pipeline
