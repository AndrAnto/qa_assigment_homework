import { CalculatorPage, CalculatorScenario } from '../support/pages/CalculatorPage';
import { runCalculatorScenarios } from '../support/runScenarios';
import scenarios from '../fixtures/calculator-scenarios.json';

describe('Division tests', () => {
  beforeEach(() => {
    CalculatorPage.visit();
    CalculatorPage.assertDisplay('0');
  });

  runCalculatorScenarios(scenarios.division as CalculatorScenario[]);
});
