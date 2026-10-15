# Working agreement (paste this into every Claude session)

You are editing a multi-file HTML prototype. Two people work on it in parallel through Git.

## Hard rules for Claude

1. Edit only the files for the flow you were asked to change. Use targeted edits (Edit tool or small diffs).
   Never regenerate or rewrite a whole file, and never re-emit `index.html` in full.
2. Do not touch the shared files listed below unless the task requires it. If it does, say so before changing them and keep the change minimal.
3. New code goes in a new file (`js/<flow>.js`, `styles/<flow>.css`) and is added to `index.html` with one line, before `js/main.js`.
4. Name new CSS classes and global functions/variables with your flow prefix (see Prefixes) so two people never define the same name.
5. Scripts share one global scope. Before adding a global `const`, `let` or `function`, grep for the name. A duplicate `const` breaks the whole page.
6. Startup calls (things that run on load) go in `js/main.js`, not in the module files.
7. After changes, open the page and check the browser console is clean.

## Shared files (change rarely, in small PRs, tell the other person)

| File | Why shared |
|---|---|
| `index.html` | one script/link line per new file; rail and nav markup |
| `styles/base.css` | design tokens (`:root`), card and tag styles |
| `js/followed.js` | `INSIGHT_META`, `PRIORITY`, `FOLLOW_TRACK` registries: every flow reads these |
| `js/editions.js` | `EDITIONS`, scenarios (`scenarioSeed`, `setScenario`) |
| `js/main.js` | startup order |

Adding a new insight means editing the registries above. Make that its own tiny PR and merge it first.

## Prefixes

Agree these once and write them here.

| Person | Flow | CSS prefix | JS prefix |
|---|---|---|---|
| Divisht | _fill in_ | `dj-` | `dj` |
| Teammate | _fill in_ | `tm-` | `tm` |

## Design system

Sprinklr tokens live in `:root` in `styles/base.css` (`--ink`, `--accent`, `--pos`, `--neg`, `--warn`, radii, shadows). Reuse them; do not add new colors.
Fonts: Manrope for headings and figures, Inter for body.

## Git routine

```
git checkout main && git pull
git checkout -b feature/<flow>-<name>
# work, commit small and often
git pull --rebase origin main      # at least daily, and before opening a PR
git push -u origin feature/<flow>-<name>
# open a PR into main; the other person reviews and merges
```

When a merge conflict happens, open the file, give Claude both sides, and say: "keep both sides' changes; do not drop either."
