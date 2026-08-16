Feature: Session stability across multiple calculations
  The calculator must not require a page refresh between calculations, and
  each new calculation must be independent and correct.

  Scenario: TC15 - Multiple consecutive calculations remain correct
    Given the calculator is loaded
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
