import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [irrigation, setIrrigation] = useState([]);

  useEffect(() => {
    axios.get('/api/stats').then(r => setStats(r.data));
    axios.get('/api/drought-alerts').then(r => setAlerts(r.data.slice(0, 5)));
    axios.get('/api/irrigation').then(r => setIrrigation(r.data.filter(i => i.status === 'Scheduled').slice(0, 5)));
  }, []);

  const severityBadge = s => {
    const m = { Low: 'badge-low', Moderate: 'badge-moderate', Severe: 'badge-severe', Extreme: 'badge-extreme' };
    return <span className={`badge ${m[s] || ''}`}>{s}</span>;
  };

  return (
    <>
      <div className="page-header">
        <h1>🌾 Dashboard</h1>
        <p>Overview of drought conditions and irrigation status</p>
      </div>

      {stats && (
        <div className="stats-row">
          <div className="stat-card">
            <div className="label">Total Regions</div>
            <div className="value">{stats.total_regions}</div>
            <div className="sub">Monitored zones</div>
          </div>
          <div className="stat-card">
            <div className="label">Registered Farmers</div>
            <div className="value">{stats.total_farmers}</div>
            <div className="sub">Active farmers</div>
          </div>
          <div className="stat-card">
            <div className="label">Drought Alerts</div>
            <div className="value" style={{ color: '#c62828' }}>{stats.total_alerts}</div>
            <div className="sub">Total issued</div>
          </div>
          <div className="stat-card">
            <div className="label">Total Water Used</div>
            <div className="value" style={{ color: '#1565c0' }}>{(stats.total_water / 1000).toFixed(1)}k</div>
            <div className="sub">Litres consumed</div>
          </div>
          <div className="stat-card">
            <div className="label">Pending Irrigations</div>
            <div className="value" style={{ color: '#e65100' }}>{stats.scheduled_irrigations}</div>
            <div className="sub">Scheduled</div>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div className="card">
          <h2>Recent Drought Alerts <span>latest 5</span></h2>
          {alerts.length === 0 ? <div className="empty">No alerts</div> : (
            <table>
              <thead><tr><th>Region</th><th>Severity</th><th>Rainfall (mm)</th><th>Date</th></tr></thead>
              <tbody>
                {alerts.map(a => (
                  <tr key={a.id}>
                    <td>{a.region_name}</td>
                    <td>{severityBadge(a.severity)}</td>
                    <td>{a.rainfall_mm}</td>
                    <td>{a.alert_date?.slice(0, 10)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="card">
          <h2>Upcoming Irrigations <span>scheduled</span></h2>
          {irrigation.length === 0 ? <div className="empty">No scheduled irrigations</div> : (
            <table>
              <thead><tr><th>Region</th><th>Method</th><th>Date</th><th>Duration</th></tr></thead>
              <tbody>
                {irrigation.map(i => (
                  <tr key={i.id}>
                    <td>{i.region_name}</td>
                    <td>{i.method}</td>
                    <td>{i.scheduled_date?.slice(0, 10)}</td>
                    <td>{i.duration_minutes} min</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {stats?.severityCounts?.length > 0 && (
        <div className="card">
          <h2>Alert Severity Breakdown</h2>
          <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {stats.severityCounts.map(s => (
              <div key={s.severity} className="stat-card" style={{ minWidth: 120, flex: '0 0 auto' }}>
                <div className="label">{s.severity}</div>
                <div className="value">{s.count}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
