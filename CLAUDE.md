# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Docker-only policy

**NEVER run npm/yarn/electron/grunt/node on the host.** Local `node_modules/` is for the Linux Docker build only. Allowed host commands: `git`, `docker`, `codesign`.

## Commands

| Task | Command |
|---|---|
| Build (Intel/amd64) | `docker build --build-arg GIT_COMMIT=$(git rev-parse --short HEAD) -t boostnote-legacy .` |
| Build (Apple Silicon/arm64) | `docker build --platform linux/arm64 --build-arg GIT_COMMIT=$(git rev-parse --short HEAD) --build-arg BUILDARCH=arm64 -t boostnote-legacy-arm64 .` |
| Test all | `docker run --rm boostnote-legacy npm test` |
| AVA tests only | `docker run --rm boostnote-legacy npm run ava` |
| Jest tests only | `docker run --rm boostnote-legacy npm run jest` |
| Lint | `docker run --rm boostnote-legacy npm run lint` |
| Lint fix | `docker run --rm boostnote-legacy npm run fix` |
| Compile (webpack) | `docker run --rm boostnote-legacy npm run compile` |
| Dev (HMR) | `docker run --rm boostnote-legacy npm run dev` |
| Export .app (Intel) | `docker cp $(docker create --rm boostnote-legacy):/app/dist/Boostnote-darwin-x64 ./dist/` |
| Export .app (arm64) | `docker cp $(docker create --rm boostnote-legacy-arm64):/app/dist/Boostnote-darwin-arm64 ./dist/` |

Omitting `GIT_COMMIT` build-arg → About dialog shows "unknown".

### Running a single test

AVA picks `tests/**/*-test.js`; run one file:
```bash
docker run --rm boostnote-legacy npx ava tests/dataApi/createNote-test.js
```

Jest picks everything else under `tests/`:
```bash
docker run --rm boostnote-legacy npx jest tests/components/MyComponent.test.js
```

## Architecture

```
index.js → Squirrel lifecycle → lib/main-app.js
    ├── lib/main-window.js     BrowserWindow creation
    ├── lib/main-menu.js       native app menu
    ├── lib/ipcServer.js       node-ipc server (main process)
    └── lib/touchbar-menu.js

browser/main/index.js  (webpack entry → compiled/main.js)
    ├── store.js               Redux store + Immutable.js via Mutable.js wrappers
    ├── Main.js                root component → SideNav | NoteList | Detail
    ├── lib/dataApi/           CRUD operations on .cson note files
    ├── lib/ConfigManager.js   electron-config wrapper
    ├── lib/shortcutManager.js keyboard shortcut registry
    └── lib/ThemeManager.js
```

Notes are stored as `.cson` files in user-defined storage directories on disk. `browser/main/lib/dataApi/` contains all read/write operations against those files.

Webpack aliases: `lib` → `./lib`, `browser` → `./browser`. These are used throughout import paths.

## Toolchain quirks

- **Webpack 1 + Babel 6** — loader chains use `!` syntax (e.g. `style!css?modules!stylus`), not the modern `use:[]` form.
- **Externals:** electron, react, redux, codemirror, lodash, moment, prettier are loaded via `<script>` tags in the HTML skeleton (`webpack-skeleton.js`), not bundled. Do not attempt to import them as if they were bundled.
- **`process` shim:** Webpack 1 injects `process.versions = {}`. Any dep reading `process.versions.node` at module load (e.g. `fs-extra@7+`) crashes. Pin such deps or external them.
- **CSS Modules** via `react-css-modules` + Stylus. Class name pattern: `[name]__[local]___[path]`.
- **HMR dev:** Manual refresh needed when editing constructors or adding new CSS classes (registered at construction time).

## Electron quirks

- **Dialog API:** Electron 9+ removed sync/callback forms. Use `showMessageBoxSync` and Promise-based `showOpenDialog`/`showSaveDialog`.
- **webPreferences:** `enableRemoteModule: true`, `nodeIntegration: true`, `contextIsolation: false` are required.
- Node 14 (Debian bullseye) inside Docker; Electron 11.5.0 (Chrome 87, Node 12) at runtime.

## Test quirks (pre-existing failures — do not fix)

- `npm test` = `npm run ava && npm run jest` (sequential).
- AVA runs serially (`--serial`).
- Jest picks up test files inside `dist/Boostnote-darwin-*/` → fail with environment mismatch. Ignore.
- `createNote`/`createNoteFromUrl` Jest tests fail with "Target folder doesn't exist" (test-data issue). Ignore.

## Lint / Prettier

- ESLint: `standard` + `standard-jsx` + `plugin:react/recommended` + `prettier`.
- Prettier config: `singleQuote: true`, `semi: false`, `jsxSingleQuote: true`.
- Unused vars/undef are warnings, not errors.
- **Do NOT fix** the 6 pre-existing `prettier/prettier` errors in `MarkdownPreview.js`, `markdown.js`, `store.js` — host prettier (1.18) and Docker prettier (1.19) disagree; fixing one breaks the other.
- Pre-commit hook runs `npm run lint` (husky).
