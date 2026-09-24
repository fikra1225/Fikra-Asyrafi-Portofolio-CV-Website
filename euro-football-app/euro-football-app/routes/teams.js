// routes/teams.js
//
// GET /teams              -> empty search form
// GET /teams?name=arsenal -> search results + recent fixtures for the top match

const express = require("express");
const router = express.Router();
const { searchTeams, getTeamFixtures } = require("../utils/apiFootball");
const { getCurrentSeason } = require("../utils/leagues");

router.get("/", async (req, res) => {
  const query = (req.query.name || "").trim();

  // No search yet -- just show the empty search form.
  if (!query) {
    return res.render("teams", { query: "", teams: [], recentFixtures: [], error: null });
  }

  if (query.length < 3) {
    return res.render("teams", {
      query,
      teams: [],
      recentFixtures: [],
      error: "Please enter at least 3 characters to search for a team.",
    });
  }

  try {
    const teams = await searchTeams(query);

    // For a nicer demo, also pull the most recent fixtures for the first
    // matching team so the page isn't just a bare list of names/crests.
    let recentFixtures = [];
    if (teams.length > 0) {
      const topTeamId = teams[0].team.id;
      recentFixtures = await getTeamFixtures(topTeamId, getCurrentSeason());
    }

    res.render("teams", {
      query,
      teams,
      recentFixtures,
      error: teams.length === 0 ? `No teams found matching "${query}".` : null,
    });
  } catch (err) {
    res.render("teams", { query, teams: [], recentFixtures: [], error: err.message });
  }
});

module.exports = router;
