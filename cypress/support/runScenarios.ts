import { CalculatorPage, CalculatorScenario, ClearAndContinueScenario } from './pages/CalculatorPage';

/** Generates one `it()` per scenario: types keys, then asserts the resulting display. */
export function runCalculatorScenarios(scenarios: CalculatorScenario[]): void {
  scenarios.forEach((scenario) => {
    it(`[${scenario.category}] ${scenario.description}`, () => {
      CalculatorPage.typeSequence(scenario.keys);
      CalculatorPage.assertDisplay(scenario.expected);
    });
  });
}

/** Generates one `it()` per scenario: types keys, presses Clear, then asserts the display. */
export function runClearScenarios(scenarios: CalculatorScenario[]): void {
  scenarios.forEach((scenario) => {
    it(`[${scenario.category}] ${scenario.description}`, () => {
      CalculatorPage.typeSequence(scenario.keys);
      CalculatorPage.pressClear();
      CalculatorPage.assertDisplay(scenario.expected);
    });
  });
}

/** Generates one `it()` per scenario: types keys, clears mid-sequence, types more keys, then asserts the display. */
export function runClearAndContinueScenarios(scenarios: ClearAndContinueScenario[]): void {
  scenarios.forEach((scenario) => {
    it(`[${scenario.category}] ${scenario.description}`, () => {
      CalculatorPage.typeSequence(scenario.keysBeforeClear);
      CalculatorPage.pressClear();
      CalculatorPage.typeSequence(scenario.keysAfterClear);
      CalculatorPage.assertDisplay(scenario.expected);
    });
  });
}
