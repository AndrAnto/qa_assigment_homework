import { CalculatorPage, CalculatorScenario, ClearAndContinueScenario } from '../support/pages/CalculatorPage';
import scenarios from '../fixtures/calculator-scenarios.json';

describe('Clear (C) button', () => {
  beforeEach(() => {
    CalculatorPage.visit();
    CalculatorPage.assertDisplay('0');
  });

  (scenarios.clearSimple as CalculatorScenario[]).forEach((scenario) => {
    it(`[${scenario.category}] ${scenario.description}`, () => {
      CalculatorPage.typeSequence(scenario.keys);
      CalculatorPage.pressClear();
      CalculatorPage.assertDisplay(scenario.expected);
    });
  });

  (scenarios.clearAndContinue as ClearAndContinueScenario[]).forEach((scenario) => {
    it(`[${scenario.category}] ${scenario.description}`, () => {
      CalculatorPage.typeSequence(scenario.keysBeforeClear);
      CalculatorPage.pressClear();
      CalculatorPage.typeSequence(scenario.keysAfterClear);
      CalculatorPage.assertDisplay(scenario.expected);
    });
  });
});
