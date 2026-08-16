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

Discovered issues:
### 1. Incorrect Percentage Calculation with Multiplication
**Steps:** Enter `200 × 10%`
**Expected:** `20`
**Actual:** `4000`
**Issue:** The calculator incorrectly treats `10%` as `20` instead of `0.1` during multiplication.

### 2. Incorrect Percentage Calculation with Division
**Steps:** Enter `200 ÷ 10%`
**Expected:** `2000`
**Actual:** `10`
**Issue:** The calculator incorrectly calculates the percentage relative to the first operand before performing division.

### 3. Incorrect `0 ÷ 100` Result
**Steps:** Enter `0 ÷ 100 =`
**Expected:** `0`
**Actual:** `Error`
**Issue:** Dividing zero by a non-zero number should return `0`, not an error.
### 4. Unexpected Operator Precedence in Basic Calculator
**Steps:** Enter `2 + 3 × 6 =`
**Expected:** `30` for a basic sequential calculator (`2 + 3 = 5`, then `5 × 6 = 30`)
**Actual:** `20`
**Issue:** The basic calculator applies mathematical operator precedence without clearly indicating this behavior to the user.
### 5. Silent 9-Digit Input Limit
**Steps:** Enter 10 digits.
**Expected:** The calculator should either accept the input or clearly indicate that the maximum digit limit has been reached.
**Actual:** The 10th digit is silently ignored and the display remains capped at 9 digits.
**Issue:** There is no feedback explaining why additional input is rejected.
### 6. Backspace Does Not Work at 9-Digit Limit
**Steps:** Enter `999999999`, then press Backspace.
**Expected:** The display should change from `999 999 999` to `99 999 999`.
**Actual:** Backspace has no effect.
**Issue:** Backspace works normally below the 9-digit limit but fails when the display is at the maximum length.
### 7. Repeated `=` Re-applies the Last Operation
**Steps:** Enter `7 + 2 =`, then press `=` again.
**Expected:** The display should remain `9`.
**Actual:** The calculator performs `9 + 2` and changes the result to `11`.
**Issue:** Pressing `=` repeatedly re-applies the last operator and operand instead of leaving the completed result unchanged.
