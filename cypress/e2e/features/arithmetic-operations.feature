Feature: Arithmetic operations
  As a user
  I want the calculator to correctly compute the four basic operations,
  decimal values and standard operator precedence
  So that I can trust its results.

  Background:
    Given the calculator is loaded

  Scenario: TC02 - Addition of two positive numbers
    When I enter "12+8=" on the calculator
    Then the calculator display shows "20"

  Scenario Outline: TC03 - Subtraction with positive and negative results
    When I enter "<input>" on the calculator
    Then the calculator display shows "<result>"

    Examples:
      | input | result |
      | 5-3=  | 2      |
      | 3-5=  | -2     |

  Scenario: TC04 - Multiplication with a negative operand
    # A bare leading "-" is not displayed as a negative sign on this app
    # (verified against the live site - see repo notes), so "0-4=" is used to
    # reliably produce a displayed "-4" before multiplying it by 3.
    When I enter "0-4=*3=" on the calculator
    Then the calculator display shows "-12"

  Scenario: TC05 - Division of two whole numbers
    When I enter "20/4=" on the calculator
    Then the calculator display shows "5"

  Scenario: TC07 - Decimal addition
    When I enter "1.5+2.25=" on the calculator
    Then the calculator display shows "3.75"

  Scenario: TC08 - Standard operator precedence (multiplication before addition)
    # Verified against the live app: 2 + 3 x 4 = 14 (3x4 is computed first),
    # NOT 20, which is what a purely sequential/left-to-right calculator
    # would produce. This matches standard mathematical order of operations
    # (PEMDAS) and is the documented, correct behaviour of this app - not a
    # defect, even though it may look surprising for a "simple" calculator.
    When I enter "2+3*4=" on the calculator
    Then the calculator display shows "14"
