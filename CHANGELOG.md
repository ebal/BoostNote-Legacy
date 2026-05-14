# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Common Changelog](https://common-changelog.org) and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.17.12] - 2026-05-14

### Added

- Add Linux x86_64 tar.gz to Docker build and CI workflow ([`341eea23`](../../commit/341eea23)).

### Changed

- Pin GHA runner from `ubuntu-latest` to `ubuntu-24.04` for deterministic builds ([`341eea23`](../../commit/341eea23)).
- Bump GHA actions to Node 24 versions (checkout@v6, setup-qemu@v4, setup-buildx@v4, upload-artifact@v7) ([`341eea23`](../../commit/341eea23)).
- Fix linux pack target icon from `.icns` to `.png` in gruntfile ([`341eea23`](../../commit/341eea23)).

### Fixed

- Fix GitHub Actions workflow typo in getting version ([`7c524b08`](../../commit/7c524b08)).

## [0.17.10] - 2026-05-13

### Changed

- Cleanup dead config, fix CoffeeScript string, normalize line endings ([`f97fbf9d`](../../commit/f97fbf9d)).
- Fix GitHub Actions workflow to build macOS DMGs ([`a2f9c6ce`](../../commit/a2f9c6ce)).

### Fixed

- Remove duplicate step ID in build-macos-dmgs workflow ([`a3e3e32b`](../../commit/a3e3e32b)).

## [0.17.9] - 2026-05-11

### Added

- Add GitHub Actions workflow to build macOS DMGs on tag push ([`439c958`](../../commit/439c958)).

### Changed

- Upgrade Docker base image from `node:14-bullseye` to `node:22-bookworm` ([`7571686`](../../commit/7571686), [`8b3d171`](../../commit/8b3d171)).
- Bump `cross-env` ^5.2.0 → ^7.0.3 and `concurrently` ^5.3.0 → ^9.1.2 ([`8b3d171`](../../commit/8b3d171)).

### Fixed

- Fix test compatibility with Node 22 by replacing `global.navigator` assignment with `Object.defineProperty` getter in 18 test files ([`8b3d171`](../../commit/8b3d171)).

## [0.17.8] - 2026-05-10

### Fixed

- Add layout styles for Preferences modal Info tab and Snippet tab to fix content positioning ([`f4f9f0c`](../../commit/f4f9f0c)).

## [0.17.7] - 2026-05-10

### Fixed

- Strip hash fragment from `file://` URIs in context menu builder to prevent `fs.lstatSync` lookup failure on local files with anchors ([`83c71ba`](../../commit/83c71ba)).

## [0.17.6] - 2026-05-10

### Fixed

- Guard `spawnUpdate` against null dereference and replace hardcoded `styleSheets` index with a named reference ([`e3f7a46`](../../commit/e3f7a46)).
- Fix `storageNoteMap` key construction, `folderNoteSet` initialization order, and remove spurious backspace key events from tag/note title editors ([`a8d8c1d`](../../commit/a8d8c1d)).

## [0.17.5] - 2026-05-10

### Fixed

- Remove dead "File → Update" menu item and auto-update IPC stubs (`update-check`, `update-app-confirm`, `update-cancel`, `update-download-confirm`) that were no-ops ([`93af875`](../../commit/93af875)).

## [0.17.4] - 2026-05-10

### Fixed

- Fix `TypeError: this.setState is not a function` when pressing Escape in Settings modal by binding `ModalBase.close` in the constructor ([`68b101c`](../../commit/68b101c)).

### Changed

- Update version-bump agent skill to automatically create annotated git tag on version bump ([`db10f63`](../../commit/db10f63)).

## [0.17.3] - 2026-05-10

### Fixed

- Fix DevTools CSS source map warnings by removing `?sourceMap` from stylus loader in production webpack config; style-loader was emitting `sourceMappingURL` comments for files that were never generated ([`d8bde12`](../../commit/d8bde12)).

### Changed

- Add `build-test-verify` agent skill for Docker-based build, test, and export workflow ([`d8bde12`](../../commit/d8bde12)).

## [0.17.2] - 2026-05-10

### Fixed

- Fix font selection in Settings: apply `fontFamily` directly to CodeMirror wrapper element via `getWrapperElement().style.fontFamily` to circumvent CodeMirror's CSS `monospace` override ([`6f6e314`](../../commit/6f6e314)).
- Fix CSS quoting in `normalizeEditorFontFamily`: wrap multi-word font names (e.g. `'JetBrains Mono'`) in quotes so CSS parses them as single font family ([`6f6e314`](../../commit/6f6e314)).
- Fix crash in Settings when changing any option: guard `this.refs.uiLanguage` which is undefined when language select is hidden (only English) ([`f0ee976`](../../commit/f0ee976)).

### Removed

- Remove "Custom…" option from Editor Font Family dropdown; font dropdown now lists only concrete fonts ([`6f6e314`](../../commit/6f6e314)).

## [0.17.1] - 2026-05-10

### Fixed

- Resolve 3 prettier formatting errors in `UiTab.js` (editor font dropdown introduced in 0.17.0) to restore zero-lint-warning baseline ([`6ef02d3`](../../commit/6ef02d3)).

## [0.17.0] - 2026-05-10

### Removed

- Remove all non-English interface languages from Settings → Interface → Language. Only English remains. Language dropdown is hidden when only one language is available ([`07096e6`](../../commit/07096e6)).
- Delete 19 locale entries from `Languages.js` — all languages except English stripped from the UI selector.

## [0.16.9] - 2026-05-10

### Added

- Add Greek (el_GR) Hunspell dictionary for spellcheck support — new `dictionaries/el_GR/` with affix rules and 828k+ word list from LibreOffice ([`el_GR.aff`](../../dictionaries/el_GR/el_GR.aff), [`el_GR.dic`](../../dictionaries/el_GR/el_GR.dic)).
- Add `version-bump` agent skill (`.agents/skills/version-bump/SKILL.md`) for automated release workflow — updates package.json, CHANGELOG.md, readme.md, and optionally UPGRADE.md.

### Changed

- Rewrite `readme.md` — removed stale upstream links and defunct Travis badge; added current build commands (Docker-only), architecture diagram, tech stack table, and changelog.
- Streamline `contributing.md` to English only with Docker-only policy instructions.
- Clean up `ISSUE_TEMPLATE.md` — removed dead IssueHunt sponsorship link, added Docker build note.

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

[0.17.12]: ../../compare/v0.17.10...v0.17.12
[0.17.10]: ../../compare/v0.17.9...v0.17.10
[0.17.9]: ../../compare/v0.17.8...v0.17.9
[0.17.8]: ../../compare/v0.17.7...v0.17.8
[0.17.7]: ../../compare/v0.17.6...v0.17.7
[0.17.6]: ../../compare/v0.17.5...v0.17.6
[0.17.5]: ../../compare/v0.17.4...v0.17.5
[0.17.4]: ../../compare/v0.17.3...v0.17.4
[0.17.3]: ../../compare/v0.17.2...v0.17.3
[0.17.0]: ../../compare/v0.16.9...v0.17.0
[0.16.9]: ../../compare/v0.16.8...v0.16.9
[0.16.4]: ../../compare/v0.16.3...v0.16.4
[0.16.3]: ../../compare/v0.16.2...v0.16.3
[0.16.2]: ../../compare/v0.16.1...v0.16.2
[0.16.1]: ../../compare/v0.16.0...v0.16.1
