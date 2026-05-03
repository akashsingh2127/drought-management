# 🌾 Drought Management & Irrigation System

A full-stack web application built with:
- **Frontend**: React.js
- **Backend**: Node.js + Express.js
- **Database**: MySQL

---

## 📁 Project Structure

```
drought-management/
├── backend/
│   ├── server.js       ← Express API (all routes)
│   ├── db.js           ← MySQL connection pool
│   ├── schema.sql      ← Database schema + sample data
│   └── package.json
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── App.js          ← Routing + Sidebar
    │   ├── index.js
    │   ├── index.css       ← Global styles
    │   └── pages/
    │       ├── Dashboard.js
    │       ├── Regions.js
    │       ├── DroughtAlerts.js
    │       ├── Irrigation.js
    │       ├── WaterUsage.js
    │       └── Farmers.js
    └── package.json
```

---

## ⚙️ Setup Instructions

### Step 1 — MySQL Setup
1. Open MySQL Workbench or terminal
2. Run the schema file:
   ```sql
   source /path/to/drought-management/backend/schema.sql
   ```
   Or copy-paste the contents of `schema.sql` into MySQL Workbench and execute.

3. Edit `backend/db.js` and update your MySQL credentials:
   ```js
   user: 'root',      // your MySQL username
   password: '',      // your MySQL password
   ```

### Step 2 — Start the Backend
```bash
cd drought-management/backend
npm install
npm run dev        # uses nodemon for auto-restart
# OR
npm start
```
Server runs at: **http://localhost:5000**

### Step 3 — Start the Frontend
Open a new terminal:
```bash
cd drought-management/frontend
npm install
npm start
```
App opens at: **http://localhost:3000**

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/regions | Get all regions |
| POST | /api/regions | Add a region |
| DELETE | /api/regions/:id | Delete a region |
| GET | /api/drought-alerts | Get all alerts |
| POST | /api/drought-alerts | Add an alert |
| DELETE | /api/drought-alerts/:id | Delete an alert |
| GET | /api/irrigation | Get all schedules |
| POST | /api/irrigation | Add a schedule |
| PUT | /api/irrigation/:id/status | Update status |
| DELETE | /api/irrigation/:id | Delete schedule |
| GET | /api/water-usage | Get all usage logs |
| POST | /api/water-usage | Log water usage |
| DELETE | /api/water-usage/:id | Delete log |
| GET | /api/farmers | Get all farmers |
| POST | /api/farmers | Register farmer |
| DELETE | /api/farmers/:id | Delete farmer |
| GET | /api/stats | Dashboard statistics |

---

## 🗄️ Database Tables

- **regions** — Agricultural zones (name, state, area, crop type)
- **drought_alerts** — Severity, rainfall, soil moisture per region
- **irrigation_schedules** — Method, water, schedule, status
- **water_usage** — Daily water consumption per region
- **farmers** — Farmer info linked to regions

---

## ✅ For the Review — Key Flows to Demonstrate

1. **Frontend → Backend**: Fill any form → Click Add → React sends `axios.post()` → Express receives it
2. **Backend → Database**: Express runs `db.query(INSERT ...)` → MySQL stores data
3. **Database → Frontend**: Page loads → `axios.get()` → Express runs `SELECT` → Data shown in table
4. **Live Update**: After adding data, the table re-fetches and shows the new record instantly
