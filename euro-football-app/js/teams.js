// js/teams.js — client-side port of routes/teams.js

function renderNotice(message) {
  document.getElementById("notice").innerHTML = message ? `<div class="notice">${escapeHtml(message)}</div>` : "";
}

function renderTeams(teams) {
  document.getElementById("results").innerHTML = teams
    .map((t) => {
      const team = t.team || {};
      const venue = t.venue || {};
      const bits = [team.country, team.founded ? `Founded ${team.founded}` : "", venue.name]
        .filter(Boolean)
        .map(escapeHtml)
        .join(" &middot; ");
      return `
        <div class="result">
          <img src="${escapeHtml(team.logo || "")}" alt="" />
          <div class="details">
            <h3>${escapeHtml(team.name || "")}</h3>
            <p>${bits}</p>
          </div>
        </div>`;
    })
    .join("");
}

function renderRecentFixtures(fixtures, teamName) {
  const heading = document.getElementById("recent-heading");
  const wrap = document.getElementById("recent-fixtures");

  if (!fixtures || fixtures.length === 0) {
    heading.innerHTML = "";
    wrap.innerHTML = "";
    return;
  }

  heading.innerHTML = `<h2 style="margin-top: 2.5rem;">Recent Results — ${escapeHtml(teamName || "")}</h2>`;
  wrap.innerHTML = fixtures
    .map((f) => {
      const home = (f.teams && f.teams.home) || {};
      const away = (f.teams && f.teams.away) || {};
      const homeGoals = f.goals && f.goals.home !== null ? f.goals.home : "-";
      const awayGoals = f.goals && f.goals.away !== null ? f.goals.away : "-";
      const dateStr = f.fixture && f.fixture.date
        ? new Date(f.fixture.date).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
        : "";

      return `
        <div class="fixture">
          <div class="side home">
            <img src="${escapeHtml(home.logo || "")}" alt="" />
            <span>${escapeHtml(home.name || "")}</span>
          </div>
          <div class="mid">
            <div class="score">${homeGoals} &ndash; ${awayGoals}</div>
            <div class="status">${escapeHtml(dateStr)}</div>
          </div>
          <div class="side away">
            <span>${escapeHtml(away.name || "")}</span>
            <img src="${escapeHtml(away.logo || "")}" alt="" />
          </div>
        </div>`;
    })
    .join("");
}

async function runSearch() {
  const url = new URL(window.location.href);
  const query = (url.searchParams.get("name") || "").trim();
  document.getElementById("name").value = query;

  document.getElementById("results").innerHTML = "";
  document.getElementById("recent-heading").innerHTML = "";
  document.getElementById("recent-fixtures").innerHTML = "";

  if (!query) {
    renderNotice("");
    return;
  }
  if (query.length < 3) {
    renderNotice("Please enter at least 3 characters to search for a team.");
    return;
  }

  renderNotice("Searching…");

  try {
    const teams = await searchTeams(query);
    renderNotice(teams.length === 0 ? `No teams found matching "${query}".` : "");
    renderTeams(teams);

    if (teams.length > 0) {
      const topTeamId = teams[0].team.id;
      const recentFixtures = await getTeamFixtures(topTeamId, getCurrentSeason());
      renderRecentFixtures(recentFixtures, teams[0].team.name);
    }
  } catch (err) {
    renderNotice(err.message);
  }
}

document.getElementById("teams-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  window.location.href = `teams.html?name=${encodeURIComponent(name)}`;
});

runSearch();
