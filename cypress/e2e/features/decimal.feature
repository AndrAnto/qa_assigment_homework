@calculator @decimal
Feature: Calculator decimal numbers and precision

  Background:
    Given the calculator is loaded

  @TC07 @positive
  Scenario: Decimal addition
    When I enter "1.5+2.25=" on the calculator
    Then the calculator display shows "3.75"

  @TC17 @negative
  Scenario: A second decimal separator in the same number is ignored
    # Verified against the live app: the extra "." is simply dropped and
    # entry continues normally - "12.3.4" ends up as "12.34", not corrupted.
    When I enter "12.3.4" on the calculator
    Then the calculator display shows "12.34"
    And the calculator is still usable

  @TC18
  Scenario: A decimal number without a leading zero is supported
    When I enter ".5+.5=" on the calculator
    Then the calculator display shows "1"

  @TC23 @precision
  Scenario: Floating-point addition does not leak implementation artifacts
    # Verified against the live app: displays the clean "0.3", never
    # "0.30000000000000004".
    When I enter "0.1+0.2=" on the calculator
    Then the calculator display shows "0.3"
