@calculator @clear
Feature: Calculator Clear (C) button

  Background:
    Given the calculator is loaded

  @TC09 @smoke
  Scenario: Clear resets an in-progress calculation
    When I enter "123+45" on the calculator
    And I press Clear
    Then the calculator display shows "0"
