// routes/players.js
//
// GET /players               -> empty search form
// GET /players?name=haaland  -> search results with stats for the current season

const express = require("express");
const router = express.Router();
const { searchPlayers } = require("../utils/apiFootball");
const { LEAGUES, getCurrentSeason } = require("../utils/leagues");

router.get("/", async (req, res) => {
  const query = (req.query.name || "").trim();
  const league = parseInt(req.query.league, 10) || LEAGUES[0].id;

  if (!query) {
    return res.render("players", { query: "", players: [], leagues: LEAGUES, selectedLeague: league, error: null });
  }

  // API-Football's /players?search= requires a season param to return
  // statistics, and the search string must be at least 3 characters.
  if (query.length < 3) {
    return res.render("players", {
      query,
      players: [],
      leagues: LEAGUES,
      selectedLeague: league,
      error: "Please enter at least 3 characters to search for a player.",
    });
  }

  try {
    const players = await searchPlayers(query, getCurrentSeason(), league);

    res.render("players", {
      query,
      players,
      leagues: LEAGUES,
      selectedLeague: league,
      error: players.length === 0 ? `No players found matching "${query}".` : null,
    });
  } catch (err) {
    res.render("players", {
      query,
      players: [],
      leagues: LEAGUES,
      selectedLeague: league,
      error: err.message,
    });
  }
});

module.exports = router;
