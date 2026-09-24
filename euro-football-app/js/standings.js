// js/standings.js — client-side port of routes/standings.js

function getParams() {
  const url = new URL(window.location.href);
  const league = parseInt(url.searchParams.get("league"), 10) || LEAGUES[0].id;
  const season = parseInt(url.searchParams.get("season"), 10) || getCurrentSeason();
  return { league, season };
}

function renderLeagueSelect(selectedLeague) {
  const select = document.getElementById("league");
  select.innerHTML = LEAGUES.map(
    (l) =>
      `<option value="${l.id}" ${l.id === selectedLeague ? "selected" : ""}>${escapeHtml(
        l.name
      )} (${escapeHtml(l.country)})</option>`
  ).join("");
}

function renderNotice(message) {
  const notice = document.getElementById("notice");
  notice.innerHTML = message ? `<div class="notice">${escapeHtml(message)}</div>` : "";
}

function renderTable(table) {
  const wrap = document.getElementById("table-wrap");
  if (!table || table.length === 0) {
    wrap.innerHTML = "";
    return;
  }

  const rows = table
    .map((row) => {
      const form = (row.form || "")
        .split("")
        .map(
          (letter) =>
            `<span class="form-badge form-${letter.toLowerCase()}">${escapeHtml(letter)}</span>`
        )
        .join("");

      return `
        <tr>
          <td>${row.rank ?? ""}</td>
          <td>
            <div class="team-cell">
              <img src="${escapeHtml((row.team && row.team.logo) || "")}" alt="" />
              <span>${escapeHtml((row.team && row.team.name) || "")}</span>
            </div>
          </td>
          <td>${(row.all && row.all.played) ?? 0}</td>
          <td>${(row.all && row.all.win) ?? 0}</td>
          <td>${(row.all && row.all.draw) ?? 0}</td>
          <td>${(row.all && row.all.lose) ?? 0}</td>
          <td>${row.goalsDiff ?? 0}</td>
          <td class="pts">${row.points ?? 0}</td>
          <td>${form}</td>
        </tr>`;
    })
    .join("");

  wrap.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>#</th><th>Team</th><th>P</th><th>W</th><th>D</th><th>L</th><th>GD</th><th>Pts</th><th>Form</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

async function loadStandings() {
  const { league, season } = getParams();
  renderLeagueSelect(league);
  document.getElementById("season").value = season;
  renderNotice("Loading standings…");
  document.getElementById("table-wrap").innerHTML = "";

  try {
    const response = await getStandings(league, season);
    const leagueData = response && response[0] ? response[0].league : null;
    const table = (leagueData && leagueData.standings && leagueData.standings[0]) || [];

    document.getElementById("standings-title").textContent = leagueData ? leagueData.name : "League Standings";
    renderNotice(table.length === 0 ? "No standings found for this league/season." : "");
    renderTable(table);
  } catch (err) {
    document.getElementById("standings-title").textContent = "League Standings";
    renderNotice(err.message);
  }
}

document.getElementById("standings-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const league = document.getElementById("league").value;
  const season = document.getElementById("season").value;
  window.location.href = `standings.html?league=${encodeURIComponent(league)}&season=${encodeURIComponent(season)}`;
});

loadStandings();
