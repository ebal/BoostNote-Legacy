# AGENTS.md — BoostNote-Legacy

## Docker-only policy

**NEVER run npm/yarn/electron/grunt/node on the host.** Local `node_modules/` is for the Linux Docker build only. Allowed host commands: `git`, `docker`, `codesign`.

| Task | Command |
|---|---|
| Build (Intel) | `docker build --build-arg GIT_COMMIT=$(git rev-parse --short HEAD) -t boostnote-legacy .` |
| Build (arm64) | `docker build --platform linux/arm64 --build-arg GIT_COMMIT=$(git rev-parse --short HEAD) -f Dockerfile.arm64 -t boostnote-legacy-arm64 .` |
| Test all | `docker run --rm boostnote-legacy npm test` |
| Lint | `docker run --rm boostnote-legacy npm run lint` |
| Fix | `docker run --rm boostnote-legacy npm run fix` |
| AVA only | `docker run --rm boostnote-legacy npm run ava` |
| Jest only | `docker run --rm boostnote-legacy npm run jest` |
| Compile (webpack) | `docker run --rm boostnote-legacy npm run compile` |
| Export .app to host | `docker cp $(docker create --rm boostnote-legacy):/app/dist/Boostnote-darwin-x64 ./dist/` |
| Dev | `docker run --rm boostnote-legacy npm run dev` (WDS :8080 + Electron HMR) |

Without `GIT_COMMIT` build-arg → About dialog shows "unknown".

Node 8.17 (Docker) / 8.x required. Modern Node will fail.

## Architecture

- `index.js` → Squirrel lifecycle → `lib/main-app.js` (app ready, menu, IPC server)
- `lib/` — main process: `main-window.js` (BrowserWindow), `main-menu.js`, `ipcServer.js`, `touchbar-menu.js`
- `browser/` — renderer process, webpack entry `browser/main/index.js`
- Redux store at `browser/main/store.js` — uses `browser/lib/Mutable.js` (wraps Immutable.js Map/Set)
- Webpack aliases: `lib` → `./lib`, `browser` → `./browser`
- `compiled/` — webpack output; `dist/` — packaged Electron app

## Test quirks

- `npm test` = `npm run ava && npm run jest` (sequential)
- AVA picks `tests/**/*-test.js`; Jest picks everything else
- AVA runs serially (`--serial`)
- **Pre-existing failures (ignore):** Jest picks up test files inside `dist/Boostnote-darwin-*/` → fail with environment mismatch. `createNote`/`createNoteFromUrl` Jest tests fail with "Target folder doesn't exist" (test-data issue).

## Toolchain

- Webpack 1 + Babel 6 — loader chains use `!` syntax (`style!css?modules!stylus`)
- Many deps externaled (electron, react, redux, codemirror, lodash, moment, prettier) — loaded via `<script>` tags, not bundled (see `webpack-skeleton.js`)
- CSS Modules via `react-css-modules` + Stylus; class pattern `[name]__[local]___[path]`
- **Webpack `process` shim:** Webpack 1 injects `process.versions = {}`. Any dep reading `process.versions.node` at module load (e.g. `fs-extra@7+`) crashes. Pin such deps or external them.

## Electron quirks

- **Branch difference:** arm64 = Electron 11.5.0 (native darwin/arm64); intel = Electron 5.0.13
- **Dialog API:** Electron 9+ removed sync/callback forms. Use `showMessageBoxSync` and Promise-based `showOpenDialog`/`showSaveDialog`
- **`webPreferences`:** `enableRemoteModule: true`, `nodeIntegration: true`, `contextIsolation: false` required
- `secret/auth_code.json` needed for codesigning; absent → skips silently

## Prettier / lint

- ESLint: `standard` + `standard-jsx` + `plugin:react/recommended` + `prettier`
- Prettier: `singleQuote: true`, `semi: false`, `jsxSingleQuote: true`
- Unused vars/undef are warnings, not errors
- **Pre-existing:** 6 `prettier/prettier` errors inside Docker (prettier 1.19) in `MarkdownPreview.js`, `markdown.js`, `store.js`. Host prettier (1.18) accepts them. Do NOT fix — versions keep reverting each other.

## HMR dev notes

Manual refresh needed when editing constructors or adding CSS classes (registered at construction time).
