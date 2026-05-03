import React from 'react';
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Regions from './pages/Regions';
import DroughtAlerts from './pages/DroughtAlerts';
import Irrigation from './pages/Irrigation';
import WaterUsage from './pages/WaterUsage';
import Farmers from './pages/Farmers';

function Sidebar() {
  const links = [
    { to: '/', icon: '🏠', label: 'Dashboard' },
    { to: '/regions', icon: '🗺️', label: 'Regions' },
    { to: '/alerts', icon: '🚨', label: 'Drought Alerts' },
    { to: '/irrigation', icon: '💧', label: 'Irrigation' },
    { to: '/water-usage', icon: '📊', label: 'Water Usage' },
    { to: '/farmers', icon: '👨‍🌾', label: 'Farmers' },
  ];
  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        🌾 Drought Management
        <span>& Irrigation System</span>
      </div>
      <nav>
        {links.map(l => (
          <NavLink key={l.to} to={l.to} end={l.to === '/'} className={({ isActive }) => isActive ? 'active' : ''}>
            <span className="icon">{l.icon}</span> {l.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <main className="main">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/regions" element={<Regions />} />
            <Route path="/alerts" element={<DroughtAlerts />} />
            <Route path="/irrigation" element={<Irrigation />} />
            <Route path="/water-usage" element={<WaterUsage />} />
            <Route path="/farmers" element={<Farmers />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
