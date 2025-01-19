package hellocucumber;

import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.*;

import org.junit.jupiter.api.Assertions;

public class StepDefinitions {
private final helper helper = new helper();

    public StepDefinitions() {
    }

    /**
     * the setup before the test, registers a user
     */
    @Before
    public void before(){
        System.out.println("setup");
        try {
            helper.before();
        }catch (Exception e){
            System.out.println("setup failed");
        }
    }

    /**
     * the teardown after the test, deletes the user and the product if needed.
     */
    @After
    public void teardown() {

        System.out.println("teardown");
        try{
            Thread.sleep(1000);
            helper.teardown();
        } catch (InterruptedException ignore) {
            System.out.println("teardown failed");
        }
    }


    /**
     * This function creates a product for the test.
     * @param product_name the name of the product that will be created
     */
    @Given("product {string} exists")
    public void productExists(String product_name) {
        System.out.println("create product for case");
        try {
            helper.adminLogin();//done
            helper.addProduct(product_name);
            helper.adminLogout();
            Thread.sleep(1000); // Wait for logout to complete
        } catch (Exception e) {
            System.err.println("Failed to create product: " + e.getMessage());
            throw new RuntimeException("Failed to create product", e);
        }
    }

    /**
     * This function logs in as a user with the given email and password
     * @param email     the email of the user
     * @param password  the password of the user
     */
    @And("user {string} logged in with password {string}")
    public void userLoggedInWithPassword(String email, String password) {
        System.out.println("login user");
        try {
            helper.login(email, password);
            Thread.sleep(1000); // Wait for login to complete
        } catch (Exception e) {
            System.err.println("Failed to log in user: " + e.getMessage());
            throw new RuntimeException("Failed to log in user", e);
        }
    }

    /**
     * This function adds the product to the users' wishlist
     * @param product_name the name of the product that will be added to the wishlist
     */
    @When("the user adds product {string} to wishlist")
    public void userAddsProductToWishlist(String product_name){
        System.out.println("add product to wishlist");
        try {
            helper.login("user@gmail.com", "user123");
            Assertions.assertDoesNotThrow(() -> helper.addToWishListFromHomepage(product_name));

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * This function checks that the product is in the wishlist
     * @param product_name the product name that we want to check if it is in the wishlist
     */
    @Then("product {string} is in the wishlist")
    public void productIsInUserWishlist(String product_name){
        System.out.println("check product in wishlist");
        Assertions.assertEquals(product_name, helper.getFirstInWishlist());
    }

    /**
     * this function deletes a product as a logged in admin
     * @param product_name - the product we want to delete
     */
    @When("the admin deletes product {string}")
    public void theAdminDeletesProduct(String product_name) {
        try {
            helper.adminLogin();
            Assertions.assertDoesNotThrow(() -> helper.removeProduct(product_name));
        } catch (InterruptedException e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * this function asserts that the product is deleted
     * @param product_name - the name of the product we want to check that is deleted
     */
    @Then("product {string} is deleted")
    public void productIsDeleted(String product_name) {
        Assertions.assertTrue(helper.productIsDeleted(product_name));
    }

    /**
     * this function checks that the user has an empty wishlist
     */
    @And("user has empty wishlist")
    public void productIsNotInTheWishlist() {
        System.out.println("check product in wishlist");
        Assertions.assertNull(helper.getFirstInWishlist());
    }

    /**
     * the function logs in as an admin user in order to delete the product given as a param.
     * @param product_name - the name of the product we want deleted
     */
    @And("the admin logs in and deletes product {string}")
    public void theAdminLogsInAndDeletesProduct(String product_name) {
        Assertions.assertDoesNotThrow(helper::adminLogin);
        Assertions.assertDoesNotThrow(() -> helper.removeProduct(product_name));
    }

}
