# AGENTS.md — BoostNote-Legacy

## CRITICAL: Docker-only policy

**NEVER run any npm, yarn, electron, grunt, or node command on the host machine.**
All operations — dependency install, compile, test, lint, package — MUST run inside Docker.
Local `node_modules/` is for the Linux Docker build only and is incompatible with the host OS.
The only host commands allowed are `git`, `docker`, `codesign` (for exported .app bundles), and file editing.

## What this is

Legacy desktop note-taking app for programmers. Built with **Electron 5**, **React 16 + Redux**, **Webpack 1**, **Babel 6**, **Stylus (CSS Modules)**, and **CodeMirror**. This is a deprecated codebase; the successor is BoostNote-App.

## Architecture

- **`index.js`** — Electron main entry. Handles Squirrel (Windows) auto-update lifecycle, then loads `lib/main-app.js`.
- **`lib/`** — Electron main process: `main-app.js` (app lifecycle, update checker), `main-window.js` (BrowserWindow creation), `main-menu.js`, `ipcServer.js`, `touchbar-menu.js` (macOS Touch Bar).
- **`browser/`** — React renderer process: `browser/main/index.js` is the webpack entry. `browser/main/store.js` is the Redux store (uses `connected-react-router` + Immutable.js). Contains React components and styles.
- **`compiled/`** — Webpack build output (generated).
- **`dist/`** — Packaged Electron app output (generated).
- **`tests/`** — Mixed test suite: AVA for `*-test.js` files, Jest for component/unit tests.
- **`config.json`** — Electron build configuration (electron-version, etc.).
- **`locales/`** — Internationalization (i18n) files.
- **`dev-scripts/dev.js`** — Dev server orchestrator, launched by `npm run dev`.

## Commands (all run inside Docker unless noted)

| Container command | Host equivalent (DO NOT RUN) |
|---|---|
| `docker build --build-arg GIT_COMMIT=$(git rev-parse --short HEAD) -t boostnote-legacy .` | *(build)* |
| `docker run --rm boostnote-legacy npm run test` | `npm run test` |
| `docker run --rm boostnote-legacy npm run lint` | `npm run lint` |
| `docker run --rm boostnote-legacy npm run ava` | `npm run ava` |
| `docker run --rm boostnote-legacy npm run jest` | `npm run jest` |
| `docker run --rm boostnote-legacy npm run compile` | `npm run compile` |
| `docker cp <container>:/app/dist ./dist/` | `grunt pre-build` |
| `codesign --deep --force --sign - <app>` | `grunt build` (codesign step) |

> **Note:** Always pass `--build-arg GIT_COMMIT=$(git rev-parse --short HEAD)` when building. Without it the About dialog shows `unknown` as the commit hash.

## Export after every build

Every time a Docker build completes, the packaged `.app` **must** be copied to the host `./dist/` directory:

```bash
docker cp $(docker create --rm boostnote-legacy):/app/dist/Boostnote-darwin-x64 ./dist/
```

Alternatively, after `docker build`:

```bash
docker run --rm -d --name boostnote-tmp boostnote-legacy sleep 1 && \
docker cp boostnote-tmp:/app/dist/Boostnote-darwin-x64 ./dist/ && \
docker kill boostnote-tmp
```

This ensures the host `./dist/` always reflects the latest build.

## Key quirks

- **Two test frameworks** run sequentially. AVA tests live in `tests/**/*-test.js`. Jest picks up remaining test files.
- **Webpack 1 + Babel 6** — very old toolchain. Loader syntax uses `!` chains (e.g. `style!css?modules!stylus`).
- **Webpack aliases**: `lib` resolves to `./lib`, `browser` resolves to `./browser`. Used in imports throughout.
- **CSS Modules** via `react-css-modules` and Stylus. Class names pattern: `[name]__[local]___[path]`.
- **`secret/auth_code.json`** is required for code signing. Absent in dev — codesign tasks silently skip.
- **Electron 5.0.13** is pinned in `config.electron-version` and `devDependencies`.
- **HMR requires manual refresh** when editing constructors or adding new CSS classes (they're registered at construction time).
- **Husky pre-commit hook** runs `npm run lint`.
- **Stylus** uses `nib` for mixins; global styles imported via `browser/styles/index.styl`.
- **Many libraries externaled** (prettier, electron, lodash, moment, react, redux, codemirror, etc.) — they're loaded via `<script>` tags in the HTML, not bundled. See `webpack-skeleton.js`.
- **Docker-only build workflow** — UPGRADE.md mandates building only through Docker (Node 8.17, Debian Stretch). The `Dockerfile` handles the full compile + package pipeline.
- **Immutable.js-lite** — Redux store uses `browser/lib/Mutable.js` wrapping `immutable` Map/Set, not plain JS objects.
- **`locales/` directory** — i18n translations for multiple languages; loaded via `browser/lib/i18n.js`.
- **Webpack 1 `process` shim** — Webpack 1 injects its own `process` polyfill into the renderer bundle. The shim has `process.versions = {}`, so `process.versions.node` is `undefined`. Any dependency that reads `process.versions.node` at module load time (e.g. `fs-extra@7+` with its `nodeSupportsBigInt()` check) will crash at runtime with `Cannot read property 'split' of undefined`. Cap such dependencies below the version that introduced the check, or ensure they are excluded from the webpack bundle entirely.

## Style

- ESLint: extends `standard` + `standard-jsx` + `plugin:react/recommended` + `prettier`
- Prettier: `singleQuote: true`, `semi: false`, `jsxSingleQuote: true`
- All ESLint warnings (no-unused-vars, no-undef, etc.) are warnings not errors.

## Node version

Docs specify **Node 8.x / npm 6.x**. Modern Node versions will fail. **Never run npm/yarn on the host.** The Docker container provides the correct Node 8.17 environment.

## Upgrade log

Maintain `UPGRADE.md`.

After every successful iteration, append:

- source version
- target version
- changed files
- build command
- test command
- verification result
- known issues
- rollback commit

