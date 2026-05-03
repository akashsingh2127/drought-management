-- Drought Management & Irrigation System Database
CREATE DATABASE IF NOT EXISTS drought_management;
USE drought_management;

-- Regions/Zones table
CREATE TABLE IF NOT EXISTS regions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  area_hectares FLOAT NOT NULL,
  crop_type VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drought alerts table
CREATE TABLE IF NOT EXISTS drought_alerts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  region_id INT NOT NULL,
  severity ENUM('Low', 'Moderate', 'Severe', 'Extreme') NOT NULL,
  rainfall_mm FLOAT NOT NULL,
  soil_moisture_percent FLOAT NOT NULL,
  description TEXT,
  alert_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);

-- Irrigation schedules table
CREATE TABLE IF NOT EXISTS irrigation_schedules (
  id INT AUTO_INCREMENT PRIMARY KEY,
  region_id INT NOT NULL,
  method ENUM('Drip', 'Sprinkler', 'Flood', 'Furrow', 'Centre Pivot') NOT NULL,
  water_allocated_liters FLOAT NOT NULL,
  scheduled_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_minutes INT NOT NULL,
  status ENUM('Scheduled', 'Completed', 'Cancelled') DEFAULT 'Scheduled',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);

-- Water usage log
CREATE TABLE IF NOT EXISTS water_usage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  region_id INT NOT NULL,
  date DATE NOT NULL,
  water_used_liters FLOAT NOT NULL,
  source ENUM('Groundwater', 'Canal', 'Reservoir', 'Rainwater', 'Recycled') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);

-- Farmers table
CREATE TABLE IF NOT EXISTS farmers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(15) NOT NULL UNIQUE,
  email VARCHAR(100),
  region_id INT NOT NULL,
  land_area_acres FLOAT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id) ON DELETE CASCADE
);

-- Sample data
INSERT INTO regions (name, state, area_hectares, crop_type) VALUES
('Coimbatore North', 'Tamil Nadu', 1200.5, 'Sugarcane'),
('Madurai East', 'Tamil Nadu', 890.0, 'Rice'),
('Tirunelveli South', 'Tamil Nadu', 640.0, 'Cotton'),
('Trichy Central', 'Tamil Nadu', 1100.0, 'Groundnut');

INSERT INTO farmers (name, phone, email, region_id, land_area_acres) VALUES
('Rajan Kumar', '9876543210', 'rajan@gmail.com', 1, 12.5),
('Murugesan P', '9876543211', 'murugesan@gmail.com', 2, 8.0),
('Selvam T', '9876543212', NULL, 3, 15.0),
('Annamalai R', '9876543213', 'annamalai@gmail.com', 4, 20.0);

INSERT INTO drought_alerts (region_id, severity, rainfall_mm, soil_moisture_percent, description, alert_date) VALUES
(1, 'Moderate', 12.5, 28.0, 'Below average rainfall for 3 consecutive weeks', '2024-05-01'),
(2, 'Severe', 4.2, 15.0, 'Critical moisture levels, immediate irrigation needed', '2024-05-03'),
(3, 'Low', 22.0, 42.0, 'Slight dip in rainfall, monitoring in progress', '2024-05-02'),
(4, 'Extreme', 0.8, 8.5, 'Extreme drought conditions, crop failure risk', '2024-05-04');

INSERT INTO irrigation_schedules (region_id, method, water_allocated_liters, scheduled_date, start_time, duration_minutes, status) VALUES
(1, 'Drip', 50000, '2024-05-05', '06:00:00', 120, 'Scheduled'),
(2, 'Sprinkler', 75000, '2024-05-05', '05:30:00', 90, 'Completed'),
(3, 'Flood', 30000, '2024-05-06', '07:00:00', 60, 'Scheduled'),
(4, 'Drip', 90000, '2024-05-06', '06:00:00', 180, 'Scheduled');

INSERT INTO water_usage (region_id, date, water_used_liters, source) VALUES
(1, '2024-05-01', 48000, 'Canal'),
(2, '2024-05-01', 72000, 'Reservoir'),
(3, '2024-05-01', 28000, 'Groundwater'),
(4, '2024-05-01', 88000, 'Canal'),
(1, '2024-05-02', 51000, 'Canal'),
(2, '2024-05-02', 69000, 'Reservoir');
