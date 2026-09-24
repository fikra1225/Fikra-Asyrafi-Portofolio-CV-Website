// js/api.js
// Client-side port of utils/apiFootball.js — every page's *.js file calls
// through here so they all share the same fetch + error handling logic.

async function apiGet(endpoint, params = {}) {
  const url = new URL(API_CONFIG.baseUrl.replace(/\/$/, "") + endpoint);
  Object.entries(params).forEach(([k, v]) => {
    if (v !== null && v !== undefined && v !== "") url.searchParams.set(k, v);
  });

  let res;
  try {
    res = await fetch(url.toString(), {
      headers: { "x-apisports-key": API_CONFIG.key },
    });
  } catch (err) {
    // Most commonly a CORS failure when calling api-sports.io directly
    // from the browser — see the note in js/config.js.
    throw new Error(
      "Could not reach the football API. This is often a CORS restriction " +
        "when calling API-Football directly from a browser — see js/config.js " +
        "for how to fix this with a proxy."
    );
  }

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error(`Unexpected response from the API (status ${res.status}).`);
  }

  if (!res.ok) {
    if (res.status === 403) {
      throw new Error(
        "API-Football rejected the request (403). Verify your API key is " +
          "valid, active, and has access to this endpoint."
      );
    }
    throw new Error(`API-Football responded with status ${res.status}.`);
  }

  if (data.errors) {
    let message = "";
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      message = data.errors.join(", ");
    } else if (typeof data.errors === "object" && Object.keys(data.errors).length > 0) {
      message = Object.values(data.errors).join(", ");
    } else if (typeof data.errors === "string" && data.errors.trim() !== "") {
      message = data.errors;
    }
    if (message) throw new Error(`API-Football error: ${message}`);
  }

  return data.response || [];
}

function getStandings(league, season) {
  return apiGet("/standings", { league: String(league), season: String(season) });
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
  if (league !== null && league !== undefined) params.league = String(league);
  return apiGet("/fixtures", params);
}

function getLiveFixtures(league) {
  return apiGet("/fixtures", { live: league ? String(league) : "all" });
}

function searchTeams(name) {
  return apiGet("/teams", { search: String(name).trim() });
}

function getTeamFixtures(teamId, season) {
  return apiGet("/fixtures", { team: String(teamId), season: String(season), last: "5" });
}

function searchPlayers(name, season, league) {
  return apiGet("/players", { search: String(name).trim(), season: String(season), league: String(league) });
}

// Small helper shared by every page's render code to avoid injecting
// unescaped API text (team/player names, etc.) into innerHTML.
function escapeHtml(str) {
  return String(str ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));
}
