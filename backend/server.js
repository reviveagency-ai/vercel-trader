// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.API_KEY || "";

// simple middleware to check x-api-key for protected routes
function requireApiKey(req, res, next) {
  const key = req.header('x-api-key') || "";
  if (!API_KEY || key !== API_KEY) {
    return res.status(401).json({ ok: false, error: 'Unauthorized: bad x-api-key' });
  }
  next();
}

// unprotected health check
app.get('/health', (req, res) => {
  res.json({
    ok: true,
    port: process.env.PORT || 3000,
    apiKeyConfigured: !!API_KEY
  });
});

// example protected route
app.get('/trades', requireApiKey, (req, res) => {
  res.json({
    ok: true,
    data: [
      { id: 1, symbol: "US30", side: "LONG", entry: 39250, sl: 39180, tp: 39400 },
      { id: 2, symbol: "SPX", side: "SHORT", entry: 5575, sl: 5590, tp: 5535 }
    ]
  });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

