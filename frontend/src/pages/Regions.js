import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Regions() {
  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState({ name: '', state: '', area_hectares: '', crop_type: '' });
  const [msg, setMsg] = useState(null);

  const load = () => axios.get('/api/regions').then(r => setRegions(r.data));
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.name || !form.state || !form.area_hectares) {
      return setMsg({ type: 'error', text: 'Name, State, and Area are required.' });
    }
    try {
      await axios.post('/api/regions', form);
      setMsg({ type: 'success', text: 'Region added successfully!' });
      setForm({ name: '', state: '', area_hectares: '', crop_type: '' });
      load();
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Error adding region' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this region? All related data will be removed.')) return;
    await axios.delete(`/api/regions/${id}`);
    load();
  };

  return (
    <>
      <div className="page-header">
        <h1>🗺️ Regions</h1>
        <p>Manage monitored agricultural zones</p>
      </div>

      <div className="card">
        <h2>Add New Region</h2>
        {msg && <div className={`msg msg-${msg.type}`}>{msg.text}</div>}
        <div className="form-grid">
          <div className="form-group">
            <label>Region Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Coimbatore North" />
          </div>
          <div className="form-group">
            <label>State *</label>
            <input value={form.state} onChange={e => setForm({ ...form, state: e.target.value })} placeholder="e.g. Tamil Nadu" />
          </div>
          <div className="form-group">
            <label>Area (Hectares) *</label>
            <input type="number" value={form.area_hectares} onChange={e => setForm({ ...form, area_hectares: e.target.value })} placeholder="e.g. 1200" />
          </div>
          <div className="form-group">
            <label>Primary Crop Type</label>
            <input value={form.crop_type} onChange={e => setForm({ ...form, crop_type: e.target.value })} placeholder="e.g. Rice, Sugarcane" />
          </div>
        </div>
        <button className="btn btn-green" onClick={handleSubmit}>+ Add Region</button>
      </div>

      <div className="card">
        <h2>All Regions <span>{regions.length} total</span></h2>
        {regions.length === 0 ? <div className="empty">No regions found</div> : (
          <table>
            <thead>
              <tr><th>#</th><th>Name</th><th>State</th><th>Area (Ha)</th><th>Crop Type</th><th>Added</th><th>Action</th></tr>
            </thead>
            <tbody>
              {regions.map(r => (
                <tr key={r.id}>
                  <td>{r.id}</td>
                  <td><strong>{r.name}</strong></td>
                  <td>{r.state}</td>
                  <td>{r.area_hectares}</td>
                  <td>{r.crop_type || '—'}</td>
                  <td>{r.created_at?.slice(0, 10)}</td>
                  <td><button className="btn btn-red" onClick={() => handleDelete(r.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
