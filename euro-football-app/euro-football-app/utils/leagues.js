// utils/leagues.js
//
// A small static lookup table of major European league IDs, as defined by
// API-Football. These IDs are stable and documented at
// https://www.api-football.com/documentation-v3#tag/Leagues
//
// Keeping this in one file means every view (standings, fixtures, etc.)
// can build the same league dropdown from the same source of truth.

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

/**
 * European football seasons are labeled by their starting year
 * (e.g. the 2026-27 season is "season=2026" in API-Football).
 * The season typically starts in August, so before August we're
 * still inside the previous season.
 */
function getCurrentSeason() {
  const configuredSeason = Number.parseInt(process.env.API_FOOTBALL_SEASON, 10);
  if (configuredSeason >= 2000) {
    return configuredSeason;
  }

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // JS months are 0-indexed
  return month >= 8 ? year : year - 1;
}

module.exports = { LEAGUES, getCurrentSeason };
