/**
 * Page Object for the online-calculator.com full-screen calculator.
 *
 * The calculator UI is an Adobe Animate (EaselJS) <canvas> app embedded in an
 * iframe - there are no real DOM buttons to click. All input is therefore
 * simulated as native keyboard events dispatched on the iframe's own
 * `document`, exactly as a real keyboard would, and the current value is
 * read from the app's internal `exportRoot.showscreen_txt.text` display node.
 */

const CALCULATOR_PATH = '/full-screen-calculator/';

/** Non-printable keys the calculator listens for via `keydown` (not `keypress`). */
const KEY_CODES = {
  Clear: 67,
  Backspace: 8,
} as const;

interface CalculatorWindow extends Window {
  KeyboardEvent: typeof KeyboardEvent;
  exportRoot: {
    showscreen_txt: {
      text: string;
    };
  };
}

const dispatchKeydown = (win: CalculatorWindow, keyCode: number): void => {
  const event = new win.KeyboardEvent('keydown', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'which', { get: () => keyCode });
  Object.defineProperty(event, 'keyCode', { get: () => keyCode });
  win.document.dispatchEvent(event);
};

const dispatchKeypress = (win: CalculatorWindow, char: string): void => {
  const code = char === 'Enter' ? 13 : char.charCodeAt(0);
  const event = new win.KeyboardEvent('keypress', { bubbles: true });
  Object.defineProperty(event, 'which', { get: () => code });
  Object.defineProperty(event, 'keyCode', { get: () => code });
  win.document.dispatchEvent(event);
};

const queryIframe = () => cy.get('iframe', { timeout: 10000, log: false });

export const CalculatorPage = {
  /** Navigates to the full-screen calculator page. */
  visit(): void {
    cy.visit(CALCULATOR_PATH);
  },

  /** Resizes the browser viewport. Call before `visit()` for a true responsive load. */
  setViewport(width: number, height: number): void {
    cy.viewport(width, height);
  },

  /** Resolves once the calculator iframe has finished initializing its script. */
  getCalculatorFrame(): Cypress.Chainable<CalculatorWindow> {
    return queryIframe()
      .should(($iframe) => {
        expect(($iframe[0].contentWindow as CalculatorWindow).exportRoot).to.exist;
      })
      .then(($iframe) => $iframe[0].contentWindow as CalculatorWindow);
  },

  /** Asserts the iframe is visible and its calculator UI has finished loading. */
  assertIframeLoaded(): void {
    queryIframe().should('be.visible');
    this.assertDisplay('0');
  },

  /** Asserts the calculator's display shows exactly the given text. */
  assertDisplay(expected: string): void {
    queryIframe().should(($iframe) => {
      const win = $iframe[0].contentWindow as CalculatorWindow;
      expect(win.exportRoot).to.exist;
      expect(win.exportRoot.showscreen_txt.text).to.eq(expected);
    });
  },

  /** Reads the current display text. */
  getDisplay(): Cypress.Chainable<string> {
    return this.getCalculatorFrame().then((win) => win.exportRoot.showscreen_txt.text);
  },

  /** Dispatches a single keypress (digit, operator, "." or "Enter"). */
  pressKey(char: string): void {
    this.getCalculatorFrame().then((win) => dispatchKeypress(win, char));
  },

  /** Dispatches the Clear (C) keyboard shortcut. */
  pressClear(): void {
    this.getCalculatorFrame().then((win) => dispatchKeydown(win, KEY_CODES.Clear));
  },

  /** Dispatches the Backspace keyboard shortcut. */
  pressBackspace(): void {
    this.getCalculatorFrame().then((win) => dispatchKeydown(win, KEY_CODES.Backspace));
  },

  /** Types a sequence of keys, one keypress event per entry. */
  typeSequence(keys: string[]): void {
    keys.forEach((key) => this.pressKey(key));
  },

  /**
   * Proves the calculator is still responsive after an edge case (error,
   * invalid input, etc.) by clearing it and running a trivial calculation.
   */
  assertUsableAfterEdgeCase(): void {
    this.pressClear();
    this.typeSequence(['1', '+', '1', 'Enter']);
    this.assertDisplay('2');
  },
};
