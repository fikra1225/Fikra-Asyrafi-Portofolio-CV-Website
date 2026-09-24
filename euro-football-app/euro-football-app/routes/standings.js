// routes/standings.js
//
// GET /standings              -> defaults to Premier League, current season
// GET /standings?league=140   -> La Liga table
// GET /standings?league=140&season=2025

const express = require("express");
const router = express.Router();
const { getStandings } = require("../utils/apiFootball");
const { LEAGUES, getCurrentSeason } = require("../utils/leagues");

router.get("/", async (req, res) => {
  const league = parseInt(req.query.league, 10) || LEAGUES[0].id;
  const season = parseInt(req.query.season, 10) || getCurrentSeason();

  try {
    const response = await getStandings(league, season);

    // API-Football nests the table pretty deeply:
    // response[0].league.standings[0] is the array of team rows.
    const leagueData = response && response[0] ? response[0].league : null;
    const table = leagueData?.standings?.[0] || [];

    res.render("standings", {
      leagues: LEAGUES,
      selectedLeague: league,
      selectedSeason: season,
      leagueData,
      table,
      error: table.length === 0 ? "No standings found for this league/season." : null,
    });
  } catch (err) {
    // Show the user a friendly message; the real error is already logged
    // inside utils/apiFootball.js.
    res.render("standings", {
      leagues: LEAGUES,
      selectedLeague: league,
      selectedSeason: season,
      leagueData: null,
      table: [],
      error: err.message,
    });
  }
});

module.exports = router;
