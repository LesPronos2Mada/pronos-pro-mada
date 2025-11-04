# Pronos PRO (Config.js version — iPad friendly)
PWA mobile + API Node.js avec probabilités Poisson, MAJ auto, sans `.env` (tout est dans `config.js`).

## Démarrage
1) Ouvre `config.js` et mets tes vraies clés :
   - `API_FOOTBALL_KEY`: ta clé API-Football v3
   - `APP_API_KEY`: la clé pour sécuriser l'API
2) `npm install`
3) `npm run dev`
4) Ouvre http://localhost:8080
5) IMPORTANT : dans `public/index.html`, remplace `KEY = 'change_me'` par la même valeur que `APP_API_KEY`.

## Ligues incluses
- Ligue 1 (61), Premier League (39), LaLiga (140), Serie A (135), Bundesliga (78), UCL (2)

## Notes
- Sans clé API, l'app fonctionne avec des **mock** (dossier `mock/`) pour tester l'UI.
- Les proba 1/N/2 et Over2.5 sont calculées via Poisson (0..7 buts) à partir des xG (fallback sur buts moyens).

## Déploiement Docker (optionnel)
- `docker build -t pronos-pro .`
- `docker run -p 8080:8080 pronos-pro`
