# One On One Football — static build for GitHub Pages

This folder is a **static conversion** of the original Node/Express + EJS
app. Every `.ejs` view has a matching `.html` file here, and the server-side
route logic (`routes/*.js`, `utils/apiFootball.js`) has been ported to
client-side JS in `js/*.js` that fetches data directly from the browser.

## Files

| Original                     | Static equivalent            |
|-------------------------------|-------------------------------|
| `views/index.ejs` + partials  | `index.html`                  |
| `views/404.ejs` + partials    | `404.html`                    |
| `views/standings.ejs`         | `standings.html` + `js/standings.js` |
| `views/fixtures.ejs`          | `fixtures.html` + `js/fixtures.js`   |
| `views/teams.ejs`             | `teams.html` + `js/teams.js`         |
| `views/players.ejs`           | `players.html` + `js/players.js`     |
| `public/css/style.css`        | `css/style.css` (unchanged)   |
| `routes/*.js`, `utils/apiFootball.js`, `utils/leagues.js` | `js/api.js`, `js/leagues.js` |
| `.env` (API key)              | `js/config.js` (**you fill this in — see warning below**) |

## ⚠️ About the API key — read this first

The original app kept your API-Football key secret on the server. **GitHub
Pages has no server** — it only serves files as-is — so any key placed in
`js/config.js` is downloaded to and visible in every visitor's browser
(via "View Source" or the Network tab).

Also: this uploaded project's `.env` / `.env.example` contained a real,
already-exposed API key. **Rotate that key in your API-Football dashboard**
before doing anything else, and don't commit `.env` to git.

Pick one before you deploy:

1. **Best: add a tiny serverless proxy** (a Cloudflare Worker, or a Netlify/
   Vercel Function) that holds your real key and forwards requests to
   `v3.football.api-sports.io`. Then set `baseUrl` in `js/config.js` to your
   proxy's URL instead of the API directly, and leave `key` blank (the proxy
   attaches it, not the browser).
2. **Simplest, but public:** paste a key into `js/config.js` knowing it will
   be visible to anyone who opens dev tools. Fine for a disposable demo key,
   not fine for a key you care about.
3. **Keep the real server running elsewhere** (Render, Railway, Fly.io,
   etc.) and treat this static build as a front-end preview only.

This build also calls `v3.football.api-sports.io` directly from the
browser. If you see `Failed to fetch` / CORS errors in the console, that's
API-Football not sending CORS headers for browser requests — option 1
above (a proxy) fixes this too, since the proxy can set its own CORS
headers.

## Deploying to GitHub Pages

1. Create a new GitHub repo (or use an existing one) and push this folder's
   contents to it — e.g. as the repo root, or under `/docs`.
2. In the repo, go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **Deploy from a branch**.
4. Pick the branch (e.g. `main`) and the folder (`/ (root)` or `/docs`,
   matching where you put these files), then **Save**.
5. GitHub gives you a URL like `https://<username>.github.io/<repo>/` —
   your site is live there within a minute or two.
6. `404.html` at the root is picked up automatically by GitHub Pages for
   any unmatched path.

## Local preview

Open `index.html` directly, or serve the folder locally, e.g.:

```bash
npx serve .
```

(A plain `file://` open works for browsing between pages, but some
browsers restrict `fetch()` on `file://` — a local server avoids that.)
