package hellocucumber.manual;

import hellocucumber.helper;

public class UserRegistrationTest {
    private static final helper helper = new helper("Selenium\\chromedriver-win32\\chromedriver.exe");
    
    public static void main(String[] args) {
        try {
            helper.before(); //register user
            helper.closeDriver();
        } catch (InterruptedException e) {
            helper.closeDriver();
            throw new RuntimeException("Failed to register user", e);
        }
    }
} 