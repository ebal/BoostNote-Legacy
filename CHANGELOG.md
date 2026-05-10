# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Common Changelog](https://common-changelog.org) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.16.8] - 2026-05-10

### Changed

- Unify `Dockerfile` to support both amd64 (Intel) and arm64 (Apple Silicon) builds via `BUILDARCH` build arg. Base image updated from `node:8.17` to `node:14-bullseye` (matching `Dockerfile.arm64`). Removed separate `Dockerfile.arm64` ([`829cd67d`](../../commit/829cd67d)).
- Merge `arm64` and `intel` branches into `main`; delete both branches locally and on remote.

## [0.16.7] - 2026-05-08

### Added

- Native Apple Silicon (`darwin/arm64`) build target via `Dockerfile.arm64` using `node:14-bullseye` base image.
- `grunt pack:osx-arm64` task — packages Electron 11.5.0 arm64 binary via electron-packager v15.

### Changed

- **arm64 branch**: Upgrade Electron 5.0.13 → 11.5.0 to enable native arm64 darwin binary support.
- **arm64 branch**: Upgrade electron-packager 12 → 15.4.0 (arm64 darwin support added in v15.2.0).
- **arm64 branch**: Upgrade grunt 0.4.5 → 1.6.1 (Node 14 compatibility).
- **arm64 branch**: Upgrade electron-debug 2 → 3.2.0, electron-devtools-installer 2 → 3.2.0.
- Enable `enableRemoteModule: true` in BrowserWindow webPreferences (required in Electron 11).
- Migrate all `dialog.showMessageBox`/`showOpenDialog`/`showSaveDialog` call sites to Electron 11 async/sync API: sync with return value → `showMessageBoxSync`; callback form → Promise (12 files updated).
- Update gruntfile.js electron-packager v15 option names: `version`→`electronVersion`, `app-version`→`appVersion`, `app-bundle-id`→`appBundleId`, `app-category-type`→`appCategoryType`, `version-string`→`win32metadata`; removed deprecated `darwinDarkModeSupport`.

## [0.16.6] - 2026-05-08

### Removed

- Remove `RealtimeNotification` component — fetched BoostIO marketing banners from GitHub at runtime; deleted `RealtimeNotification.js` / `.styl`.
- Remove `Crowdfunding` preferences tab — dead IssueHunt links; deleted `Crowdfunding.js` / `.styl` and tab entry from `PreferencesModal`.
- Remove all auto-update UI remnants: `updateApp()` / `downloadUpdate()` functions and `ipcRenderer.on` update handlers from `browser/main/index.js`; `updateApp()` method and update button from `StatusBar`; `update` eventEmitter listener from `Main.js`; `status` reducer (`UPDATE_AVAILABLE`, `updateReady`) from `store.js`; `autoUpdateEnabled` config key from `ConfigManager.js` and `InfoTab.js`.
- Remove newsletter subscription form from `InfoTab.js` — POSTed to dead `boostmails.boostio.co` endpoint.
- Remove dead Help menu entries (`Boostnote official site`, `Wiki`, `Changelog`) from `lib/main-menu.js`.

### Changed

- Simplify `InfoTab.js` (Preferences → About): removed all external-service state, methods, and forms; now shows app icon, version, GitHub link, and license only.
- Replace welcome note content in `Main.js` with minimal local text (keyboard shortcuts table; no external links).

## [0.16.5] - 2026-05-08

### Removed

- Remove all analytics telemetry: `AwsMobileAnalyticsConfig` module deleted; all `recordDynamicCustomEvent` and `initAwsMobileAnalytics` call sites removed from `newNote.js`, `Main.js`, `CreateFolderModal.js`, `InfoTab.js`, `TagSelect.js`, `SnippetNoteDetail.js`, `MarkdownNoteDetail.js`, `NoteList/index.js`.
- Remove `aws-sdk` and `aws-sdk-mobile-analytics` npm dependencies; yarn.lock updated.
- Remove Analytics settings section from Preferences → About tab (`InfoTab.js`): `amaEnabled` state, checkbox UI, and Save button removed.

## [0.16.4] - 2026-05-08

### Fixed

