@calculator @addition
Feature: Calculator addition

  Background:
    Given the calculator is loaded

  @TC02 @smoke @positive
  Scenario: Addition of two positive numbers
    When I enter "12+8=" on the calculator
    Then the calculator display shows "20"
