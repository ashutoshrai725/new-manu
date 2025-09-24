const express = require('express');
const cors = require('cors');
const path = require('path');
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

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
