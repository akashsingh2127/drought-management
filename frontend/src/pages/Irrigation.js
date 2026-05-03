import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Irrigation() {
  const [schedules, setSchedules] = useState([]);
  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState({
    region_id: '', method: '', water_allocated_liters: '', scheduled_date: '', start_time: '', duration_minutes: ''
  });
  const [msg, setMsg] = useState(null);

  const load = () => {
    axios.get('/api/irrigation').then(r => setSchedules(r.data));
    axios.get('/api/regions').then(r => setRegions(r.data));
  };
  useEffect(() => { load(); }, []);

  const statusBadge = s => {
    const m = { Scheduled: 'badge-scheduled', Completed: 'badge-completed', Cancelled: 'badge-cancelled' };
    return <span className={`badge ${m[s] || ''}`}>{s}</span>;
  };

  const handleSubmit = async () => {
    const { region_id, method, water_allocated_liters, scheduled_date, start_time, duration_minutes } = form;
    if (!region_id || !method || !water_allocated_liters || !scheduled_date || !start_time || !duration_minutes) {
      return setMsg({ type: 'error', text: 'All fields are required.' });
    }
    try {
      await axios.post('/api/irrigation', form);
      setMsg({ type: 'success', text: 'Irrigation schedule added!' });
      setForm({ region_id: '', method: '', water_allocated_liters: '', scheduled_date: '', start_time: '', duration_minutes: '' });
      load();
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Error' });
    }
  };

  const updateStatus = async (id, status) => {
    await axios.put(`/api/irrigation/${id}/status`, { status });
    load();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/irrigation/${id}`);
    load();
  };

  return (
    <>
      <div className="page-header">
        <h1>💧 Irrigation Schedules</h1>
        <p>Plan and track irrigation activities</p>
      </div>

      <div className="card">
        <h2>Schedule Irrigation</h2>
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
            <label>Irrigation Method *</label>
            <select value={form.method} onChange={e => setForm({ ...form, method: e.target.value })}>
              <option value="">-- Select --</option>
              {['Drip', 'Sprinkler', 'Flood', 'Furrow', 'Centre Pivot'].map(m => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Water Allocated (Liters) *</label>
            <input type="number" value={form.water_allocated_liters} onChange={e => setForm({ ...form, water_allocated_liters: e.target.value })} placeholder="e.g. 50000" />
          </div>
          <div className="form-group">
            <label>Scheduled Date *</label>
            <input type="date" value={form.scheduled_date} onChange={e => setForm({ ...form, scheduled_date: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Start Time *</label>
            <input type="time" value={form.start_time} onChange={e => setForm({ ...form, start_time: e.target.value })} />
          </div>
          <div className="form-group">
            <label>Duration (Minutes) *</label>
            <input type="number" value={form.duration_minutes} onChange={e => setForm({ ...form, duration_minutes: e.target.value })} placeholder="e.g. 120" />
          </div>
        </div>
        <button className="btn btn-green" onClick={handleSubmit}>+ Schedule</button>
      </div>

      <div className="card">
        <h2>All Schedules <span>{schedules.length} records</span></h2>
        {schedules.length === 0 ? <div className="empty">No schedules</div> : (
          <table>
            <thead>
              <tr><th>Region</th><th>Method</th><th>Water (L)</th><th>Date</th><th>Time</th><th>Duration</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {schedules.map(s => (
                <tr key={s.id}>
                  <td><strong>{s.region_name}</strong></td>
                  <td>{s.method}</td>
                  <td>{s.water_allocated_liters?.toLocaleString()}</td>
                  <td>{s.scheduled_date?.slice(0, 10)}</td>
                  <td>{s.start_time}</td>
                  <td>{s.duration_minutes} min</td>
                  <td>{statusBadge(s.status)}</td>
                  <td style={{ display: 'flex', gap: 6 }}>
                    {s.status === 'Scheduled' && <>
                      <button className="btn btn-blue" onClick={() => updateStatus(s.id, 'Completed')}>✓ Done</button>
                      <button className="btn btn-red" onClick={() => updateStatus(s.id, 'Cancelled')}>✗ Cancel</button>
                    </>}
                    <button className="btn btn-red" onClick={() => handleDelete(s.id)}>🗑</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
