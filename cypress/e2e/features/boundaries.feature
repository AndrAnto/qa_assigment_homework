@calculator @boundary
Feature: Calculator input boundary values

  Background:
    Given the calculator is loaded

  @TC16
  Scenario: Leading zeros are handled correctly
    When I enter "00012+3=" on the calculator
    Then the calculator display shows "15"

  @TC21 @smoke
  Scenario: Maximum supported input length is 9 digits
    # Verified against the live app: the display supports up to 9
    # significant digits, grouped in threes (e.g. "123 456 789").
    When I enter "999999999" on the calculator
    Then the calculator display shows "999 999 999"

  @TC22 @negative
  Scenario: Input beyond the maximum length is rejected, not corrupted
    # The live app silently rejects the 10th digit and stays at the 9-digit
    # cap - it does not crash, truncate unpredictably, or wrap around.
    When I enter "9999999999" on the calculator
    Then the calculator display shows "999 999 999"
    And the calculator is still usable

  @TC22 @negative
  Scenario: Backspace still shrinks the number when at the maximum length
    When I enter "999999999" on the calculator
    And I press Backspace
    Then the calculator display shows "99 999 999"
