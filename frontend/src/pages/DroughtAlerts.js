import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function DroughtAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState({
    region_id: '', severity: '', rainfall_mm: '', soil_moisture_percent: '', description: '', alert_date: ''
  });
  const [msg, setMsg] = useState(null);

  const load = () => {
    axios.get('/api/drought-alerts').then(r => setAlerts(r.data));
    axios.get('/api/regions').then(r => setRegions(r.data));
  };
  useEffect(() => { load(); }, []);

  const severityBadge = s => {
    const m = { Low: 'badge-low', Moderate: 'badge-moderate', Severe: 'badge-severe', Extreme: 'badge-extreme' };
    return <span className={`badge ${m[s] || ''}`}>{s}</span>;
  };

  const handleSubmit = async () => {
    if (!form.region_id || !form.severity || form.rainfall_mm === '' || form.soil_moisture_percent === '' || !form.alert_date) {
      return setMsg({ type: 'error', text: 'All fields except description are required.' });
    }
    try {
      await axios.post('/api/drought-alerts', form);
      setMsg({ type: 'success', text: 'Drought alert recorded!' });
      setForm({ region_id: '', severity: '', rainfall_mm: '', soil_moisture_percent: '', description: '', alert_date: '' });
      load();
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Error adding alert' });
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/drought-alerts/${id}`);
    load();
  };

  return (
    <>
      <div className="page-header">
        <h1>🚨 Drought Alerts</h1>
        <p>Record and monitor drought severity across regions</p>
      </div>

      <div className="card">
        <h2>Log New Alert</h2>
        {msg && <div className={`msg msg-${msg.type}`}>{msg.text}</div>}
        <div className="form-grid">
          <div className="form-group">
            <label>Region *</label>
            <select value={form.region_id} onChange={e => setForm({ ...form, region_id: e.target.value })}>
              <option value="">-- Select Region --</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.name}, {r.state}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Severity *</label>
            <select value={form.severity} onChange={e => setForm({ ...form, severity: e.target.value })}>
              <option value="">-- Select --</option>
              {['Low', 'Moderate', 'Severe', 'Extreme'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Rainfall (mm) *</label>
            <input type="number" step="0.1" value={form.rainfall_mm} onChange={e => setForm({ ...form, rainfall_mm: e.target.value })} placeholder="e.g. 12.5" />
          </div>
          <div className="form-group">
            <label>Soil Moisture (%) *</label>
            <input type="number" step="0.1" min="0" max="100" value={form.soil_moisture_percent} onChange={e => setForm({ ...form, soil_moisture_percent: e.target.value })} placeholder="e.g. 28" />
          </div>
          <div className="form-group">
            <label>Alert Date *</label>
            <input type="date" value={form.alert_date} onChange={e => setForm({ ...form, alert_date: e.target.value })} />
          </div>
          <div className="form-group" style={{ gridColumn: 'span 2' }}>
            <label>Description</label>
            <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Additional notes about conditions..." />
          </div>
        </div>
        <button className="btn btn-green" onClick={handleSubmit}>+ Log Alert</button>
      </div>

      <div className="card">
        <h2>All Drought Alerts <span>{alerts.length} records</span></h2>
        {alerts.length === 0 ? <div className="empty">No alerts recorded</div> : (
          <table>
            <thead>
              <tr><th>Region</th><th>State</th><th>Severity</th><th>Rainfall (mm)</th><th>Soil Moisture (%)</th><th>Date</th><th>Action</th></tr>
            </thead>
            <tbody>
              {alerts.map(a => (
                <tr key={a.id}>
                  <td><strong>{a.region_name}</strong></td>
                  <td>{a.state}</td>
                  <td>{severityBadge(a.severity)}</td>
                  <td>{a.rainfall_mm}</td>
                  <td>{a.soil_moisture_percent}%</td>
                  <td>{a.alert_date?.slice(0, 10)}</td>
                  <td><button className="btn btn-red" onClick={() => handleDelete(a.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
