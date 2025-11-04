import Database from 'better-sqlite3';
let db;
export function initDB(){
  db = new Database('data.db');
  db.pragma('journal_mode = WAL');
  db.exec(`
    CREATE TABLE IF NOT EXISTS leagues (
      id INTEGER PRIMARY KEY,
      name TEXT,
      country TEXT,
      code TEXT,
      season INTEGER,
      api_id INTEGER UNIQUE
    );
    CREATE TABLE IF NOT EXISTS teams (
      id INTEGER PRIMARY KEY,
      name TEXT,
      logo TEXT,
      league_api_id INTEGER,
      api_id INTEGER,
      UNIQUE(api_id, league_api_id)
    );
    CREATE TABLE IF NOT EXISTS fixtures (
      id INTEGER PRIMARY KEY,
      api_id INTEGER UNIQUE,
      league_api_id INTEGER,
      date TEXT,
      status TEXT,
      home_id INTEGER,
      away_id INTEGER,
      goals_home INTEGER,
      goals_away INTEGER,
      xg_home REAL,
      xg_away REAL
    );
  `);
}
export function getDB(){ return db; }