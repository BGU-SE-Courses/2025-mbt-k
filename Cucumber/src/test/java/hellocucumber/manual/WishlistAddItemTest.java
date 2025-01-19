package hellocucumber.manual;

import hellocucumber.helper;

public class WishlistAddItemTest {
    private static final helper helper = new helper("Selenium\\chromedriver-win32\\chromedriver.exe");

    public static void main(String[] args) {
        System.out.println("manual add to wishlist");
        try {
            // Login as user first since wishlist requires user access
            System.out.println("Logging in as user...");
            helper.login("user@gmail.com", "user123");
            Thread.sleep(1000);
            
            // Try to add product to wishlist
            String productToAdd = "iMac";
            System.out.println("Attempting to add product '" + productToAdd + "' to wishlist...");
            helper.addToWishListFromHomepage(productToAdd);
            
            // Verify the product was added
            String firstItem = helper.getFirstInWishlist();
            if (firstItem != null && firstItem.equals(productToAdd)) {
                System.out.println("Product successfully added to wishlist!");
            } else {
                System.out.println("Failed to verify product in wishlist. Found: " + firstItem);
            }
            
            // Cleanup
            helper.logout();
            helper.closeDriver();
            
            System.out.println("Add to wishlist test completed!");
        } catch (InterruptedException e) {
            System.out.println("Add to wishlist failed: " + e.getMessage());
            // Ensure driver is closed even if test fails
            helper.closeDriver();
        }
    }
} 