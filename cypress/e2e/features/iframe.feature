@calculator @iframe
Feature: Calculator iframe
  The full-screen calculator is embedded inside an iframe and must load
  correctly, and reload cleanly, before any interaction can take place.

  @TC01 @smoke
  Scenario: Calculator iframe loads successfully
    Given the calculator is loaded
    Then the calculator iframe is visible and ready
    And the calculator display shows "0"

  @TC27
  Scenario: Calculator reinitializes correctly after an iframe reload
    Given the calculator is loaded
    When I enter "5+5=" on the calculator
    Then the calculator display shows "10"
    When I reload the calculator page
    Then the calculator iframe is visible and ready
    And the calculator display shows "0"
