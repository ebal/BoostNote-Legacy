# AGENTS.md — BoostNote-Legacy

## What this is

Legacy desktop note-taking app for programmers. Built with **Electron 4**, **React 16 + Redux**, **Webpack 1**, **Babel 6**, **Stylus (CSS Modules)**, and **CodeMirror**. This is a deprecated codebase; the successor is BoostNote-App.

## Architecture

- **`index.js`** — Electron main entry. Handles Squirrel (Windows) auto-update lifecycle, then loads `lib/main-app.js`.
- **`lib/`** — Electron main process: `main-app.js` (app lifecycle, update checker), `main-window.js` (BrowserWindow creation), `main-menu.js`, `ipcServer.js`.
- **`browser/`** — React renderer process: `browser/main/index.js` is the webpack entry. Contains React components, Redux store, and styles.
- **`compiled/`** — Webpack build output (generated).
- **`dist/`** — Packaged Electron app output (generated).
- **`tests/`** — Mixed test suite: AVA for `*-test.js` files, Jest for component/unit tests.

## Commands

| Command | Purpose |
|---|---|
| `yarn` | Install deps (preferred over npm per docs) |
| `npm run dev` | Start dev with HMR: webpack-dev-server on :8080 + Electron |
| `npm run watch` | webpack-dev-server hot only (no Electron) |
| `npm start` | Run Electron against unbuilt source |
| `npm run compile` | `grunt compile` — webpack production build to `compiled/` |
| `npm run test` | Runs **AVA then Jest** — both must pass |
| `npm run ava` | AVA tests only (`--serial`, needs babel-register + browser-env setup) |
| `npm run jest` | Jest tests only |
| `npm run lint` | ESLint |
| `npm run fix` | ESLint --fix |
| `grunt pre-build` | Compile + package (no codesign); output in `dist/` |
| `grunt build` | Full build: compile, pack, codesign, installer |

## Key quirks

- **Two test frameworks** run sequentially. AVA tests live in `tests/**/*-test.js`. Jest picks up remaining test files.
- **Webpack 1 + Babel 6** — very old toolchain. Loader syntax uses `!` chains (e.g. `style!css?modules!stylus`).
- **Webpack aliases**: `lib` resolves to `./lib`, `browser` resolves to `./browser`. Used in imports throughout.
- **CSS Modules** via `react-css-modules` and Stylus. Class names pattern: `[name]__[local]___[path]`.
- **`secret/auth_code.json`** is required for code signing. Absent in dev — codesign tasks silently skip.
- **Electron 4** is pinned in `config.electron-version` and `devDependencies`.
- **HMR requires manual refresh** when editing constructors or adding new CSS classes (they're registered at construction time).
- **Husky pre-commit hook** runs `npm run lint`.
- **Stylus** uses `nib` for mixins; global styles imported via `browser/styles/index.styl`.
- **Many libraries externaled** (prettier, electron, lodash, moment, react, redux, codemirror, etc.) — they're loaded via `<script>` tags in the HTML, not bundled. See `webpack-skeleton.js`.

## Style

- ESLint: extends `standard` + `standard-jsx` + `plugin:react/recommended` + `prettier`
- Prettier: `singleQuote: true`, `semi: false`, `jsxSingleQuote: true`
- All ESLint warnings (no-unused-vars, no-undef, etc.) are warnings not errors.

## Node version

Docs specify **Node 8.x / npm 6.x**. Modern Node versions may fail. Use `nvm use 8` or equivalent if possible.
