@calculator @backspace
Feature: Calculator Backspace

  Background:
    Given the calculator is loaded

  @TC10
  Scenario: Backspace removes only the last digit
    When I enter "123" on the calculator
    And I press Backspace
    Then the calculator display shows "12"
