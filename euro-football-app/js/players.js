// js/players.js — client-side port of routes/players.js

function renderLeagueSelect(selectedLeague) {
  const select = document.getElementById("league");
  select.innerHTML = LEAGUES.map(
    (l) => `<option value="${l.id}" ${l.id === selectedLeague ? "selected" : ""}>${escapeHtml(l.name)}</option>`
  ).join("");
}

function renderNotice(message) {
  document.getElementById("notice").innerHTML = message ? `<div class="notice">${escapeHtml(message)}</div>` : "";
}

function renderPlayers(players) {
  document.getElementById("results").innerHTML = players
    .map((p) => {
      const player = p.player || {};
      const stats = p.statistics && p.statistics[0];

      const line1Bits = [
        player.nationality,
        player.age ? `Age ${player.age}` : "",
        stats && stats.team ? stats.team.name : "",
        stats && stats.games && stats.games.position ? stats.games.position : "",
      ]
        .filter(Boolean)
        .map(escapeHtml)
        .join(" &middot; ");

      let statsLine = "";
      if (stats) {
        const apps = (stats.games && (stats.games.appearences || stats.games.appearances)) || 0;
        const goals = (stats.goals && stats.goals.total) || 0;
        const assists = (stats.goals && stats.goals.assists) || 0;
        statsLine = `<p>${apps} apps &middot; ${goals} goals &middot; ${assists} assists</p>`;
      }

      return `
        <div class="result">
          <img src="${escapeHtml(player.photo || "")}" alt="" />
          <div class="details">
            <h3>${escapeHtml(player.name || "")}</h3>
            <p>${line1Bits}</p>
            ${statsLine}
          </div>
        </div>`;
    })
    .join("");
}

async function runSearch() {
  const url = new URL(window.location.href);
  const query = (url.searchParams.get("name") || "").trim();
  const league = parseInt(url.searchParams.get("league"), 10) || LEAGUES[0].id;

  document.getElementById("name").value = query;
  renderLeagueSelect(league);
  document.getElementById("results").innerHTML = "";

  if (!query) {
    renderNotice("");
    return;
  }
  if (query.length < 3) {
    renderNotice("Please enter at least 3 characters to search for a player.");
    return;
  }

  renderNotice("Searching…");

  try {
    const players = await searchPlayers(query, getCurrentSeason(), league);
    renderNotice(players.length === 0 ? `No players found matching "${query}".` : "");
    renderPlayers(players);
  } catch (err) {
    renderNotice(err.message);
  }
}

document.getElementById("players-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const league = document.getElementById("league").value;
  window.location.href = `players.html?name=${encodeURIComponent(name)}&league=${encodeURIComponent(league)}`;
});

runSearch();
