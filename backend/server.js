const path = require('path'); // Load path module
require('dotenv').config({ path: path.join(__dirname, '.env') }); // Explicitly load .env from the current directory

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────
// ROOT
// ─────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: 'Drought Management API is running ✅' });
});

// ─────────────────────────────────────────
// REGIONS
// ─────────────────────────────────────────
app.get('/api/regions', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM regions ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/regions', async (req, res) => {
  const { name, state, area_hectares, crop_type } = req.body;
  if (!name || !state || !area_hectares) {
    return res.status(400).json({ error: 'name, state, and area_hectares are required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO regions (name, state, area_hectares, crop_type) VALUES (?, ?, ?, ?)',
      [name, state, area_hectares, crop_type || null]
    );
    res.status(201).json({ id: result.insertId, message: 'Region added successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/regions/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM regions WHERE id = ?', [req.params.id]);
    res.json({ message: 'Region deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// DROUGHT ALERTS
// ─────────────────────────────────────────
app.get('/api/drought-alerts', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT da.*, r.name AS region_name, r.state
      FROM drought_alerts da
      JOIN regions r ON da.region_id = r.id
      ORDER BY da.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/drought-alerts', async (req, res) => {
  const { region_id, severity, rainfall_mm, soil_moisture_percent, description, alert_date } = req.body;
  if (!region_id || !severity || rainfall_mm == null || soil_moisture_percent == null || !alert_date) {
    return res.status(400).json({ error: 'All fields except description are required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO drought_alerts (region_id, severity, rainfall_mm, soil_moisture_percent, description, alert_date) VALUES (?, ?, ?, ?, ?, ?)',
      [region_id, severity, rainfall_mm, soil_moisture_percent, description || null, alert_date]
    );
    res.status(201).json({ id: result.insertId, message: 'Drought alert added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/drought-alerts/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM drought_alerts WHERE id = ?', [req.params.id]);
    res.json({ message: 'Alert deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// IRRIGATION SCHEDULES
// ─────────────────────────────────────────
app.get('/api/irrigation', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT ir.*, r.name AS region_name
      FROM irrigation_schedules ir
      JOIN regions r ON ir.region_id = r.id
      ORDER BY ir.scheduled_date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/irrigation', async (req, res) => {
  const { region_id, method, water_allocated_liters, scheduled_date, start_time, duration_minutes } = req.body;
  if (!region_id || !method || !water_allocated_liters || !scheduled_date || !start_time || !duration_minutes) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO irrigation_schedules (region_id, method, water_allocated_liters, scheduled_date, start_time, duration_minutes) VALUES (?, ?, ?, ?, ?, ?)',
      [region_id, method, water_allocated_liters, scheduled_date, start_time, duration_minutes]
    );
    res.status(201).json({ id: result.insertId, message: 'Irrigation schedule added' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/irrigation/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!['Scheduled', 'Completed', 'Cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    await db.query('UPDATE irrigation_schedules SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: 'Status updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/irrigation/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM irrigation_schedules WHERE id = ?', [req.params.id]);
    res.json({ message: 'Schedule deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// WATER USAGE
// ─────────────────────────────────────────
app.get('/api/water-usage', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT wu.*, r.name AS region_name
      FROM water_usage wu
      JOIN regions r ON wu.region_id = r.id
      ORDER BY wu.date DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/water-usage', async (req, res) => {
  const { region_id, date, water_used_liters, source } = req.body;
  if (!region_id || !date || !water_used_liters || !source) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO water_usage (region_id, date, water_used_liters, source) VALUES (?, ?, ?, ?)',
      [region_id, date, water_used_liters, source]
    );
    res.status(201).json({ id: result.insertId, message: 'Water usage logged' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/water-usage/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM water_usage WHERE id = ?', [req.params.id]);
    res.json({ message: 'Record deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// FARMERS
// ─────────────────────────────────────────
app.get('/api/farmers', async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT f.*, r.name AS region_name
      FROM farmers f
      JOIN regions r ON f.region_id = r.id
      ORDER BY f.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/farmers', async (req, res) => {
  const { name, phone, email, region_id, land_area_acres } = req.body;
  if (!name || !phone || !region_id || !land_area_acres) {
    return res.status(400).json({ error: 'name, phone, region_id, and land_area_acres are required' });
  }
  try {
    const [result] = await db.query(
      'INSERT INTO farmers (name, phone, email, region_id, land_area_acres) VALUES (?, ?, ?, ?, ?)',
      [name, phone, email || null, region_id, land_area_acres]
    );
    res.status(201).json({ id: result.insertId, message: 'Farmer registered' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/api/farmers/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM farmers WHERE id = ?', [req.params.id]);
    res.json({ message: 'Farmer removed' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ─────────────────────────────────────────
// DASHBOARD STATS
// ─────────────────────────────────────────
app.get('/api/stats', async (req, res) => {
  try {
    const [[{ total_regions }]] = await db.query('SELECT COUNT(*) AS total_regions FROM regions');
    const [[{ total_farmers }]] = await db.query('SELECT COUNT(*) AS total_farmers FROM farmers');
    const [[{ total_alerts }]] = await db.query('SELECT COUNT(*) AS total_alerts FROM drought_alerts');
    const [[{ total_water }]] = await db.query('SELECT COALESCE(SUM(water_used_liters),0) AS total_water FROM water_usage');
    const [[{ scheduled_irrigations }]] = await db.query("SELECT COUNT(*) AS scheduled_irrigations FROM irrigation_schedules WHERE status='Scheduled'");
    const [severityCounts] = await db.query(`
      SELECT severity, COUNT(*) AS count FROM drought_alerts GROUP BY severity
    `);
    res.json({ total_regions, total_farmers, total_alerts, total_water, scheduled_irrigations, severityCounts });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🌱 Drought Management Server running at http://localhost:${PORT}`);
});