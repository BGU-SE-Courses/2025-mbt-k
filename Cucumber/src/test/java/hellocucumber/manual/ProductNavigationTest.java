package hellocucumber.manual;

import hellocucumber.helper;

public class ProductNavigationTest {
    private static final helper helper = new helper("Selenium\\chromedriver-win32\\chromedriver.exe");

    public static void main(String[] args) {
        System.out.println("manual navigate to product");
        try {
            // Login as admin first since product page requires admin access
            helper.adminLogin();
            Thread.sleep(1000);
            
            // Try to navigate to product page
            System.out.println("Attempting to navigate to product page...");
            helper.navigateToProductPage();
            Thread.sleep(2000); // Wait to see the result
            
            // Cleanup
            helper.adminLogout();
            helper.closeDriver();
            
            System.out.println("Navigation test completed successfully!");
        } catch (InterruptedException e) {
            System.out.println("Navigation to product page failed: " + e.getMessage());
            // Ensure driver is closed even if test fails
            helper.closeDriver();
            throw new RuntimeException("Failed to navigate to product page", e);
        }
    }
} 