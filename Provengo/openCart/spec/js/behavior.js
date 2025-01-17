/* @provengo summon selenium */
/* @provengo summon ctrl */
/* @provengo summon constraints */

// Initial setup b-thread
/**
 * Sets up the admin session to log in, navigate to the products page, and add a new product.
 * This prepares the environment for subsequent b-threads.
 */
bthread('setup', function() {
  let s = new SeleniumSession('setup_admin');
  s.start(OpenCartAdminURL);
  s.adminLogin();
  s.adminGoToProductsPage();
  s.adminAddProduct();
  request(Event('setup_end'));
});

// User adding an item to the wishlist
/**
 * Handles the user workflow of logging in, searching for a product, and adding it to the wishlist.
 * This b-thread starts after the setup process completes.
 */
bthread('Add item to wishlist', function () {
  waitFor(Event('setup_end'));
  let sn = new SeleniumSession('user');
  sn.start(loginURL);
  sn.userLogin();
  sn.userSearchProduct();
  sn.userAddProductToWishlist();
});

// Admin deleting a product
/**
 * Simulates the admin workflow of logging in, navigating to the products page, and deleting a product.
 * This b-thread starts after the setup process completes.
 */
bthread('Admin deletes an item', function () {
  waitFor(Event('setup_end'));
  let sa = new SeleniumSession('admin');
  sa.start(OpenCartAdminURL);
  sa.adminLogin();
  sa.adminGoToProductsPage();
  sa.adminDeleteProduct();
});

// Blocking user from adding to wishlist after product deletion
/**
 * Ensures that users cannot add an item to their wishlist after it has been deleted by the admin.
 * Waits for the admin's product deletion event and then blocks the user action.
 */
bthread('Block adding to wishlist after removing the item', function () {
  waitFor(Event('setup_end'));
  sync({waitFor: any('aboutToDeleteProduct')});
  sync({block: any('userAddProductToWishlist')});
});

// Two-way event tracking and logging
/**
 * Monitors interactions between admin and user sessions, tracks session actions,
 * and logs events to establish a relationship between them.
 */
bthread('interaction tracker', function() {
  waitFor(Event('initialization_complete'));

  let eventLogs = []; // Array to record event logs
  const allEvents = EventSet("", evt => true); // Event set capturing all events
  let currentEvent = sync({ waitFor: allEvents });
  let previousEvent = currentEvent; // Stores the previous event for comparison

  let adminActions = 0; // Counter for admin actions
  let userActions = 0; // Counter for user actions

  // Identify the type of session that generated the first event
  if (currentEvent.session ? currentEvent.session : currentEvent.data.session.name === 'admin') {
    adminActions++;
  } else {
    userActions++;
  }

  // Define a maximum iteration count to avoid infinite loops
  const maxLoops = 100;
  let loopCounter = 0;

  let adminDeleteConfirmed = false; // Flag to confirm admin product deletion
  let userSearchCompleted = false; // Flag to confirm user product search completion

  // Loop to track events until both flags are true or the loop limit is reached
  while ((!adminDeleteConfirmed || !userSearchCompleted) && loopCounter < maxLoops) {
    loopCounter++;
    currentEvent = sync({waitFor: allEvents});

    // Set flags based on specific event names
    if (currentEvent.name === 'End(adminDeleteProduct)') {
      adminDeleteConfirmed = true;
    }

    if (currentEvent.name === 'End(userSearchProduct)') {
      userSearchCompleted = true;
    }

    // Determine the session type and update respective counters
    let currentSession = currentEvent.session ? currentEvent.session : currentEvent.data.session.name;
    let previousSession = previousEvent.session ? previousEvent.session : previousEvent.data.session.name;

    if (currentSession === 'admin') {
      adminActions++;
    } else {
      userActions++;
    }

    // Log the interaction and store it in the eventLogs array
    eventLogs.push(`${userActions},${adminActions},${previousSession}`);

    previousEvent = currentEvent; // Update the previous event
  }

  // Send all logged interactions to the controller
  for (let i = 0; i < eventLogs.length; i++) {
    sync({request: Ctrl.markEvent(eventLogs[i])});
  }
});

