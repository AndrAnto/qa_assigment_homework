# qa_assigment_homework

End-to-end test suite for the [online-calculator.com](https://www.online-calculator.com) full-screen calculator, built with [Cypress](https://www.cypress.io/), [Cucumber](https://github.com/badeball/cypress-cucumber-preprocessor) (BDD/Gherkin) and TypeScript, with [Allure](https://github.com/Shelex/cypress-allure-plugin) reporting.

The calculator UI is an Adobe Animate (EaselJS) `<canvas>` app embedded in an iframe — there are no real DOM buttons. All input is simulated as native keyboard events dispatched on the iframe's own `document` (see [CalculatorPage.ts](cypress/support/pages/CalculatorPage.ts)), and results are read from the app's internal display node.

## Prerequisites

- [Node.js](https://nodejs.org/) LTS (v18+) and npm
- Alternatively, [Docker](https://www.docker.com/) / Docker Compose, if you don't want to install Node locally
- To view Allure reports: Java 8+ (required by the `allure` binary)

## Setup

Install dependencies:

```bash
npm ci
```

> **Windows/PowerShell note:** if `npm` fails with a `PSSecurityException` (script execution policy), run commands via `cmd /c "npm ..."` instead, or use Command Prompt/Git Bash.

## Running the tests

| Command | Description |
| --- | --- |
| `npm test` | Runs all `.feature` scenarios headlessly (`cypress run`) with Allure results collection enabled |
| `npm run test:open` | Opens the Cypress interactive test runner (`cypress open`) |
| `npm run test:spec -- <path>` | Runs a single feature file, e.g. `npm run test:spec -- cypress/e2e/features/arithmetic-operations.feature` |

The `baseUrl` (`https://www.online-calculator.com`) is set in [cypress.config.ts](cypress.config.ts) and can be overridden for CI resilience if the live site is unreachable:

```bash
npx cypress run --config baseUrl=https://mirror.example.com
```

## Allure reports

Every `npm test` / `npm run test:spec` run writes raw results to `allure-results/`. Generate and view the HTML report with:

```bash
npm run allure:generate   # builds allure-report/ from allure-results/
npm run allure:open       # serves the generated allure-report/ folder
# or, in one step:
npm run allure:serve      # builds a temporary report and opens it directly
```

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
  e2e/
    features/                     # Gherkin feature files, grouped by calculator functionality (TC01-TC30)
      iframe.feature               # TC01, TC27 - iframe load & reload
      addition.feature             # TC02
      subtraction.feature          # TC03, TC20
      multiplication.feature       # TC04
      division.feature             # TC05, TC06, TC30
      decimal.feature              # TC07, TC17, TC18, TC23
      zero.feature                 # TC19
      clear.feature                # TC09
      backspace.feature            # TC10
      operators.feature            # TC08, TC11
      keyboard.feature             # TC12, TC13, TC28, TC29
      boundaries.feature           # TC16, TC21, TC22
      calculation-state.feature    # TC15, TC24, TC25, TC26
      responsive.feature           # TC14
  support/
    pages/CalculatorPage.ts       # Page object - all calculator interactions/assertions
    step_definitions/
      calculator.steps.ts         # Cucumber step definitions, delegate to CalculatorPage
    e2e.ts                        # Cypress support entrypoint (registers the Allure plugin)
```

## Documented, non-obvious calculator behaviour

Discovered while writing these tests and verified directly against the live app:

- **Operator precedence is honoured**: `2 + 3 × 4` = `14` (multiplication before addition), not `20`. This matches standard mathematical order of operations and is correct, expected behaviour — not a defect.
- **A second operator replaces a pending one**: `8 + × 2` = `16` (the `×` discards the pending `+`).
- **Division by zero** shows `Error`, and the calculator remains fully usable afterwards.
- **`c` is a Clear keyboard shortcut**, not corrupting/invalid input — it behaves exactly like pressing Clear.
- A bare leading `-` is not rendered as a negative sign (`-`, `4` displays `4`, not `-4`); use `0-4=` to reliably obtain a displayed `-4` for a negative operand. This is a minor UI quirk, noted for future reference.
- **Maximum display length is 9 digits** (grouped in threes, e.g. `123 456 789`); a 10th digit is silently rejected. A computed result that overflows 9 digits switches to scientific notation (e.g. `1e+9`).
- **Chained calculations are supported**: pressing an operator right after `=` continues from the previous result (`5+5=` → `10`, then `*2=` → `20`).
- **Pressing `=` again repeats the last operation** against the current result (`5+2=` → `7`, then `=` again → `9`).
- The calculator's keyboard handling is **global to the page**, not gated behind the iframe having DOM focus — typing still reaches the calculator even if focus is elsewhere on the page.
- The calculator iframe has a stable selector: `iframe#fullframe` (the page also contains several ad/consent iframes, so a bare `iframe` selector is ambiguous).

