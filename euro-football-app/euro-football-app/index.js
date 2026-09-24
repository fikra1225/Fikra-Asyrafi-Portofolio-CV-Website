// index.js
//
// Entry point for the European Football App.
// Sets up Express, EJS templating, static assets, and wires up our routes.

const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
});

const express = require("express");

const standingsRouter = require("./routes/standings");
const fixturesRouter = require("./routes/fixtures");
const teamsRouter = require("./routes/teams");
const playersRouter = require("./routes/players");

const app = express();
const PORT = process.env.PORT || 3000;

// --- View engine setup ---------------------------------------------------
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// --- Static assets (CSS, images) -----------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// --- Warn early if the API key is missing, instead of failing silently ---
if (!process.env.API_FOOTBALL_KEY) {
  console.warn(
    "\n⚠️  WARNING: API_FOOTBALL_KEY is not set. Copy .env.example to .env " +
      "and add your key from https://dashboard.api-football.com/register \n"
  );
}

// --- Routes ----------------------------------------------------------------
app.get("/", (req, res) => {
  res.render("index");
});

app.use("/standings", standingsRouter);
app.use("/fixtures", fixturesRouter);
app.use("/teams", teamsRouter);
app.use("/players", playersRouter);

// --- 404 handler -----------------------------------------------------------
app.use((req, res) => {
  res.status(404).render("404");
});

// --- Generic error handler --------------------------------------------------
// Catches anything thrown synchronously in a route (async errors are already
// caught inside each route's try/catch and rendered gracefully).
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).send("Something went wrong on our end. Please try again.");
});

app.listen(PORT, () => {
  console.log(`⚽ European Football App running at http://localhost:${PORT}`);
});
