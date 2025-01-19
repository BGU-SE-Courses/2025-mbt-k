Feature: User adds product to wishlist.

  Scenario Outline: User adds product to wishlist
    Given product "<product_name>" exists
    And   user "<email>" logged in with password "<password>"
    When  the user adds product "<product_name>" to wishlist
    Then  product "<product_name>" is in the wishlist

    Examples:
      | email          | password | product_name |
      | user@gmail.com | user     | AirPods      |

