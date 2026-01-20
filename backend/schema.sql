CREATE EXTENSION IF NOT EXISTS postgis;

CREATE TABLE IF NOT EXISTS neighborhoods (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  geo_id TEXT UNIQUE NOT NULL,
  geom GEOMETRY(MULTIPOLYGON, 4326) NOT NULL
);

CREATE TABLE IF NOT EXISTS indicators (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  label TEXT NOT NULL,
  unit TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS indicator_values (
  id SERIAL PRIMARY KEY,
  neighborhood_id INTEGER REFERENCES neighborhoods(id),
  indicator_id INTEGER REFERENCES indicators(id),
  year INTEGER NOT NULL,
  value NUMERIC NOT NULL,
  source TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_indicator_values_year ON indicator_values(year);
CREATE INDEX IF NOT EXISTS idx_indicator_values_indicator ON indicator_values(indicator_id);
CREATE INDEX IF NOT EXISTS idx_neighborhoods_geom ON neighborhoods USING GIST(geom);
