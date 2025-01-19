package hellocucumber;
import org.openqa.selenium.*;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class helper {
    private WebDriver driver;

    private JavascriptExecutor jse;
    private WebDriverWait wait;

    private final String user1_firstName = "User";
    private final String user1_lastName = "user";
    private final String user1_email = "user@gmail.com";
    private final String user1_password = "user123";
    private final String product1_name = "AirPods";
    private final String product1_tag = "AirPods";
    private final String product1_model = "headphones";
    private final String product1_SEO = "AirPods";
    private final String admin_username = "admin";
    private final String admin_password = "admin";

    public helper() {
        try {
            String projectPath = System.getProperty("user.dir");
            String driverPath = projectPath + "\\..\\Selenium\\chromedriver-win32\\chromedriver.exe";
            System.setProperty("webdriver.chrome.driver", driverPath);

            ChromeOptions options = new ChromeOptions();
            options.addArguments("start-maximized");
            options.addArguments("--verbose");
            options.addArguments("--log-level=3"); // Enable verbose logging
            options.addArguments("--remote-allow-origins=*"); // Allow remote connections
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");
            
            System.out.println("Initializing ChromeDriver...");
            // Create an instance of ChromeDriver and WebDriverWait
            driver = new ChromeDriver(options);
            wait = new WebDriverWait(driver, Duration.ofSeconds(30));
        } catch (Exception e) {
            throw new RuntimeException("ChromeDriver initialization failed", e);
        }
    }

    public helper(String driverPath) {
        try {
            System.setProperty("webdriver.chrome.driver", driverPath);

            ChromeOptions options = new ChromeOptions();
            options.addArguments("start-maximized");
            options.addArguments("--verbose");
            options.addArguments("--log-level=3"); // Enable verbose logging
            options.addArguments("--remote-allow-origins=*"); // Allow remote connections
            options.addArguments("--no-sandbox");
            options.addArguments("--disable-dev-shm-usage");

            driver = new ChromeDriver(options);
            wait = new WebDriverWait(driver, Duration.ofSeconds(30));
        } catch (Exception e) {
            throw new RuntimeException("ChromeDriver initialization failed", e);
        }
    }

    public void navigateToRegisterPage(){
        driver.get("http://localhost/opencart/upload/index.php?route=account/register&language=en-gb");
    }

    public void registerUser(String firstName, String lastName, String email, String password){
        //navigates to register page
        navigateToRegisterPage();
        //insert first name
        WebElement firstNameElement = driver.findElement(By.xpath("//*[@id='input-firstname']"));
        firstNameElement.sendKeys(firstName);

        //insert last name
        WebElement lastNameElement = driver.findElement(By.xpath("//*[@id='input-lastname']"));
        lastNameElement.sendKeys(lastName);

        //insert email
        WebElement emailElement = driver.findElement(By.xpath("//*[@id='input-email']"));
        emailElement.sendKeys(email);

        //insert password
        WebElement passwordElement = driver.findElement(By.xpath("//*[@id='input-password']"));
        passwordElement.sendKeys(password);

        //mark the agree to terms checkbox
        WebElement agreeCheckbox = driver.findElement(By.xpath("//*[@name='agree']"));
        agreeCheckbox.click();

        WebElement continueButton = driver.findElement(By.xpath("//*[@type='submit']"));
        continueButton.click();
    }

    public void navigateToProductPage() {
        try{
            Thread.sleep(1000);
        } catch (Exception e) {
            // Ignore sleep interruption
        }
        //open sidebar
        driver.findElement(By.xpath("/html/body/div[1]/nav/ul/li[2]/a")).click();
        //get the catalog button
        WebElement productCatalogButton = driver.findElement(By.xpath("/html/body/div[1]/nav/ul/li[2]/ul/li[2]/a"));

        //waits for the product catalog button to be clickable and then clicks it
        wait.until(webDriver -> productCatalogButton.isEnabled());
        productCatalogButton.click();
    }

    //returns a string with the name of the first item in the wishlist
    public String getFirstInWishlist() {
        //navigate to wishlist
        navigateToWishList();
        try {
            // Wait for the product list to load
            Thread.sleep(500);
            
            // Wait for the first product link and get its text
            WebElement firstProduct = wait.until(webDriver -> webDriver
                    .findElement(By.xpath("/html/body/main/div[2]/div/div/div[1]/div/table/tbody/tr/td[2]")));
            return firstProduct.getText();
        } catch (Exception e) {
            System.err.println("Failed to get first product from wishlist: " + e.getMessage());
            //if no products in wishlist
            return null;
        }
    }

    public void navigateToWishList() {
        try {
            navigateToHomePage();
            Thread.sleep(4000);
            WebElement wishlistLink = wait.until(webDriver -> webDriver.findElement(By.xpath("/html/body/nav/div/div[2]/ul/li[3]/a/span")));
            wishlistLink.click();
            Thread.sleep(4000);
        } catch (Exception e) {
            throw new RuntimeException("Failed to navigate to wishlist", e);
        }
    }

    public void addProduct(String name, String tag, String model, String SEO) throws InterruptedException {
        System.out.println("navigating to product page");
        navigateToProductPage();
        Thread.sleep(1000); 
        System.out.println("inserting info in product fields");
        driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[1]/div/div/a")).click();

        driver.findElement(By.xpath("//*[@id=\"input-name-1\"]")).sendKeys(name);

        driver.findElement(By.xpath("//*[@id='input-meta-title-1']")).sendKeys(tag);

        driver.findElement(By.xpath("//form[1]/ul[1]/li[2]/a[1]")).click();

        Thread.sleep(1000);

        driver.findElement(By.xpath("//*[@id='input-model']")).sendKeys(model);

        driver.findElement(By.xpath("//form[1]/ul[1]/li[11]/a[1]")).click();

        Thread.sleep(1000); 
        driver.findElement(By.xpath("//*[@id='input-keyword-0-1']")).sendKeys(SEO);

        //save product
        driver.findElement(By.xpath("//div[2]/div[1]/div[1]/div[1]/button[1]")).click();

        
        //close notification
        Thread.sleep(1000);
        driver.findElement(By.className("btn-close")).click();

        System.out.println("product added successfully");
    }

    public void addProduct(String name) throws InterruptedException {
        addProduct(name, product1_tag, product1_model, product1_SEO);
    }

    public void removeProduct(String name) throws InterruptedException {
        //navigate to product page
        navigateToProductPage();
        
        //search product by filter
        driver.findElement(By.xpath("//*[@id='input-name']")).sendKeys(name);
    
        //waiting for product to load
        Thread.sleep(500);
        //filtering search
        driver.findElement(By.xpath("//*[@id=\"button-filter\"]")).click();
        
        Thread.sleep(500);
        //selecting product
        driver.findElement(By.xpath("//html/body/div[1]/div[2]/div[2]/div/div[2]/div/div[2]/form/div[1]/table/thead/tr/td[1]/input")).click();

        //delete product
        driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[1]/div/div/button[3]/i")).click();

        driver.switchTo().alert().accept();

        //close notification
        Thread.sleep(1000);
        driver.findElement(By.className("btn-close")).click();
        System.out.println("Product deleted successfully!");

    }

    //adds item with name to wishlist
    public void addToWishListFromHomepage(String productName) throws InterruptedException {
        navigateToHomePage();
        System.out.println("navigated to homepage successfully");
        // Wait for search input to be visible and enter product name
        WebElement searchInput = wait.until(
                webDriver -> webDriver.findElement(By.xpath("//header[1]/div[1]/div[1]/div[2]/div[1]/input[1]")));
        System.out.println("I got this line : 241");
        searchInput.clear();
        searchInput.sendKeys(productName);
        
        // Wait for search button and click it
        WebElement searchButton = wait.until(webDriver -> webDriver.findElement(By.xpath("//header[1]/div[1]/div[1]/div[2]/div[1]/button[1]/i[1]")));
        searchButton.click();
        System.out.println("I got this line : 250");
        // Wait for search results to load
        Thread.sleep(2000);

        // Scroll to the bottom of the page
        jse = (JavascriptExecutor)driver;
        jse.executeScript("window.scrollTo(0,document.body.scrollHeight);");
        Thread.sleep(1000);

        try {
            // Wait for wishlist button and click it
            WebElement wishlistButton = wait.until(webDriver -> webDriver.findElement(By.xpath("//*[@id='product-list']/div/div/div/form/div/button[2]")));
            wishlistButton.click();
            
            // Wait for success message or confirmation
            Thread.sleep(1000);
            Thread.sleep(4000);

            // Verify the product was added to wishlist
            String firstProduct = getFirstInWishlist();
            if (firstProduct == null || !firstProduct.equals(productName)) {
                throw new RuntimeException("Failed to add product to wishlist");
            }
        } catch (Exception e) {
            System.err.println(e.getMessage());
            throw e;
        }
    }

    public void adminLogin() throws InterruptedException {
        driver.get("http://localhost/opencart/upload/admin");
        //enter username
        WebElement usernameField = driver.findElement(By.xpath("//*[@id='input-username']"));
        usernameField.sendKeys(admin_username);
        //enter password
        WebElement passwordField = driver.findElement(By.xpath("//*[@id='input-password']"));
        passwordField.sendKeys(admin_password);
        passwordField.sendKeys(Keys.ENTER);
        //press close dialog button
        Thread.sleep(1000);
        WebElement closeButton = driver.findElement(By.className("btn-close"));
        closeButton.click();
    }

    public void adminLogout(){
        WebElement logoutButton = driver.findElement(By.xpath("/html/body/div[1]/header/div/ul/li[4]/a"));
        logoutButton.click();
    }

    public void before() throws InterruptedException {
        registerUser(user1_firstName, user1_lastName, user1_email, user1_password);
        Thread.sleep(5000);
        logout();
    }

    public void teardown() throws InterruptedException {

        adminLogin();
        Thread.sleep(5000);
        try {
            //delete user
            deleteUser(user1_email);
        } catch (Exception e) {
            System.out.println("User not found");
        }

        try {
            //delete product if exists
            removeProduct(product1_name);
        } catch (Exception e) {
            System.out.println("Product not found");
        }
        adminLogout();
    }

    public void closeDriver() {
        try {
            if (driver != null) {
                // Close all windows first
                for (String handle : driver.getWindowHandles()) {
                    driver.switchTo().window(handle);
                    driver.close();
                }
                // Then quit the driver
                driver.quit();
                // Set driver to null to prevent reuse
                driver = null;
            }
        } catch (Exception e) {
            System.err.println("Warning: Exception during driver cleanup: " + e.getMessage());
        }
    }

    public void scrollDown() throws InterruptedException {
        // Scroll to the bottom of the page
        jse = (JavascriptExecutor) driver;
        jse.executeScript("window.scrollTo(0,document.body.scrollHeight);");
        Thread.sleep(1000);
    }
    
    public void scrollUp() throws InterruptedException {
        // Scroll to the top of the page
        jse = (JavascriptExecutor) driver;
        jse.executeScript("window.scrollTo(0,0);");
        Thread.sleep(1000);
    }

    public void deleteUser(String email) throws InterruptedException {
        //nav to user list
        driver.findElement(By.xpath("//div[3]/div[1]/div[3]/a[1]")).click();
        //search for user
        driver.findElement(By.xpath("//*[@id='input-email']")).sendKeys(email);

        scrollDown();

        driver.findElement(By.xpath("//*[@id=\"button-filter\"]")).click();

         // Scroll to the top of the page
         scrollUp();

        //select user
        driver.findElement(By
                .xpath("/html/body/div[1]/div[2]/div[2]/div/div[2]/div/div[2]/form/div[1]/table/tbody/tr/td[1]/input"))
                .click();

                //delete user
                driver.findElement(By.xpath("/html/body/div[1]/div[2]/div[1]/div/div/button[2]")).click();

        driver.switchTo().alert().accept();
        Thread.sleep(5000);

        //close notification
        Thread.sleep(1000);
        driver.findElement(By.className("btn-close")).click();

        System.out.println("User deleted successfully!");
    }

    public void navigateToHomePage() {
        // Navigate to the OpenCart website
        driver.get("http://localhost/opencart/upload/");

    }

    public void navigateToLoginPage() {
        // Navigate to the OpenCart website
        driver.get("http://localhost/opencart/upload/index.php?route=account/login&language=en-gb");
    }

    public void login(String email, String password) {
        try {
            navigateToLoginPage();
            
            // Wait for email input and enter email
            WebElement emailInput = wait.until(webDriver -> webDriver.findElement(By.xpath("//*[@id='input-email']")));
            emailInput.clear();
            emailInput.sendKeys(email);

            // Wait for password input and enter password
            WebElement passwordInput = wait.until(webDriver -> webDriver.findElement(By.xpath("//*[@id='input-password']")));
            passwordInput.clear();
            passwordInput.sendKeys(password);

            // Wait for login button and click it
            WebElement loginButton = wait.until(webDriver -> webDriver.findElement(By.xpath("//div[3]/button[1]")));
            loginButton.click();
        } catch (Exception e) {
            System.err.println("Failed to log in: " + e.getMessage());
            throw new RuntimeException("Failed to log in", e);
        }

    }

    public void logout(){

        //click on account button
        driver.findElement(By.xpath("//div[1]/div[2]/ul[1]/li[2]/div[1]/a[1]")).click();

        //press logout button
        driver.findElement(By.xpath("//li[2]/div[1]/ul[1]/li[5]/a[1]")).click();
    }

    public boolean productIsDeleted(String product_name) {
        navigateToProductPage();

        //search the product
        driver.findElement(By.xpath("//*[@id='input-name']")).sendKeys(product_name);
        driver.findElement(By.xpath("//div[1]/div[1]/div[1]/div[2]/div[6]/button[1]")).click();

        //get the no results message
        try{
            Thread.sleep(1000);
            //if doesnt crash always returns true - because it will work only if the element is found
            return driver.findElement(By.xpath("//form[1]/div[2]/div[2]")).getText().equals("Showing 0 to 0 of 0 (0 Pages)");
        }catch (Exception e){
            return false;
        }
    }
}
