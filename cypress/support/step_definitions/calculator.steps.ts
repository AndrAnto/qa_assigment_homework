import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { CalculatorPage } from '../pages/CalculatorPage';

/** Splits a human-readable expression into individual calculator keys, mapping "=" to Enter. */
function toKeys(expression: string): string[] {
  return expression.split('').map((char) => (char === '=' ? 'Enter' : char));
}

Given('the calculator is loaded', () => {
  CalculatorPage.visit();
  CalculatorPage.assertDisplay('0');
});

Given('the viewport is set to {int}x{int}', (width: number, height: number) => {
  CalculatorPage.setViewport(width, height);
});

When('I enter {string} on the calculator', (expression: string) => {
  CalculatorPage.typeSequence(toKeys(expression));
});

When('I type {string} using the keyboard', (expression: string) => {
  CalculatorPage.typeSequence(toKeys(expression));
});

When('I press Clear', () => {
  CalculatorPage.pressClear();
});

When('I press Backspace', () => {
  CalculatorPage.pressBackspace();
});

Then('the calculator display shows {string}', (expected: string) => {
  CalculatorPage.assertDisplay(expected);
});

Then('the calculator iframe is visible and ready', () => {
  CalculatorPage.assertIframeLoaded();
});

Then('the calculator is still usable', () => {
  CalculatorPage.assertUsableAfterEdgeCase();
});