- Replace `ReactDOM.render()` return-value pattern with `React.createRef()` in `modal.js` ([`71ad006`](../../commit/71ad0060)). `ModalBase.close()` now uses `this.setState()` instead of a circular module-level reference.

### Changed

- Rename deprecated `componentWillReceiveProps` / `componentWillUpdate` to `UNSAFE_*` in `ColorPicker`, `SnippetTab`, `SnippetNoteDetail`, `NoteList` ([`71ad006`](../../commit/71ad0060)).
- Add `/* global _ */` to `formatHTML.js` — lodash is a runtime global loaded via `<script>` tag, not a bundle import ([`71ad006`](../../commit/71ad0060)).
- Disable auto-update: removed `electron-gh-releases` dependency and all updater code from `main-app.js`; manual Update menu item responds with "Auto-update is disabled in this build" ([`23e0f2da`](../../commit/23e0f2da)).
- Show git commit hash in Help → About dialog (`Version: 0.16.4 (abcd1234)`). Requires `--build-arg GIT_COMMIT=$(git rev-parse --short HEAD)` at Docker build time ([`8fda299b`](../../commit/8fda299b)).

## [0.16.3] - 2026-05-08

### Fixed

- Restore checkbox rendering in markdown preview after markdown-it upgrade to 12.x ([`85d6efc`](../../commit/85d6efc4)). The `state.parentType` API changed between markdown-it 6 and 12; detection now uses token-stack inspection instead.
- Preserve `yarn.lock` resolved by `yarn install` across `COPY . .` in Docker build ([`1115f102`](../../commit/1115f102)).

### Changed

- Upgrade runtime and test dependencies to latest compatible versions ([`b77ad6bf`](../../commit/b77ad6bf), [`ce358e32`](../../commit/ce358e32)). Pins `fs-extra@^5`, `electron-packager@^12` and `cross-env@^5` due to engine constraints in the Webpack 1 / Node 8 build environment.
- Update KaTeX snapshot for 0.16.x HTML output (`mathdefault` → `mathnormal`, rounded decimal values) ([`85d6efc`](../../commit/85d6efc4)).
- Replace deprecated `ReactDOM.findDOMNode` with `React.createRef()` in `FolderItem` color-picker ([`85d6efc`](../../commit/85d6efc4)).
- Document Webpack 1 `process` shim constraint in `AGENTS.md` ([`7db55cbe`](../../commit/7db55cbe)).

### Removed

- Remove **For Team (BoostHub)** menu entry and all related code ([`710c4ab8`](../../commit/710c4ab8)).

## [0.16.2] - 2026-05-08

### Fixed

- Enable `nodeIntegration` and set `contextIsolation: false` in `BrowserWindow` for Electron 5 compatibility ([`c3da0b7a`](../../commit/c3da0b7a)).

### Changed

- Upgrade Electron from 1.x to **5.0.13** (Node.js 12.0.0, Chromium 73) ([`686953ab`](../../commit/686953ab)).
- Rewrite `Dockerfile` with multi-stage build (`base` → `deps` → `build`) for reproducible lockfile handling ([`686953ab`](../../commit/686953ab)).
- Rewrite `yarn.lock` resolved URLs from Taobao registry to npmjs.org ([`b77ad6bf`](../../commit/b77ad6bf)).

## [0.16.1] - 2020-09-04

### Fixed

- Fix unwanted deletion of attachments ([`8958e67f`](../../commit/8958e67f)).
- Fix Cancel button in update dialog ([`3e405e1a`](../../commit/3e405e1a)).
- Fix Analytics save bug ([`2603dfc1`](../../commit/2603dfc1)).
- Fix AutoUpdate not being auto-saved ([`2df59060`](../../commit/2df59060)).
- Avoid conflicting styles between inline code and code blocks ([`58c4a78b`](../../commit/58c4a78b)).

### Added

- Add update menu item with download confirmation dialog ([`85d09b3b`](../../commit/85d09b3b), [`553832bd`](../../commit/553832bd)).

[0.16.4]: ../../compare/v0.16.3...v0.16.4
[0.16.3]: ../../compare/v0.16.2...v0.16.3
[0.16.2]: ../../compare/v0.16.1...v0.16.2
[0.16.1]: ../../compare/v0.16.0...v0.16.1
