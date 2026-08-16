@calculator @zero
Feature: Calculator operations with zero

  Background:
    Given the calculator is loaded

  @TC19
  Scenario Outline: Arithmetic operations where one operand is zero
    When I enter "<input>" on the calculator
    Then the calculator display shows "<result>"

    Examples:
      | input | result |
      | 15+0= | 15     |
      | 15*0= | 0      |
      | 0/5=  | 0      |
