@calculator @operators
Feature: Calculator operator handling

  Background:
    Given the calculator is loaded

  @TC08
  Scenario: Standard operator precedence (multiplication before addition)
    # Verified against the live app: 2 + 3 x 4 = 14 (3x4 is computed first),
    # NOT 20, which is what a purely sequential/left-to-right calculator
    # would produce. This matches standard mathematical order of operations
    # (PEMDAS) and is the documented, correct behaviour of this app - not a
    # defect, even though it may look surprising for a "simple" calculator.
    When I enter "2+3*4=" on the calculator
    Then the calculator display shows "14"

  @TC11 @negative
  Scenario: A second operator silently replaces a pending one
    # Documented behaviour: pressing "*" right after "+" (with no operand
    # typed in between) discards the pending "+" and the calculation
    # becomes 8 x 2, not 8 + (something) x 2.
    When I enter "8+*2=" on the calculator
    Then the calculator display shows "16"
    And the calculator is still usable
