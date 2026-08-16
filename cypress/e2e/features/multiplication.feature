@calculator @multiplication
Feature: Calculator multiplication

  Background:
    Given the calculator is loaded

  @TC04 @negative-operand
  Scenario: Multiplication with a negative operand
    # A bare leading "-" is not displayed as a negative sign on this app
    # (verified against the live site - see repo notes), so "0-4=" is used to
    # reliably produce a displayed "-4" before multiplying it by 3.
    When I enter "0-4=*3=" on the calculator
    Then the calculator display shows "-12"
