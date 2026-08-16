Feature: Error handling and edge-case input
  The calculator must handle invalid, ambiguous or erroneous input
  gracefully and remain usable afterwards.

  Background:
    Given the calculator is loaded

  Scenario: TC06 - Division by zero shows an error and recovers
    When I enter "5/0=" on the calculator
    Then the calculator display shows "Error"
    And the calculator is still usable

  Scenario: TC11 - A second operator silently replaces a pending one
    # Documented behaviour: pressing "*" right after "+" (with no operand
    # typed in between) discards the pending "+" and the calculation
    # becomes 8 x 2, not 8 + (something) x 2.
    When I enter "8+*2=" on the calculator
    Then the calculator display shows "16"
    And the calculator is still usable

  Scenario Outline: TC12 - Unsupported keyboard characters are ignored
    When I enter "12" on the calculator
    And I enter "<char>" on the calculator
    Then the calculator display shows "12"
    And the calculator is still usable

    Examples:
      | char |
      | a    |
      | b    |
      | !    |
      | @    |

  Scenario: TC12b - "c" is a documented Clear keyboard shortcut, not corruption
    # Unlike the other letters above, lowercase "c" is intentionally wired to
    # the same Clear action as the Clear button/key (keyCode 67). This is
    # expected app behaviour, so it must not be treated as "invalid input".
    When I enter "12" on the calculator
    And I enter "c" on the calculator
    Then the calculator display shows "0"
