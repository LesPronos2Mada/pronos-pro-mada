import { Router } from 'express';
import { outcomeProbs } from '../compute.js';
import { getFixturesByDate, getTeamStats } from '../services/apifootball.js';

const router = Router();

router.get('/health', (req,res)=> res.json({ ok: true }));

router.get('/fixtures', async (req,res)=>{
  const league = req.query.league;
  const date = req.query.date || new Date().toISOString().slice(0,10);
  if (!league) return res.status(400).json({error:'league query required'});
  try{
    const data = await getFixturesByDate(league, date);
    const out = data.response.map(m=>({
      id: m.fixture.id,
      date: m.fixture.date,
      status: m.fixture.status.short,
      league: m.league.name,
      home: { id: m.teams.home.id, name: m.teams.home.name },
      away: { id: m.teams.away.id, name: m.teams.away.name },
      goals: { home: m.goals.home, away: m.goals.away }
    }));
    res.json(out);
  }catch(e){ res.status(500).json({error:e.message}); }
});

router.get('/probabilities', async (req,res)=>{
  const league = req.query.league;
  const home = req.query.home;
  const away = req.query.away;
  const season = req.query.season || new Date().getFullYear();
  if (!league || !home || !away) return res.status(400).json({error:'league, home, away required'});
  try{
    const [stHome, stAway] = await Promise.all([
      getTeamStats(league, home, season),
      getTeamStats(league, away, season)
    ]);
    const xgH = stHome.response?.xG?.for?.total || (stHome.response?.goals?.for?.average?.total || 1.3);
    const xgA = stAway.response?.xG?.for?.total || (stAway.response?.goals?.for?.average?.total || 1.2);
    const { pH, pD, pA, over25, expScoreDiff } = outcomeProbs(xgH, xgA);
    res.json({ xgHome: xgH, xgAway: xgA, pH, pD, pA, over25, expScoreDiff });
  }catch(e){ res.status(500).json({error:e.message}); }
});

export default router;