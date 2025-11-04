import fetch from 'node-fetch';
import fs from 'fs';
import { CONFIG } from '../../config.js';

const API_KEY = CONFIG.API_FOOTBALL_KEY;
const BASE = 'https://v3.football.api-sports.io';

async function apiGet(path, params = {}){
  const url = new URL(BASE + path);
  Object.entries(params).forEach(([k,v])=> url.searchParams.set(k, v));
  const headers = { 'x-apisports-key': API_KEY };
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error('API error '+res.status);
  return res.json();
}

function mock(path){
  const p = './mock'+path.replace('/','_')+'.json';
  if (fs.existsSync(p)) return JSON.parse(fs.readFileSync(p,'utf-8'));
  return { response: [] };
}

export async function getLeagues(){
  if (!API_KEY) return mock('/leagues');
  const wanted = [61,39,140,135,78,2];
  const out = [];
  for (const id of wanted){
    const j = await apiGet('/leagues', { id });
    if (j.response?.length) out.push(j.response[0]);
  }
  return { response: out };
}

export async function getFixturesByDate(leagueId, dateISO){
  if (!API_KEY) return mock('/fixtures_today_'+leagueId);
  return apiGet('/fixtures', { date: dateISO, league: leagueId, season: new Date().getFullYear() });
}

export async function getTeamStats(leagueId, teamId, season){
  if (!API_KEY) return mock('/teamstats_'+leagueId+'_'+teamId);
  return apiGet('/teams/statistics', { league: leagueId, team: teamId, season });
}

export async function getFixtureStats(fixtureId){
  if (!API_KEY) return mock('/fixturestats_'+fixtureId);
  return apiGet('/fixtures/statistics', { fixture: fixtureId });
}