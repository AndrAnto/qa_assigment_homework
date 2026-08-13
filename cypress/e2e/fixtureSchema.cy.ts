import { BaseScenario, CalculatorScenario, ClearAndContinueScenario } from '../support/pages/CalculatorPage';
import scenarios from '../fixtures/calculator-scenarios.json';

const CATEGORIES = ['happy', 'negative', 'edge'];

/** Shared assertions for the fields every scenario shape must have. */
function assertBaseScenarioShape(scenario: BaseScenario, context: string): void {
  expect(scenario, context).to.have.property('description').that.is.a('string').and.is.not.empty;
  expect(scenario, context).to.have.property('expected').that.is.a('string');
  expect(scenario, context).to.have.property('category').that.is.oneOf(CATEGORIES);
}

// Guards against typos/renames in the fixture silently producing `undefined` at runtime.
describe('calculator-scenarios.json fixture shape', () => {
  (['division', 'subtraction', 'clearSimple'] as const).forEach((key) => {
    it(`each "${key}" scenario has description/keys/expected/category`, () => {
      (scenarios[key] as CalculatorScenario[]).forEach((scenario, index) => {
        const context = `${key}[${index}]`;
        assertBaseScenarioShape(scenario, context);
        expect(scenario, context).to.have.property('keys').that.is.an('array').and.is.not.empty;
      });
    });
  });

  it('each "clearAndContinue" scenario has description/keysBeforeClear/keysAfterClear/expected/category', () => {
    (scenarios.clearAndContinue as ClearAndContinueScenario[]).forEach((scenario, index) => {
      const context = `clearAndContinue[${index}]`;
      assertBaseScenarioShape(scenario, context);
      expect(scenario, context).to.have.property('keysBeforeClear').that.is.an('array').and.is.not.empty;
      expect(scenario, context).to.have.property('keysAfterClear').that.is.an('array').and.is.not.empty;
    });
  });
});
