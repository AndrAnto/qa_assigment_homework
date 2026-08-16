@calculator @subtraction
Feature: Calculator subtraction

  Background:
    Given the calculator is loaded

  @TC03 @positive
  Scenario Outline: Subtraction with positive and negative results
    When I enter "<input>" on the calculator
    Then the calculator display shows "<result>"

    Examples:
      | input | result |
      | 5-3=  | 2      |
      | 3-5=  | -2     |

  @TC20 @negative-result
  Scenario: Subtraction producing a negative result is displayed correctly
    When I enter "5-10=" on the calculator
    Then the calculator display shows "-5"
