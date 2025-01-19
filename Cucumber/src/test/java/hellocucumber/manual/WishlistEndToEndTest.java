package hellocucumber.manual;

import hellocucumber.helper;

public class WishlistEndToEndTest {
    private static final helper helper = new helper("Selenium\\chromedriver-win32\\chromedriver.exe");

    public static void main(String[] args) {
        try {
            helper.adminLogin();
            helper.addProduct("AirPods");
            helper.adminLogout();
            Thread.sleep(1000);
            
            helper.login("user@gmail.com", "user123");
            System.out.println("logged in successfully");
            helper.addToWishListFromHomepage("AirPods");
            
            // Try to get first item in wishlist
            System.out.println("Attempting to get first item in wishlist...");
            String firstItem = helper.getFirstInWishlist();
            
            // Print result
            if (firstItem != null && firstItem.equals("AirPods")) {
                System.out.println("Success! Found expected product: " + firstItem);
            } else {
                System.out.println("Test failed. Expected 'AirPods' but found: " + firstItem);
            }
            
            // Cleanup
            helper.logout();
            
            helper.adminLogin();
            helper.removeProduct("AirPods");
            helper.adminLogout();
            helper.closeDriver();
            
            System.out.println("Get first in wishlist test completed!");
        } catch (Exception e) {
            System.out.println("Test failed: " + e.getMessage());
            // Ensure driver is closed even if test fails
            helper.closeDriver();
            throw new RuntimeException("Test failed", e);
        }
    }
} 