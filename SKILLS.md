It should be used whenever I ask to bump or update Electron in a repository.

The skill should:
- accept an Electron target version as input
- determine the matching bundled Chromium, Node.js, and V8 versions
- update package files, lockfiles, and runtime metadata
- **never run any command on the host** — all dependency installs, builds, tests, linting, and packaging run inside Docker only
- delete `./dist/` before building
- run dependency install (`yarn install`) inside `docker build` via the Dockerfile
- run build, tests, and bundle verification via Docker only
- **export the packaged `.app` to host `./dist/` after every build** using `docker cp` (see AGENTS.md for commands)
- stop on failures and report relevant logs
- report changed files and exact Docker commands used
