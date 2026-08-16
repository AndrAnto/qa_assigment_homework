Feature: Keyboard support
  The calculator must be fully operable using the keyboard, including
  running full calculations and correcting mistakes.

  Background:
    Given the calculator is loaded

  Scenario: TC13 - Perform a calculation entirely from the keyboard
    When I type "12+3=" using the keyboard
    Then the calculator display shows "15"

  Scenario: TC13 - Backspace also works via the keyboard
    When I type "99" using the keyboard
    And I press Backspace
    Then the calculator display shows "9"
