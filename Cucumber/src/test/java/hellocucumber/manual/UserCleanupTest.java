package hellocucumber.manual;

import hellocucumber.helper;

public class UserCleanupTest {
    private static final helper helper = new helper("Selenium\\chromedriver-win32\\chromedriver.exe");

    public static void main(String[] args) {
        try {
            helper.teardown();
            helper.closeDriver();
        } catch (InterruptedException e) {
            helper.closeDriver();
            throw new RuntimeException("Failed to clean up", e);
        }
    }
} 