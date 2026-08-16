@calculator @responsive
Feature: Calculator responsive layout

  The calculator and its iframe must remain visible and fully usable at
  both desktop and mobile viewport sizes.

  @TC14
  Scenario Outline: Calculator stays usable on <device> viewports
    Given the viewport is set to <width>x<height>
    And the calculator is loaded
    Then the calculator iframe is visible and ready
    When I enter "2+2=" on the calculator
    Then the calculator display shows "4"

    Examples:
      | width | height | device  |
      | 1280  | 800    | desktop |
      | 375   | 667    | mobile  |
