package hellocucumber.manual;

import hellocucumber.helper;

public class ProductCreationTest {
    private static final helper helper = new helper("Selenium\\chromedriver-win32\\chromedriver.exe");

    public static void main(String[] args) {
        System.out.println("manual add product");
        try {
            helper.adminLogin();
            helper.addProduct("AirPods");
            helper.adminLogout();
            helper.closeDriver();
        } catch (InterruptedException e) {
            helper.closeDriver();
            throw new RuntimeException("Failed to add product", e);
        }
    }
} 