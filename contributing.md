> [Please consider to contribute to the new Boost Note app too!](https://github.com/BoostIO/BoostNote.next)

> **Important:** This project uses a **Docker-only build policy**. All commands (`npm test`, `npm run lint`, etc.) run inside Docker containers. Never run `npm`/`yarn`/`electron`/`grunt` on the host. See [AGENTS.md](AGENTS.md) for the full command reference.

# Contributing to Boostnote (English)

### When you open an issue or a bug report
There is an issue template for you to follow. Please provide as much information as you can according to the template.

Thank you in advance for your help.

### When you open a pull request
There is a pull request template for your to follow. Please fill in the template before submitting your code. Your pull request will be reviewed faster if we know exactly what it does.

Make sure that you have:
- Checked [`code_style.md`](docs/code_style.md) for information on code style
- Write tests for your code and run test inside Docker
```
docker run --rm boostnote-legacy npm run test
```
- Lint your code inside Docker
```
docker run --rm boostnote-legacy npm run lint
```

If you don't have a Docker image yet, build one first:
```
docker build --build-arg GIT_COMMIT=$(git rev-parse --short HEAD) -t boostnote-legacy .
```

### Concerning Copyright

By making a pull request you agree to transfer ownership of your code to BoostIO.

This doesn't mean Boostnote will become a paid app. If we want to earn money, we will find other way. Potentially some kind of cloud storage, mobile app integration, or some premium features.

