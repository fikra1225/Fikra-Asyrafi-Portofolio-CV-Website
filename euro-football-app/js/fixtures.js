// js/fixtures.js — client-side port of routes/fixtures.js

function getParams() {
  const url = new URL(window.location.href);
  const leagueParam = url.searchParams.get("league") || String(LEAGUES[0].id);
  const league = leagueParam === "all" ? null : parseInt(leagueParam, 10) || LEAGUES[0].id;
  const showLive = url.searchParams.get("live") === "true";
  return { league, showLive };
}

function renderLeagueSelect(selectedLeague) {
  const select = document.getElementById("league");
  const allOption = `<option value="all" ${selectedLeague === null ? "selected" : ""}>All competitions</option>`;
  const rest = LEAGUES.map(
    (l) =>
      `<option value="${l.id}" ${l.id === selectedLeague ? "selected" : ""}>${escapeHtml(
        l.name
      )} (${escapeHtml(l.country)})</option>`
  ).join("");
  select.innerHTML = allOption + rest;
}

function renderNotice(message) {
  const notice = document.getElementById("notice");
  notice.innerHTML = message ? `<div class="notice">${escapeHtml(message)}</div>` : "";
}

function renderFixtures(fixtures) {
  const wrap = document.getElementById("fixture-list");
  wrap.innerHTML = fixtures
    .map((f) => {
      const home = (f.teams && f.teams.home) || {};
      const away = (f.teams && f.teams.away) || {};
      const status = (f.fixture && f.fixture.status) || {};

      let mid;
      if (f.goals && f.goals.home !== null && f.goals.away !== null) {
        mid = `<div class="score">${f.goals.home} &ndash; ${f.goals.away}</div>`;
      } else {
        const dateStr = f.fixture && f.fixture.date
          ? new Date(f.fixture.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })
          : "TBD";
        mid = `<div class="score">${escapeHtml(dateStr)}</div>`;
      }

      const isLive = status.short === "1H" || status.short === "2H";
      let statusLine = "";
      if (status.short === "NS" && f.fixture && f.fixture.date) {
        statusLine = new Date(f.fixture.date).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
      } else if (status.long) {
        statusLine = escapeHtml(status.long) + (status.elapsed ? ` &middot; ${status.elapsed}'` : "");
      }

      return `
        <div class="fixture">
          <div class="side home">
            <img src="${escapeHtml(home.logo || "")}" alt="" />
            <span>${escapeHtml(home.name || "")}</span>
          </div>
          <div class="mid">
            ${mid}
            <div class="status ${isLive ? "live" : ""}">${statusLine}</div>
          </div>
          <div class="side away">
            <span>${escapeHtml(away.name || "")}</span>
            <img src="${escapeHtml(away.logo || "")}" alt="" />
          </div>
        </div>`;
    })
    .join("");
}

async function loadFixtures() {
  const { league, showLive } = getParams();
  renderLeagueSelect(league);
  document.getElementById("fixtures-title").textContent = showLive ? "Live Matches" : "Upcoming Fixtures";

  const toggle = document.getElementById("toggle-live");
  toggle.textContent = showLive ? "Show upcoming instead" : "Show live matches instead";
  toggle.href = `fixtures.html?league=${league === null ? "all" : league}&live=${showLive ? "false" : "true"}`;

  renderNotice("Loading fixtures…");
  document.getElementById("fixture-list").innerHTML = "";

  try {
    const season = getCurrentSeason();
    const fixtures = showLive ? await getLiveFixtures(league) : await getFixtures(league, season, 10);

    renderNotice(
      fixtures.length === 0
        ? showLive
          ? "No live matches right now for this league."
          : "No upcoming fixtures found."
        : ""
    );
    renderFixtures(fixtures);
  } catch (err) {
    renderNotice(err.message);
  }
}

document.getElementById("fixtures-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const { showLive } = getParams();
  const league = document.getElementById("league").value;
  window.location.href = `fixtures.html?league=${encodeURIComponent(league)}&live=${showLive}`;
});

loadFixtures();
