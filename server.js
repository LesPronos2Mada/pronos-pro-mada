import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';
import compression from 'compression';
import apiRouter from './src/api/index.js';
import { initDB } from './src/db.js';
import { scheduleJobs } from './src/scheduler.js';
import { CONFIG } from './config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(compression());
app.use(express.json());

// Auth middleware via APP_API_KEY from config.js
app.use('/api', (req,res,next)=>{
  const key = req.headers['x-api-key'];
  if (!key || key !== CONFIG.APP_API_KEY) return res.status(401).json({error:'Unauthorized'});
  next();
});

// Static PWA
app.use('/', express.static(path.join(__dirname, 'public')));

// API
app.use('/api', apiRouter);

// Boot
const PORT = CONFIG.PORT || 8080;
initDB();
scheduleJobs();
app.listen(PORT, ()=> console.log('Server running on http://localhost:'+PORT));
