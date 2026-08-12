import { CalculatorPage, CalculatorScenario } from '../support/pages/CalculatorPage';
import scenarios from '../fixtures/calculator-scenarios.json';

describe('Division', () => {
  beforeEach(() => {
    CalculatorPage.visit();
    CalculatorPage.assertDisplay('0');
  });

  (scenarios.division as CalculatorScenario[]).forEach((scenario) => {
    it(`[${scenario.category}] ${scenario.description}`, () => {
      CalculatorPage.typeSequence(scenario.keys);

      CalculatorPage.assertDisplay(scenario.expected);
    });
  });
});
