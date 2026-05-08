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
| 0.16.2 | 5.0.13 | 73.0.3683.121 | 12.0.0 | 7.3.492.27-electron.0 | current |

## Iterations

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

