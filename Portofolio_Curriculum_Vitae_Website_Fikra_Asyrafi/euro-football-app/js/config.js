// js/config.js
//
// IMPORTANT — read before deploying to GitHub Pages:
//
// This app originally ran on a Node/Express server, which kept your
// API-Football key secret (it lived in a server-only .env file and was
// attached to requests behind the scenes).
//
// GitHub Pages only serves static files — there is no server to hide a
// key on. Any key you put in this file ships to every visitor's browser
// and is visible in plain text via "View Source" or the Network tab.
//
// For a public GitHub repo / live GitHub Pages site, do ONE of the following
// instead of pasting a real key below:
//
//   1. (Recommended) Put a small serverless proxy in front of the API
//      (Cloudflare Worker, Netlify/Vercel Function, etc.) that holds the
//      real key server-side, and point API_CONFIG.baseUrl at YOUR proxy
//      instead of api-sports.io directly. Your GitHub Pages site then
//      calls your proxy, never API-Football, and never sees the key.
//   2. Use a key you don't mind being public (e.g. a throwaway/rate-limited
//      key) purely for a portfolio demo, understanding anyone can copy it.
//   3. Keep running the real app (index.js) on a Node host such as Render,
//      Railway, or Fly.io, where the key stays server-side, and only use
//      this static build as a UI preview.
//
// Also note: API-Football's direct host (v3.football.api-sports.io) is
// built for server-to-server use and may not send the CORS headers needed
// for browser fetch() calls to succeed. If you see "Failed to fetch" /
// CORS errors in the browser console, that confirms it — route requests
// through your own proxy (option 1 above) to fix it.

const API_CONFIG = {
  // ⚠️  This key is visible to anyone who views the page source.
  //     Treat it as a portfolio / demo key.  If you want it kept secret,
  //     route requests through a serverless proxy (Cloudflare Worker,
  //     Netlify Function, etc.) that injects the key server-side.
  key: "YOUR_API_FOOTBALL_KEY_HERE", // ⚠️ redacted — do not commit a real key here (see notes above)

  // European football seasons are labeled by their starting year.
  season: 2024,

  // Your API-Football v3 endpoint.
  // If you hit CORS errors in the browser console, set this to the URL
  // of your own serverless proxy instead.
  baseUrl: "https://v3.football.api-sports.io",
};
