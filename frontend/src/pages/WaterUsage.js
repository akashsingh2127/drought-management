import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function WaterUsage() {
  const [usage, setUsage] = useState([]);
  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState({ region_id: '', date: '', water_used_liters: '', source: '' });
  const [msg, setMsg] = useState(null);

  const load = () => {
    axios.get('/api/water-usage').then(r => setUsage(r.data));
    axios.get('/api/regions').then(r => setRegions(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    const { region_id, date, water_used_liters, source } = form;
    if (!region_id || !date || !water_used_liters || !source) {
      return setMsg({ type: 'error', text: 'All fields are required.' });
    }
    try {
      await axios.post('/api/water-usage', form);
      setMsg({ type: 'success', text: 'Water usage logged!' });
      setForm({ region_id: '', date: '', water_used_liters: '', source: '' });
      load();
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Error' });
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/water-usage/${id}`);
    load();
  };

  const total = usage.reduce((sum, u) => sum + (u.water_used_liters || 0), 0);

  return (
    <>
      <div className="page-header">
        <h1>📊 Water Usage</h1>
        <p>Log and monitor water consumption across all regions</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="label">Total Logged</div>
          <div className="value">{usage.length}</div>
          <div className="sub">Records</div>
        </div>
        <div className="stat-card">
          <div className="label">Total Water Used</div>
          <div className="value" style={{ color: '#1565c0' }}>{(total / 1000).toFixed(1)}k</div>
          <div className="sub">Litres</div>
        </div>
      </div>

      <div className="card">
        <h2>Log Water Usage</h2>
        {msg && <div className={`msg msg-${msg.type}`}>{msg.text}</div>}
        <div className="form-grid">
          <div className="form-group">
            <label>Region *</label>
            <select value={form.region_id} onChange={e => setForm({ ...form, region_id: e.target.value })}>
              <option value="">-- Select Region --</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Date *</label>
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Water Used (Liters) *</label>
            <input type="number" value={form.water_used_liters} onChange={e => setForm({ ...form, water_used_liters: e.target.value })} placeholder="e.g. 48000" />
          </div>
          <div className="form-group">
            <label>Water Source *</label>
            <select value={form.source} onChange={e => setForm({ ...form, source: e.target.value })}>
              <option value="">-- Select --</option>
              {['Groundwater', 'Canal', 'Reservoir', 'Rainwater', 'Recycled'].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <button className="btn btn-green" onClick={handleSubmit}>+ Log Usage</button>
      </div>

      <div className="card">
        <h2>Usage Records <span>{usage.length} entries</span></h2>
        {usage.length === 0 ? <div className="empty">No records</div> : (
          <table>
            <thead>
              <tr><th>Region</th><th>Date</th><th>Water Used (L)</th><th>Source</th><th>Logged At</th><th>Action</th></tr>
            </thead>
            <tbody>
              {usage.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.region_name}</strong></td>
                  <td>{u.date?.slice(0, 10)}</td>
                  <td>{u.water_used_liters?.toLocaleString()}</td>
                  <td><span className="badge badge-scheduled">{u.source}</span></td>
                  <td>{u.created_at?.slice(0, 16).replace('T', ' ')}</td>
                  <td><button className="btn btn-red" onClick={() => handleDelete(u.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
