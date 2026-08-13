import { CalculatorPage, CalculatorScenario, ClearAndContinueScenario } from '../support/pages/CalculatorPage';
import { runClearScenarios, runClearAndContinueScenarios } from '../support/runScenarios';
import scenarios from '../fixtures/calculator-scenarios.json';

describe('Clear button tests', () => {
  beforeEach(() => {
    CalculatorPage.visit();
    CalculatorPage.assertDisplay('0');
  });

  runClearScenarios(scenarios.clearSimple as CalculatorScenario[]);
  runClearAndContinueScenarios(scenarios.clearAndContinue as ClearAndContinueScenario[]);
});
