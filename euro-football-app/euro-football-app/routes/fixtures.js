// routes/fixtures.js
//
// GET /fixtures                 -> next 10 fixtures, Premier League, current season
// GET /fixtures?league=140      -> next 10 fixtures for La Liga
// GET /fixtures?live=true       -> currently live matches (any league)
// GET /fixtures?live=true&league=39 -> live matches in the Premier League only

const express = require("express");
const router = express.Router();
const { getFixtures, getLiveFixtures } = require("../utils/apiFootball");
const { LEAGUES, getCurrentSeason } = require("../utils/leagues");

router.get("/", async (req, res) => {
  const leagueParam = String(req.query.league || LEAGUES[0].id);
  const league = leagueParam === "all" ? null : parseInt(leagueParam, 10) || LEAGUES[0].id;
  const season = getCurrentSeason();
  const showLive = req.query.live === "true";

  try {
    const fixtures = showLive
      ? await getLiveFixtures(league)
      : await getFixtures(league, season, 10);

    res.render("fixtures", {
      leagues: LEAGUES,
      selectedLeague: league,
      showLive,
      fixtures,
      error:
        fixtures.length === 0
          ? showLive
            ? "No live matches right now for this league."
            : "No upcoming fixtures found."
          : null,
    });
  } catch (err) {
    res.render("fixtures", {
      leagues: LEAGUES,
      selectedLeague: league,
      showLive,
      fixtures: [],
      error: err.message,
    });
  }
});

module.exports = router;
