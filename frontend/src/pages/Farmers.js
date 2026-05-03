import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Farmers() {
  const [farmers, setFarmers] = useState([]);
  const [regions, setRegions] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', email: '', region_id: '', land_area_acres: '' });
  const [msg, setMsg] = useState(null);

  const load = () => {
    axios.get('/api/farmers').then(r => setFarmers(r.data));
    axios.get('/api/regions').then(r => setRegions(r.data));
  };
  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    const { name, phone, region_id, land_area_acres } = form;
    if (!name || !phone || !region_id || !land_area_acres) {
      return setMsg({ type: 'error', text: 'Name, Phone, Region, and Land Area are required.' });
    }
    try {
      await axios.post('/api/farmers', form);
      setMsg({ type: 'success', text: 'Farmer registered!' });
      setForm({ name: '', phone: '', email: '', region_id: '', land_area_acres: '' });
      load();
    } catch (e) {
      setMsg({ type: 'error', text: e.response?.data?.error || 'Phone number might already be registered.' });
    }
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/farmers/${id}`);
    load();
  };

  return (
    <>
      <div className="page-header">
        <h1>👨‍🌾 Farmers</h1>
        <p>Register and manage farmers linked to regions</p>
      </div>

      <div className="card">
        <h2>Register Farmer</h2>
        {msg && <div className={`msg msg-${msg.type}`}>{msg.text}</div>}
        <div className="form-grid">
          <div className="form-group">
            <label>Full Name *</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Rajan Kumar" />
          </div>
          <div className="form-group">
            <label>Phone *</label>
            <input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="e.g. 9876543210" />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Optional" />
          </div>
          <div className="form-group">
            <label>Region *</label>
            <select value={form.region_id} onChange={e => setForm({ ...form, region_id: e.target.value })}>
              <option value="">-- Select Region --</option>
              {regions.map(r => <option key={r.id} value={r.id}>{r.name}, {r.state}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label>Land Area (Acres) *</label>
            <input type="number" step="0.1" value={form.land_area_acres} onChange={e => setForm({ ...form, land_area_acres: e.target.value })} placeholder="e.g. 12.5" />
          </div>
        </div>
        <button className="btn btn-green" onClick={handleSubmit}>+ Register Farmer</button>
      </div>

      <div className="card">
        <h2>Registered Farmers <span>{farmers.length} total</span></h2>
        {farmers.length === 0 ? <div className="empty">No farmers registered</div> : (
          <table>
            <thead>
              <tr><th>#</th><th>Name</th><th>Phone</th><th>Email</th><th>Region</th><th>Land (Acres)</th><th>Registered</th><th>Action</th></tr>
            </thead>
            <tbody>
              {farmers.map(f => (
                <tr key={f.id}>
                  <td>{f.id}</td>
                  <td><strong>{f.name}</strong></td>
                  <td>{f.phone}</td>
                  <td>{f.email || '—'}</td>
                  <td>{f.region_name}</td>
                  <td>{f.land_area_acres}</td>
                  <td>{f.created_at?.slice(0, 10)}</td>
                  <td><button className="btn btn-red" onClick={() => handleDelete(f.id)}>Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
