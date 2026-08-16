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

/** Any window-like object keyboard events can be dispatched on (the iframe's or the parent's). */
interface KeyboardTarget {
  KeyboardEvent: typeof KeyboardEvent;
  document: Document;
}

const dispatchKeydown = (target: KeyboardTarget, keyCode: number): void => {
  const event = new target.KeyboardEvent('keydown', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'which', { get: () => keyCode });
  Object.defineProperty(event, 'keyCode', { get: () => keyCode });
  target.document.dispatchEvent(event);
};

const dispatchKeypress = (target: KeyboardTarget, char: string): void => {
  const code = char === 'Enter' ? 13 : char.charCodeAt(0);
  const event = new target.KeyboardEvent('keypress', { bubbles: true });
  Object.defineProperty(event, 'which', { get: () => code });
  Object.defineProperty(event, 'keyCode', { get: () => code });
  target.document.dispatchEvent(event);
};

const queryIframe = () => cy.get('iframe#fullframe', { timeout: 10000, log: false });

export const CalculatorPage = {
  /** Navigates to the full-screen calculator page. */
  visit(): void {
    cy.visit(CALCULATOR_PATH);
  },

  /** Resizes the browser viewport. Call before `visit()` for a true responsive load. */
  setViewport(width: number, height: number): void {
    cy.viewport(width, height);
  },

  /** Reloads the page, forcing the calculator iframe to reinitialize from scratch. */
  reload(): void {
    cy.reload();
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

  /** Clicks the iframe element itself, giving it real browser focus before typing. */
  focusCalculatorFrame(): void {
    queryIframe().click({ force: true });
  },

  /** Clicks the parent page, moving focus away from the calculator iframe. */
  focusParentPage(): void {
    cy.get('body').click({ force: true });
  },

  /** Dispatches keypresses on the parent page's own document, never touching the iframe. */
  typeSequenceOnParentDocument(keys: string[]): void {
    cy.document().then((doc) => {
      const parentWindow = doc.defaultView as unknown as KeyboardTarget;
      keys.forEach((key) => dispatchKeypress(parentWindow, key));
    });
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
