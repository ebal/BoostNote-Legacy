# TASKS.md — BoostNote-Legacy Project Findings

## Bugs (correctness-breaking)

- [x] **store.js:305** — `new Set(null)` → `new Set()`. Null not iterable per spec; explicit empty Set.
- [x] **store.js:167** — `MOVE_NOTE` keyed `storageNoteMap` with `folderKey` → fixed to `note.storage`.
- [x] **main-window.js:74-81** — Removed spurious backspace `sendInputEvent` calls fired unconditionally on every window load.

## Risks (crashes / race conditions / silent failures)

- [x] **index.js:23** — `updateProcess.stdout` accessed after `spawn()` throw: catch called `cb(e)` but didn't `return`, so execution continued with `updateProcess = null`. Added `return` in catch.
- [x] **browser/main/index.js:76** — Hardcoded `document.styleSheets[54]` replaced with a dedicated `<style>` element appended to `<head>`.
- [~] **ConfigManager.js:173** — False positive. `JSON.parse(null)` returns `null` in JS; `Object.assign({}, DEFAULT_CONFIG, null)` ignores null source → safe.
- [~] **dataApi/deleteNote.js:30-33** — False positive. `deleteAttachmentFolder` uses `rimrafSync` (synchronous); no Promise, no race condition.
- [~] **dataApi/formatPDF.js:8** — Intentional. `webSecurity: false` needed to load local `file://` attachment images in PDF export. Mitigated by `javascript: false`.
- [~] **webpack-skeleton.js:10** — Intentional. Empty string `''` in Webpack 1 `resolve.extensions` is the standard idiom to allow explicit-extension imports.
