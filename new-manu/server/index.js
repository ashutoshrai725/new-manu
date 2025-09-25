const express = require('express');
const cors = require('cors');
const path = require('path');
const fetch = require('node-fetch');
require('dotenv').config({ path: path.resolve(process.cwd(), '.env.server') });

const app = express();
app.use(cors());
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Example secure endpoint that uses a server-only secret
app.get('/api/config/supabase', (_req, res) => {
  const projectUrl = process.env.SUPABASE_PROJECT_URL;
  // Do NOT send service role key to client. Only send non-sensitive items.
  if (!projectUrl) return res.status(500).json({ error: 'Server config missing' });
  res.json({ url: projectUrl });
});

// Proxy Gemini requests securely (server holds the API key)
app.post('/api/ai/gemini', async (req, res) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: 'GEMINI_API_KEY missing on server' });

    const { contents, systemInstruction } = req.body || {};
    if (!contents) return res.status(400).json({ error: 'contents required' });

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=' + apiKey;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents, systemInstruction })
    });
    const data = await response.json();
    res.status(response.ok ? 200 : response.status).json(data);
  } catch (err) {
    res.status(500).json({ error: 'Gemini proxy error', details: err.message });
  }
});

// In production, serve the React build
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(process.cwd(), 'build');
  app.use(express.static(buildPath));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
