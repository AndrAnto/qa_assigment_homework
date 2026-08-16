@calculator @state
Feature: Calculator calculation state transitions

  Background:
    Given the calculator is loaded

  @TC15 @smoke
  Scenario: Multiple consecutive calculations remain correct
    When I enter "2+2=" on the calculator
    Then the calculator display shows "4"
    When I press Clear
    And I enter "10-3=" on the calculator
    Then the calculator display shows "7"
    When I press Clear
    And I enter "6*5=" on the calculator
    Then the calculator display shows "30"
    When I press Clear
    And I enter "20/4=" on the calculator
    Then the calculator display shows "5"

  @TC24
  Scenario: Continue a calculation using the previous result
    When I enter "5+5=" on the calculator
    Then the calculator display shows "10"
    When I enter "*2=" on the calculator
    Then the calculator display shows "20"

  @TC25
  Scenario: Typing a new number after a completed calculation starts fresh
    When I enter "5+5=" on the calculator
    Then the calculator display shows "10"
    When I enter "7" on the calculator
    Then the calculator display shows "7"

  @TC26
  Scenario: Pressing Equals again repeats the last operation
    # Verified against the live app: pressing "=" a second time re-applies
    # the last operator and operand to the current result (7 + 2 = 9),
    # rather than leaving the display unchanged or ignoring the key.
    When I enter "5+2=" on the calculator
    Then the calculator display shows "7"
    When I enter "=" on the calculator
    Then the calculator display shows "9"
