// js/leagues.js
// Client-side port of utils/leagues.js

const LEAGUES = [
  { id: 39, name: "Premier League", country: "England" },
  { id: 140, name: "La Liga", country: "Spain" },
  { id: 135, name: "Serie A", country: "Italy" },
  { id: 78, name: "Bundesliga", country: "Germany" },
  { id: 61, name: "Ligue 1", country: "France" },
  { id: 2, name: "UEFA Champions League", country: "Europe" },
  { id: 3, name: "UEFA Europa League", country: "Europe" },
  { id: 88, name: "Eredivisie", country: "Netherlands" },
  { id: 94, name: "Primeira Liga", country: "Portugal" },
];

function getCurrentSeason() {
  const configured = Number.parseInt(API_CONFIG.season, 10);
  if (configured >= 2000) return configured;

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  return month >= 8 ? year : year - 1;
}
