package hellocucumber.manual;

import hellocucumber.helper;

public class ProductDeletionTest {
    private static final helper helper = new helper("Selenium\\chromedriver-win32\\chromedriver.exe");

    public static void main(String[] args) {
        System.out.println("manual remove product");
        try {
            // Login as admin first since product removal requires admin access
            helper.adminLogin();            
            // Try to remove the product
            System.out.println("Attempting to remove product...");
            helper.removeProduct("AirPods"); // Using the same product name that was added
            Thread.sleep(2000); // Wait to see the result
            
            // Cleanup
            helper.adminLogout();
            helper.closeDriver();
            
        } catch (InterruptedException e) {
            System.out.println("Product removal failed: " + e.getMessage());
            // Ensure driver is closed even if test fails
            helper.closeDriver();
            throw new RuntimeException("Failed to remove product", e);
        }
    }
} 