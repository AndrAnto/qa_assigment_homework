Feature: Calculator iframe loading
  The full-screen calculator is embedded inside an iframe and must load
  correctly before any interaction with it can take place.

  Scenario: TC01 - Calculator iframe loads successfully
    Given the calculator is loaded
    Then the calculator iframe is visible and ready
    And the calculator display shows "0"
