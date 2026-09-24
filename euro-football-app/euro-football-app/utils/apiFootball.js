// utils/apiFootball.js
//
// A small wrapper around Axios so every route file talks to API-Football
// the same way, with the same headers and the same error handling.
// This keeps our route files clean: they just call e.g. getStandings(...)
// instead of repeating Axios boilerplate everywhere.

const axios = require("axios");

// API-Football's direct (non-RapidAPI) base URL.
// If you signed up through RapidAPI instead of dashboard.api-football.com,
// see the README for the two-line change needed to switch hosts.
const BASE_URL = "https://v3.football.api-sports.io";

// Build one shared Axios instance.
const client = axios.create({
  baseURL: BASE_URL,
  timeout: 8000, // fail fast instead of hanging the page for a slow response
});

// Dynamically attach auth key from process.env on every request
client.interceptors.request.use((config) => {
  if (process.env.API_FOOTBALL_KEY) {
    config.headers["x-apisports-key"] = process.env.API_FOOTBALL_KEY;
  }
  return config;
});

/**
 * Generic GET helper. Every API-Football call goes through here so we only
 * have to handle errors (bad key, rate limit, network issues) in one place.
 * @param {string} endpoint - e.g. "/standings"
 * @param {object} params - query string params, e.g. { league: 39, season: 2025 }
 * @returns {Promise<any>} the "response" array from API-Football's JSON body
 */
async function apiGet(endpoint, params = {}) {
  try {
    const { data } = await client.get(endpoint, { params });

    // API-Football returns HTTP 200 even for some errors (e.g. bad params),
    // and reports the actual problem inside data.errors (can be array, object, or string).
    if (data.errors) {
      let message = "";
      if (Array.isArray(data.errors) && data.errors.length > 0) {
        message = data.errors.join(", ");
      } else if (typeof data.errors === "object" && Object.keys(data.errors).length > 0) {
        message = Object.values(data.errors).join(", ");
      } else if (typeof data.errors === "string" && data.errors.trim() !== "") {
        message = data.errors;
      }
      if (message) {
        throw new Error(`API-Football error: ${message}`);
      }
    }

    return data.response || [];
  } catch (err) {
    // Distinguish network/HTTP errors from the "errors" object above so the
    // route handlers can show a sensible message either way.
    if (err.response) {
      // The API responded with a non-2xx status code.
      const responseData = err.response.data || {};
      const apiMessage =
        responseData.message ||
        (responseData.errors && Object.values(responseData.errors).join(", "));
      console.error(`API-Football request failed [${err.response.status}]:`, responseData);

      if (err.response.status === 403) {
        throw new Error(
          "API-Football rejected the request (403). Verify that the API key is active, " +
            "belongs to the selected API-Football host, and has access to this endpoint." +
            (apiMessage ? ` Details: ${apiMessage}` : "")
        );
      }

      throw new Error(
        `API-Football responded with status ${err.response.status}. ` +
          (apiMessage || "Check your API key and request parameters.")
      );
    } else if (err.request) {
      // Request was sent but no response came back (network/timeout issue).
      console.error("No response from API-Football:", err.message);
      throw new Error("Could not reach API-Football. Please try again shortly.");
    } else {
      // Something else went wrong (e.g. the errors-object case above).
      console.error("API-Football client error:", err.message);
      throw err;
    }
  }
}

// --- Specific, named helpers used by our routes -------------------------

function getStandings(league, season) {
  return apiGet("/standings", {
    league: String(league),
    season: String(season),
  });
}

function getFixtures(league, season, next) {
  const from = new Date();
  const to = new Date(from);
  to.setDate(to.getDate() + Number(next || 10) * 7);

  const params = {
    season: String(season),
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
  if (league !== null && league !== undefined) {
    params.league = String(league);
  }
  return apiGet("/fixtures", params);
}

function getLiveFixtures(league) {
  // "all" returns every live match; passing a league filters to that league
  return apiGet("/fixtures", { live: league ? String(league) : "all" });
}

function searchTeams(name) {
  return apiGet("/teams", { search: String(name).trim() });
}

function getTeamFixtures(teamId, season) {
  return apiGet("/fixtures", {
    team: String(teamId),
    season: String(season),
    last: "5",
  });
}

function searchPlayers(name, season, league) {
  return apiGet("/players", {
    search: String(name).trim(),
    season: String(season),
    league: String(league),
  });
}

module.exports = {
  getStandings,
  getFixtures,
  getLiveFixtures,
  searchTeams,
  getTeamFixtures,
  searchPlayers,
};
