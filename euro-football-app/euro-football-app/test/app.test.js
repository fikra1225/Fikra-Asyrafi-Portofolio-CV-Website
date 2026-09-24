const test = require("node:test");
const assert = require("node:assert");
const http = require("node:http");
const path = require("node:path");

const express = require("express");
const standingsRouter = require("../routes/standings");
const fixturesRouter = require("../routes/fixtures");
const teamsRouter = require("../routes/teams");
const playersRouter = require("../routes/players");
const { LEAGUES, getCurrentSeason } = require("../utils/leagues");
const apiFootball = require("../utils/apiFootball");

test("LEAGUES and getCurrentSeason unit tests", () => {
  assert.ok(Array.isArray(LEAGUES));
  assert.ok(LEAGUES.length > 0);
  assert.strictEqual(LEAGUES[0].id, 39);

  // Test configured season
  process.env.API_FOOTBALL_SEASON = "2024";
  assert.strictEqual(getCurrentSeason(), 2024);

  // Test fallback season
  delete process.env.API_FOOTBALL_SEASON;
  const currentSeason = getCurrentSeason();
  assert.ok(typeof currentSeason === "number" && currentSeason >= 2020);
});

test("Express App endpoints integration tests", async (t) => {
  const app = express();
  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "..", "views"));
  app.use(express.static(path.join(__dirname, "..", "public")));

  app.get("/", (req, res) => {
    res.render("index");
  });
  app.use("/standings", standingsRouter);
  app.use("/fixtures", fixturesRouter);
  app.use("/teams", teamsRouter);
  app.use("/players", playersRouter);
  app.use((req, res) => {
    res.status(404).render("404");
  });

  const server = http.createServer(app);
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://localhost:${port}`;

  t.after(() => server.close());

  await t.test("GET / returns 200 and rendered EJS homepage", async () => {
    const res = await fetch(`${baseUrl}/`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("Every table, every fixture, one search away."));
    assert.ok(text.includes("League standings"));
  });

  await t.test("GET /standings returns 200 with standings page", async () => {
    const res = await fetch(`${baseUrl}/standings`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("<select name=\"league\" id=\"league\""));
  });

  await t.test("GET /fixtures returns 200 with fixtures page", async () => {
    const res = await fetch(`${baseUrl}/fixtures`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("Upcoming Fixtures"));
  });

  await t.test("GET /fixtures?league=all returns 200", async () => {
    const res = await fetch(`${baseUrl}/fixtures?league=all`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("Upcoming Fixtures"));
  });

  await t.test("GET /teams returns 200 with search form", async () => {
    const res = await fetch(`${baseUrl}/teams`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("Team Search"));
  });

  await t.test("GET /teams?name=ab short query returns error notice", async () => {
    const res = await fetch(`${baseUrl}/teams?name=ab`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("Please enter at least 3 characters"));
  });

  await t.test("GET /players returns 200 with search form", async () => {
    const res = await fetch(`${baseUrl}/players`);
    assert.strictEqual(res.status, 200);
    const text = await res.text();
    assert.ok(text.includes("Player Search"));
  });

  await t.test("GET /unknown returns 404", async () => {
    const res = await fetch(`${baseUrl}/unknown`);
    assert.strictEqual(res.status, 404);
    const text = await res.text();
    assert.ok(text.includes("Offside") && text.includes("page not found"));
  });
});
