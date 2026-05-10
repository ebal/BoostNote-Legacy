# TASKS.md — BoostNote-Legacy Project Findings

## Bugs (correctness-breaking)

- [x] **store.js:305** — `new Set(null)` → `new Set()`. Null not iterable per spec; explicit empty Set.
- [x] **store.js:167** — `MOVE_NOTE` keyed `storageNoteMap` with `folderKey` → fixed to `note.storage`.
- [x] **main-window.js:74-81** — Removed spurious backspace `sendInputEvent` calls fired unconditionally on every window load.

## Risks (crashes / race conditions / silent failures)

- [ ] **index.js:23** — `updateProcess.stdout` accessed without null-check after `spawn()`. Guard: `if (updateProcess)` before accessing.
- [ ] **ConfigManager.js:173** — `JSON.parse()` called without try/catch when value may be `null` → `TypeError` crash on corrupt/missing config.
- [ ] **dataApi/deleteNote.js:30-33** — `deleteAttachmentFolder()` not awaited → race condition; attachments may outlive deleted note on disk.
- [ ] **browser/main/index.js:76** — Hardcoded `document.styleSheets[54]` index for `insertRule()`. Breaks silently if stylesheet load order changes.
- [ ] **dataApi/formatPDF.js:8** — `webSecurity: false` in PDF generation window → no CORS/CSP enforcement during PDF render.
- [ ] **webpack-skeleton.js:10** — `resolve.extensions` includes empty string `''` → ambiguous module resolution, masks missing extensions.
