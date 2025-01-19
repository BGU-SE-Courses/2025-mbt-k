Feature: Admin deletes the product from the store.

  Scenario Outline: Admin deletes the product from the store
    Given product "<product_name>" exists
    When  the admin deletes product "<product_name>"
    Then  product "<product_name>" is deleted

    Examples:
      | product_name |
      | AirPods      |
