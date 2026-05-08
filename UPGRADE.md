# Electron Upgrade Log

## Rules

- Upgrade one Electron major/minor step at a time.
- **All** operations (dependency install, compile, test, lint, package) run inside Docker only. Never run npm/yarn/grunt on the host.
- Delete `./dist/` before every build.
- **Export after every build** — copy the packaged `.app` to the host `./dist/` immediately (see AGENTS.md for exact commands).
- Keep git commits small and reversible.
- The Docker container provides Node 8.17 (Debian Stretch). Host Node.js is incompatible.

## Known versions

| App version | Electron | Chrome | Node.js | V8 | Status |
|---|---:|---:|---:|---:|---|
| 0.16.1 | 4.2.12 | 69.0.3497.128 | 10.11.0 | 6.9.427.31-electron.0 | baseline |
| 0.16.2 | 5.0.13 | 73.0.3683.121 | 12.0.0 | 7.3.492.27-electron.0 | stable |
| 0.16.3 | 5.0.13 | 73.0.3683.121 | 12.0.0 | 7.3.492.27-electron.0 | current |

## Iterations

### 0.16.2 to 0.16.3 — dep upgrades, bug fixes, cleanup

Status: successful

- **source version**: 0.16.2 (Electron 5.0.13)
- **target version**: 0.16.3 (Electron 5.0.13 — no Electron change)
- **changed files**:
  - `browser/lib/markdown.js`
  - `browser/main/modals/PreferencesModal/FolderItem.js`
  - `tests/lib/__snapshots__/markdown.test.js.snap`
  - `tests/lib/markdown-toc-generator.test.js`
  - `AGENTS.md`
  - `CHANGELOG.md` (new)
  - `Dockerfile`
  - `package.json`
  - `yarn.lock`
- **build command**: `docker build -t boostnote-legacy .`
- **test command**: `docker run --rm boostnote-legacy npm run test` (AVA + Jest)
- **verification result**: all markdown tests pass; checkbox rendering confirmed; app exports and launches correctly
- **known issues**: `createNote` and `createNoteFromUrl` Jest tests fail with "Target folder doesn't exist" — pre-existing test-data issue unrelated to this iteration
- **rollback commit**: `git revert HEAD` back to `85d6efc4`

Summary of changes:

| Area | Change |
|---|---|
| Dependencies | Bumped runtime/test deps to latest compatible versions; locked `fs-extra@^5`, `electron-packager@^12`, `cross-env@^5` for Webpack 1 / Node 8 engine constraints |
| `yarn.lock` | Rewrote Taobao registry URLs (`registry.npm.taobao.org/PKG/download/`) to npmjs.org (`registry.npmjs.org/PKG/-/`) |
| `Dockerfile` | Multi-stage `COPY --from=deps /app/yarn.lock` preserves `yarn install`-resolved lockfile after `COPY . .` overwrites it |
| `markdown.js` | Fixed checkbox rendering broken by markdown-it 6→12: replaced `state.parentType === 'list'` guard with unclosed `list_item_open` token-stack check |
| `FolderItem.js` | Replaced `ReactDOM.findDOMNode(this.refs.colorPicker)` with `React.createRef()` on a wrapper `<div>` |
| KaTeX snapshot | Updated for KaTeX 0.16 HTML (`mathdefault`→`mathnormal`, rounded decimal values, `xmlns` attribute on `<math>`) |
| Menu | Removed **For Team (BoostHub)** entry and all related code from `lib/main-menu.js` |
| Lint | Removed unused `EOL` and `title` variables from `markdown-toc-generator.test.js` |
| Docs | Added `CHANGELOG.md` (Common Changelog format); documented Webpack 1 `process` shim constraint in `AGENTS.md` |

---

### Electron 4.2.12 to 5.0.13

Status: successful

- **source version**: 4.2.12
- **target version**: 5.0.13
- **changed files**:
  - `.dockerignore`
  - `Dockerfile`
  - `AGENTS.md`
  - `UPGRADE.md`
  - `SKILLS.md`
  - `gruntfile.js`
  - `lib/main-window.js`
  - `package.json`
  - `yarn.lock`
- **build command**: `docker build -t boostnote-legacy .`
- **test command**: `docker run --rm boostnote-legacy npm run test` (AVA + Jest)
- **verification result**: Electron 5.0.13 confirmed; app launches and renders correctly
- **known issues**: Electron 5 changed defaults for `nodeIntegration` (false) and `contextIsolation` (true); required explicit `nodeIntegration: true` + `contextIsolation: false` in `BrowserWindow` for renderer to access Node APIs. Docker-built x86_64 binary requires Intel macOS or ad-hoc codesign before execution on modern macOS.
- **rollback commit**: `git revert HEAD`

