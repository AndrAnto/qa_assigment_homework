# qa_assigment_homework

End-to-end test suite for the [online-calculator.com](https://www.online-calculator.com) full-screen calculator, built with [Cypress](https://www.cypress.io/) and TypeScript.

## Prerequisites

- [Node.js](https://nodejs.org/) LTS (v18+) and npm
- Alternatively, [Docker](https://www.docker.com/) / Docker Compose, if you don't want to install Node locally

## Setup

Install dependencies:

```bash
npm ci
```

> **Windows/PowerShell note:** if `npm` fails with a `PSSecurityException` (script execution policy), run commands via `cmd /c "npm ..."` instead, or use Command Prompt/Git Bash.

## Running the tests

| Command | Description |
| --- | --- |
| `npm test` | Runs all Cypress specs headlessly (`cypress run`) |
| `npm run test:open` | Opens the Cypress interactive test runner (`cypress open`) |
| `npm run test:spec -- <path>` | Runs a single spec file, e.g. `npm run test:spec -- cypress/e2e/division.cy.ts` |

The `baseUrl` (`https://www.online-calculator.com`) is set in [cypress.config.ts](cypress.config.ts) and can be overridden for CI resilience if the live site is unreachable:

```bash
npx cypress run --config baseUrl=https://mirror.example.com
```

> Note: `Cypress.env()` is intentionally disabled (`allowCypressEnv: false`) — use the `--config baseUrl=...` override shown above instead.

## Linting and formatting

| Command | Description |
| --- | --- |
| `npm run lint` | Runs ESLint |
| `npm run lint:fix` | Runs ESLint with auto-fix |
| `npm run format` | Formats the codebase with Prettier |
| `npm run format:check` | Checks formatting without writing changes |
| `npm run verify` | Runs lint, format check, and the full test suite |

## Running with Docker

The provided [Dockerfile](Dockerfile) and [docker-compose.yml](docker-compose.yml) run the suite inside the official `cypress/included` image, so no local Node/Cypress install is required:

```bash
docker compose up --build
```

Screenshots and videos produced by the run are written to `./cypress/screenshots` and `./cypress/videos` on the host via volume mounts.

## Project structure

```
cypress/
  e2e/                    # Test specs (clearButton, division, subtraction, fixtureSchema)
  fixtures/               # calculator-scenarios.json — data-driven test scenarios
  support/
    pages/CalculatorPage.ts  # Page object for the calculator UI
    runScenarios.ts          # Shared scenario runners used by the specs
    e2e.ts                   # Cypress support entrypoint
```
