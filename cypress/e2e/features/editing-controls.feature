Feature: Editing controls
  Clear and Backspace must let the user correct input without starting a
  whole new calculation from scratch.

  Background:
    Given the calculator is loaded

  Scenario: TC09 - Clear resets an in-progress calculation
    When I enter "123+45" on the calculator
    And I press Clear
    Then the calculator display shows "0"

  Scenario: TC10 - Backspace removes only the last digit
    When I enter "123" on the calculator
    And I press Backspace
    Then the calculator display shows "12"
