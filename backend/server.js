const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const db = new sqlite3.Database('./vms.db', (err) => {
  if (err) console.error(err.message);
  else console.log('Connected to the SQLite database.');
});

// Initialize Tables
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    password TEXT,
    role TEXT,
    modules TEXT
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS visitors (
    id TEXT PRIMARY KEY,
    name TEXT,
    phone TEXT,
    manager TEXT,
    purpose TEXT,
    checkIn TEXT,
    checkOut TEXT,
    status TEXT,
    photoBase64 TEXT
  )`);
  
  db.run(`CREATE TABLE IF NOT EXISTS invites (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT,
    phone TEXT,
    purpose TEXT,
    date TEXT,
    time TEXT,
    method TEXT,
    host TEXT,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS deliveries (
    id TEXT PRIMARY KEY,
    courier TEXT,
    recipient TEXT,
    status TEXT,
    time TEXT,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS watchlist (
    id TEXT PRIMARY KEY,
    name TEXT,
    reason TEXT,
    date TEXT,
    createdAt TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS push_tokens (
    user_id TEXT PRIMARY KEY,
    token TEXT,
    updatedAt TEXT
  )`);

  // Insert default admin if no users exist
  db.get("SELECT COUNT(*) as count FROM users", [], (err, row) => {
    if (row.count === 0) {
      const defaultModules = JSON.stringify(['/', '/add', '/logs', '/invites', '/deliveries', '/watchlist', '/evacuation', '/manage', '/settings']);
      db.run(`INSERT INTO users (id, name, email, password, role, modules) VALUES (?,?,?,?,?,?)`, 
        ['1', 'Super Admin', 'admin@vms.com', 'admin', 'Admin', defaultModules]);
    }
  });
});

// Users Routes
app.get('/api/users', (req, res) => {
  db.all("SELECT * FROM users", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows.map(row => ({...row, modules: JSON.parse(row.modules)})));
  });
});

app.post('/api/users', (req, res) => {
  const { id, name, email, password, role, modules } = req.body;
  db.run(`INSERT INTO users (id, name, email, password, role, modules) VALUES (?,?,?,?,?,?)`,
    [id, name, email, password, role, JSON.stringify(modules)], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id, name, email, password, role, modules });
    });
});

app.delete('/api/users/:id', (req, res) => {
  db.run("DELETE FROM users WHERE id = ?", req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Visitors Routes
app.get('/api/visitors', (req, res) => {
  db.all("SELECT * FROM visitors ORDER BY checkIn DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/visitors', (req, res) => {
  const { id, name, phone, manager, purpose, checkIn, status, photoBase64 } = req.body;
  db.run(`INSERT INTO visitors (id, name, phone, manager, purpose, checkIn, status, photoBase64) VALUES (?,?,?,?,?,?,?,?)`,
    [id, name, phone, manager, purpose, checkIn, status, photoBase64], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json(req.body);
    });
});

app.put('/api/visitors/:id/checkout', (req, res) => {
  const { checkOut, status } = req.body;
  db.run("UPDATE visitors SET checkOut = ?, status = ? WHERE id = ?", [checkOut, status, req.params.id], function(err) {
     if (err) return res.status(500).json({ error: err.message });
     res.json({ id: req.params.id, checkOut, status });
  });
});

// Invites Routes
app.get('/api/invites', (req, res) => {
  db.all("SELECT * FROM invites ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/invites', (req, res) => {
  const { id, name, email, phone, purpose, date, time, method, host, createdAt } = req.body;
  db.run(`INSERT INTO invites (id, name, email, phone, purpose, date, time, method, host, createdAt) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    [id, name, email, phone, purpose, date, time, method, host, createdAt], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json(req.body);
    });
});

// Deliveries Routes
app.get('/api/deliveries', (req, res) => {
  db.all("SELECT * FROM deliveries ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/deliveries', (req, res) => {
  const { id, courier, recipient, status, time, createdAt } = req.body;
  db.run(`INSERT INTO deliveries (id, courier, recipient, status, time, createdAt) VALUES (?,?,?,?,?,?)`,
    [id, courier, recipient, status, time, createdAt], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json(req.body);
    });
});

app.put('/api/deliveries/:id', (req, res) => {
  const { status } = req.body;
  db.run("UPDATE deliveries SET status = ? WHERE id = ?", [status, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: req.params.id, status });
  });
});

// Watchlist Routes
app.get('/api/watchlist', (req, res) => {
  db.all("SELECT * FROM watchlist ORDER BY createdAt DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/watchlist', (req, res) => {
  const { id, name, reason, date, createdAt } = req.body;
  db.run(`INSERT INTO watchlist (id, name, reason, date, createdAt) VALUES (?,?,?,?,?)`,
    [id, name, reason, date, createdAt], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json(req.body);
    });
});

app.delete('/api/watchlist/:id', (req, res) => {
  db.run("DELETE FROM watchlist WHERE id = ?", req.params.id, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// Push Notification Endpoints
app.post('/api/push-tokens', (req, res) => {
  const { user_id, token } = req.body;
  const updatedAt = new Date().toISOString();
  db.run(`INSERT INTO push_tokens (user_id, token, updatedAt) VALUES (?, ?, ?) 
          ON CONFLICT(user_id) DO UPDATE SET token=excluded.token, updatedAt=excluded.updatedAt`,
    [user_id, token, updatedAt], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    });
});

app.post('/api/notify', (req, res) => {
  const { manager_name, visitor_name } = req.body;
  
  // 1. Find the manager's user_id from their name
  db.get("SELECT id FROM users WHERE name = ?", [manager_name], (err, user) => {
    if (err || !user) return res.status(404).json({ error: "Manager not found" });
    
    // 2. Get their push token
    db.get("SELECT token FROM push_tokens WHERE user_id = ?", [user.id], (err, row) => {
      if (err || !row) return res.status(404).json({ error: "Push token not found for this manager" });
      
      console.log(`[MOCK PUSH] To: ${manager_name} (${row.token}) | Message: Visitor ${visitor_name} has checked in.`);
      
      // TODO: Implement actual FCM send here when keys are provided
      // For now, return success to let frontend continue
      res.json({ success: true, message: "Notification queued" });
    });
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`VMS Backend listening on all interfaces at port ${port}`);
});
