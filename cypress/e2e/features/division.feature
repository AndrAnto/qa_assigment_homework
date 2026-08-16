@calculator @division
Feature: Calculator division

  Background:
    Given the calculator is loaded

  @TC05 @smoke @positive
  Scenario: Division of two whole numbers
    When I enter "20/4=" on the calculator
    Then the calculator display shows "5"

  @TC06 @negative
  Scenario: Division by zero shows an error and recovers
    When I enter "5/0=" on the calculator
    Then the calculator display shows "Error"
    And the calculator is still usable

  @TC30 @recovery
  Scenario: Recover from a division-by-zero error using Clear
    When I enter "5/0=" on the calculator
    Then the calculator display shows "Error"
    When I press Clear
    And I enter "2+3=" on the calculator
    Then the calculator display shows "5"
