import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './src/server/api';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API Endpoints
app.use('/api', apiRouter);

// Serve static assets in production
const distPath = path.join(__dirname, 'dist');
app.use(express.static(distPath));

// Fallback SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`[ACME Salary Management] Server running on http://localhost:${PORT}`);
});
