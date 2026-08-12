// Page Object for the Full Screen Online Calculator (https://www.online-calculator.com/full-screen-calculator/).
//
// The calculator UI is rendered on an HTML5 <canvas> (CreateJS/EaselJS) inside a
// same-origin iframe, so there are no clickable DOM buttons to target. The app
// does, however, listen for real keyboard events on `document` inside that
// iframe, so this page object drives the calculator via keyboard input and
// reads the calculator's internal display state (`exportRoot.showscreen_txt.text`),
// which mirrors exactly what's shown on screen.

const CALCULATOR_URL = 'https://www.online-calculator.com/full-screen-calculator/';

/** A single input→output calculator test case, as stored in the fixture. */
export interface CalculatorScenario {
  description: string;
  keys: string[];
  expected: string;
  category: 'happy' | 'negative' | 'edge';
}

/** A test case that clears mid-sequence and continues with a new calculation, as stored in the fixture. */
export interface ClearAndContinueScenario {
  description: string;
  keysBeforeClear: string[];
  keysAfterClear: string[];
  expected: string;
  category: 'happy' | 'negative' | 'edge';
}

/** Minimal shape of the CreateJS scene graph this page object depends on. */
interface CalculatorWindow extends Window {
  KeyboardEvent: typeof KeyboardEvent;
  exportRoot: {
    showscreen_txt: {
      text: string;
    };
  };
}

/** Sends the dedicated "Clear" keydown (the app listens for `which === 67`, i.e. 'C'). */
const dispatchClearKeydown = (win: CalculatorWindow) => {
  const event = new win.KeyboardEvent('keydown', { bubbles: true, cancelable: true });
  Object.defineProperty(event, 'which', { get: () => 67 });
  Object.defineProperty(event, 'keyCode', { get: () => 67 });
  win.document.dispatchEvent(event);
};

/** Sends a single key to the calculator as if the user typed it. */
const dispatchKeypress = (win: CalculatorWindow, char: string) => {
  const code = char === 'Enter' ? 13 : char.charCodeAt(0);
  const event = new win.KeyboardEvent('keypress', { bubbles: true });
  Object.defineProperty(event, 'which', { get: () => code });
  Object.defineProperty(event, 'keyCode', { get: () => code });
  win.document.dispatchEvent(event);
};

/** Queries the calculator iframe; timeout/log options shared by every frame access below. */
const queryIframe = () => cy.get('iframe', { timeout: 10000, log: false });

export const CalculatorPage = {
  /** Navigates to the calculator page. */
  visit(): void {
    cy.visit(CALCULATOR_URL);
  },

  /** Returns the iframe's `window` once the CreateJS app has initialized. */
  getCalculatorFrame(): Cypress.Chainable<CalculatorWindow> {
    return queryIframe()
      .should(($iframe) => {
        expect(($iframe[0].contentWindow as CalculatorWindow).exportRoot).to.exist;
      })
      .then(($iframe) => $iframe[0].contentWindow as CalculatorWindow);
  },

  /** Asserts the calculator's display eventually shows `expected`, retrying (like a normal `cy.get().should()`) until Cypress's default timeout. */
  assertDisplay(expected: string): void {
    queryIframe().should(($iframe) => {
      const win = $iframe[0].contentWindow as CalculatorWindow;
      expect(win.exportRoot).to.exist;
      expect(win.exportRoot.showscreen_txt.text).to.eq(expected);
    });
  },

  /** Sends a single key to the calculator; callers assert via `assertDisplay()`, which retries until Cypress's default timeout. */
  pressKey(char: string): void {
    this.getCalculatorFrame().then((win) => {
      dispatchKeypress(win, char);
    });
  },

  /** Presses the calculator's Clear (C) key; callers assert via `assertDisplay()`, which retries until Cypress's default timeout. */
  pressClear(): void {
    this.getCalculatorFrame().then((win) => {
      dispatchClearKeydown(win);
    });
  },

  /** Types a full sequence of keys/digits in order (e.g. ['9', '-', '4', 'Enter']). */
  typeSequence(keys: string[]): void {
    keys.forEach((key) => this.pressKey(key));
  },
};
