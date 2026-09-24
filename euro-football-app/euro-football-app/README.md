# Kickoff — European Football App

A capstone project built with **Express.js**, **Axios**, and **EJS** that
integrates the [API-Football](https://www.api-football.com/) API to show
live data for Europe's top football leagues:

- **Standings** — current league table for any supported competition
- **Fixtures** — upcoming matches, or live scores right now
- **Team search** — look up a club's crest and recent results
- **Player search** — look up a player's season stats

## Tech stack

- Node.js + Express (server & routing)
- Axios (HTTP requests to API-Football)
- EJS (server-side templating)
- Vanilla CSS (no framework)

## Setup

1. **Install dependencies**

   ```bash
   npm i
   ```

2. **Get a free API key**

   Sign up at [dashboard.api-football.com/register](https://dashboard.api-football.com/register).
   The free plan gives you 100 requests/day across every endpoint — plenty
   for local development and demoing this project.

3. **Add your key**

   Copy the example environment file and paste your key in:

   ```bash
   cp .env.example .env
   ```

   Then open `.env` and set:

   ```
   API_FOOTBALL_KEY=your_actual_key_here
   API_FOOTBALL_SEASON=2024
   ```

   Free API-Football plans may only allow historical seasons such as 2022-2024.
   Set `API_FOOTBALL_SEASON` to a season available on your plan.

4. **Run the server**

   ```bash
   nodemon index.js
   ```

   or, without nodemon:

   ```bash
   npm start
   ```

5. Visit **http://localhost:3000**

## Using RapidAPI instead of the direct API-Football key

If you signed up for API-Football through RapidAPI rather than
`dashboard.api-football.com`, the base URL and headers are slightly
different. In `utils/apiFootball.js`, change:

```js
const BASE_URL = "https://v3.football.api-sports.io";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-apisports-key": process.env.API_FOOTBALL_KEY,
  },
  ...
});
```

to:

```js
const BASE_URL = "https://api-football-v1.p.rapidapi.com/v3";

const client = axios.create({
  baseURL: BASE_URL,
  headers: {
    "x-rapidapi-key": process.env.API_FOOTBALL_KEY,
    "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
  },
  ...
});
```

Everything else in the app works the same either way.

## Project structure

```
euro-football-app/
├── index.js                 # Express app entry point
├── routes/
│   ├── standings.js          # GET /standings
│   ├── fixtures.js           # GET /fixtures
│   ├── teams.js               # GET /teams
│   └── players.js             # GET /players
├── utils/
│   ├── apiFootball.js         # Axios client + error handling for API-Football
│   └── leagues.js             # League ID lookup table + current-season helper
├── views/
│   ├── partials/
│   │   ├── header.ejs
│   │   └── footer.ejs
│   ├── index.ejs
│   ├── standings.ejs
│   ├── fixtures.ejs
│   ├── teams.ejs
│   ├── players.ejs
│   └── 404.ejs
├── public/
│   └── css/style.css
├── .env.example
└── package.json
```

## Error handling

- All Axios calls to API-Football are centralized in `utils/apiFootball.js`,
  which distinguishes between:
  - API-reported errors (bad params, invalid key) — surfaced as `data.errors`
  - HTTP-level failures (rate limits, 4xx/5xx) — caught via `err.response`
  - Network failures (timeouts, no connection) — caught via `err.request`
- Every route wraps its API call in a `try/catch`. On failure, the page
  still renders (so the user never sees a blank crash screen) with a
  friendly message in a `.notice` banner, while the real error is logged
  to the server console for debugging.

## Notes on the leagues covered

League IDs are defined by API-Football and listed in `utils/leagues.js`:
Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Champions League,
Europa League, Eredivisie, and Primeira Liga. Add more by finding a
competition's ID via the `/leagues` endpoint and appending it to that file.

## License

Built for educational purposes as part of a course capstone project.
