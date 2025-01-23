// Define an event filter for start events in a session
/**
 * Creates an event set to filter "start" events within a specific session.
 * @param {string} s - The name of the session.
 * @returns {EventSet} - A filter for events with `startEvent` set to true and matching the session name.
 */
const AnyStartInSession = function (s) {
  return bp.EventSet("AnyStartInSession-" + s, function (e) {
    return e.data !== null && e.data.hasOwnProperty('startEvent') && e.data.startEvent && String(s).equals(e.data.session.name);
  });
}

/**
 * Defines an action on a Selenium session with proper synchronization and lifecycle management.
 * @param {string} name - The name of the action.
 * @param {Function} func - The function that implements the action logic.
 */
defineAction = function (name, func) {
  SeleniumSession.prototype[name] = function (data) {
    let session = this;
    // Emit a start event for the action
    sync({ request: bp.Event(`Start(${name})`, { session: session, startEvent: true, parameters: data }) });
    // Block until the appropriate start event is processed
    block(AnyStartInSession(this.name), function () {
      func(session, data);
      // Emit an end event for the action
      sync({ request: bp.Event(`End(${name})`, { session: session, endEvent: true, parameters: data }) });
    });
  }
}

// Define actions
/**
 * Registers a new user by filling in the registration form and submitting it.
 * @param {SeleniumSession} session - The Selenium session object.
 */
defineAction('registerUser', function (session) {
  session.writeText(xpaths.registerWindow.firstNameInput, userFirstName);
  session.writeText(xpaths.registerWindow.lastNameInput, userLastName);
  session.writeText(xpaths.registerWindow.emailInput, userEmail);
  session.writeText(xpaths.registerWindow.passwordInput, userPassword);
  session.click(xpaths.registerWindow.agreeCheckbox);
  session.click(xpaths.registerWindow.continueButton);
});

/**
 * Logs in as an admin by entering credentials and handling post-login notifications.
 * @param {SeleniumSession} session - The Selenium session object.
 */
defineAction('adminLogin', function (session) {
  with (session) {
    session.writeText(xpaths.adminLoginWindow.usernameInput, adminUsername);
    session.writeText(xpaths.adminLoginWindow.passwordInput, adminPassword);
    session.waitForClickability(xpaths.adminLoginWindow.loginButton);
    session.click(xpaths.adminLoginWindow.loginButton);
    session.waitForVisibility(xpaths.notification.closeNotificationButton);
    session.click(xpaths.notification.closeNotificationButton);
  }
});

/**
 * Navigates to the products page from the admin catalog.
 * @param {SeleniumSession} session - The Selenium session object.
 */
defineAction('adminGoToProductsPage', function (session) {
  with (session) {
    click(xpaths.adminMainWindow.catalogButton);
    click(xpaths.adminMainWindow.productsButton);
  }
});

/**
 * Adds a new product through the admin interface.
 * @param {SeleniumSession} session - The Selenium session object.
 */
defineAction('adminAddProduct', function (session) {
  with (session) {
    click(xpaths.adminProductListWindow.addProductButton);
    writeText(xpaths.addProductWindow.productNameInput, productName);
    writeText(xpaths.addProductWindow.tagInput, productTag);
    click(xpaths.addProductWindow.dataTab);
    writeText(xpaths.addProductWindow.modelInput, productModel);
    click(xpaths.addProductWindow.seoTab);
    writeText(xpaths.addProductWindow.seoInput, productSEO);
    click(xpaths.addProductWindow.saveButton);
  }
});

/**
 * Deletes a product from the admin product list.
 * @param {SeleniumSession} session - The Selenium session object.
 */
defineAction('adminDeleteProduct', function (session) {
  with (session) {
    writeText(xpaths.adminProductListWindow.productNameInput, productName);
    click(xpaths.adminProductListWindow.filterButton);
    waitForClickability(xpaths.adminProductListWindow.selectAllProductsButton);
    click(xpaths.adminProductListWindow.selectAllProductsButton);
    waitForClickability(xpaths.adminProductListWindow.deleteProductButton);
    // Synchronize on custom "about to delete" event
    sync({ request: bp.Event('aboutToDeleteProduct', { session: session }) });
    click(xpaths.adminProductListWindow.deleteProductButton);
    acceptAlert();
  }        
});

/**
 * Logs out the admin user from the admin interface.
 * @param {SeleniumSession} session - The Selenium session object.
 */
defineAction('adminLogout', function (session) {
  with (session) {
    click(xpaths.adminMainWindow.logoutButton);
  }
});

/**
 * Logs in as a regular user by entering credentials.
 * @param {SeleniumSession} session - The Selenium session object.
 */
defineAction('userLogin', function (session) {
  with (session) {
    writeText(xpaths.loginWindow.emailInput, userEmail);
    writeText(xpaths.loginWindow.passwordInput, userPassword);
    click(xpaths.loginWindow.loginButton);
  }
});

/**
 * Searches for a product as a regular user.
 * @param {SeleniumSession} session - The Selenium session object.
 */
defineAction('userSearchProduct', function (session) {
  with (session) {
    waitForClickability(xpaths.userMainWindow.searchInput);
    waitForClickability(xpaths.userMainWindow.searchButton);
    writeText(xpaths.userMainWindow.searchInput, productName);
    click(xpaths.userMainWindow.searchButton);
  }
});

/**
 * Adds a product to the user's wishlist by interacting with the wishlist button.
 * @param {SeleniumSession} session - The Selenium session object.
 */
defineAction('userAddProductToWishlist', function (session) {
  with (session) {
    moveToElement(xpaths.userMainWindow.heartButton);
    waitForClickability(xpaths.userMainWindow.heartButton);
    click(xpaths.userMainWindow.heartButton);
  }
});
