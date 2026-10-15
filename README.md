# Survey Insights prototype

Clickable HTML prototype for CFM Survey Insights (feed, Followed, Shared, editions, email digests, navigation).
No build step. Plain HTML, CSS and JS, with Tailwind loaded from its CDN.

## Run it

```
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly in the browser also works.

## Layout

```
index.html              page markup (rail, nav, feed, drawer, layers); loads everything below
styles/
  base.css              tokens, tags, cards, editions, email, shared styles
  home-nav.css          Sprinklr home / CFM navigation path
  insight-card.css      the one insight-card anatomy
  card-layouts.css      card layout options A/B/C + sample cards
  journeys.css          "How cards change" page
js/
  tailwind-config.js    Tailwind theme
  nav.js                tab navigation, Followed/Shared panes, rail mode
  followed.js           follow model, INSIGHT_META / PRIORITY registries, action plans
  sharing.js            share modal, activity, shared viewer, feedback
  feed-actions.js       done / dismiss / follow, journey states, toast, drawer
  investigate.js        drill-down panel + per-insight content, Copilot, grounding, Configure
  configure-wizard.js   guided setup wizard
  email.js              email digest journey, deep links
  home-nav.js           Sprinklr home -> CFM
  editions.js           editions, snapshots, catch-up, scenarios
  quiet-edition.js      quiet edition
  nav-options.js        navigation options page
  card-layouts.js       card layout options page
  card-journeys.js      "How cards change" page
  card-types.js         "Cards by insight type" page
  main.js               startup calls; runs LAST
```

Scripts are classic (not ES modules) and share one global scope, so the inline `onclick="..."` handlers keep working.
Load order is the order in `index.html`. Do not reorder without testing.

## Rules for working in parallel

See [CONTEXT.md](CONTEXT.md). Short version: one branch per flow, small PRs, pull `main` daily, avoid editing shared registries in the same PR as a teammate.

## Branches

- `main`: always opens and works. Never commit to it directly.
- `feature/<flow>-<name>`: your work, e.g. `feature/email-divisht`.
