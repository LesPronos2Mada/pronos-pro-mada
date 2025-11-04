import cron from 'node-cron';
import { getLeagues, getFixturesByDate } from './services/apifootball.js';
import { getDB } from './db.js';
import { CONFIG } from '../config.js';

const WANTED = [61,39,140,135,78,2];

export function scheduleJobs(){
  // on boot
  refreshLeagues().catch(console.error);
  refreshAllToday().catch(console.error);
  // schedule refresh (Europe/Paris, every 15 mins by default)
  cron.schedule(CONFIG.REFRESH_CRON || '*/15 * * * *', async ()=>{
    try{ await refreshAllToday(); console.log('[cron] refreshed'); }
    catch(e){ console.error(e); }
  }, { timezone: CONFIG.CRON_TZ || 'Europe/Paris' });
}

async function refreshLeagues(){
  const db = getDB();
  const data = await getLeagues();
  const ins = db.prepare(`INSERT OR IGNORE INTO leagues (name,country,code,season,api_id) VALUES (?,?,?,?,?)`);
  data.response.forEach(l=>{
    const lg = l.league;
    const season = (l.seasons && l.seasons[0] && l.seasons[0].year) || new Date().getFullYear();
    ins.run(lg.name, l.country?.name, lg.code, season, lg.id);
  });
}

async function refreshAllToday(){
  const db = getDB();
  const today = new Date().toISOString().slice(0,10);
  const ins = db.prepare(`INSERT OR IGNORE INTO fixtures (api_id, league_api_id, date, status, home_id, away_id, goals_home, goals_away) VALUES (?,?,?,?,?,?,?,?)`);
  for (const lid of WANTED){
    const fx = await getFixturesByDate(lid, today);
    fx.response.forEach(x=>{
      const f = x.fixture, l = x.league, t = x.teams, g = x.goals;
      ins.run(f.id, l.id, f.date, f.status?.short, t.home.id, t.away.id, g.home, g.away);
    });
  }
}