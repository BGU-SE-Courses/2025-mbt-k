package hellocucumber.manual;

import hellocucumber.helper;

public class WishlistGetItemTest {
    private static final helper helper = new helper("Selenium\\chromedriver-win32\\chromedriver.exe");

    public static void main(String[] args) {
        try {
            helper.login("user@gmail.com", "user123");
            Thread.sleep(1000);
            
            // Try to get first item in wishlist
            System.out.println("Attempting to get first item in wishlist...");
            String firstItem = helper.getFirstInWishlist();
            
            // Print result
            if (firstItem != null) {
                System.out.println("First item in wishlist: " + firstItem);
            } else {
                System.out.println("No items found in wishlist");
            }
            
            // Cleanup
            helper.logout();
            helper.closeDriver();
        } catch (InterruptedException e) {
            helper.closeDriver();
            throw new RuntimeException("Failed to get first item in wishlist", e);
        }
    }
} 