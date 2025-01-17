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
  let s = new SeleniumSession('user');
  s.start(loginURL);
  s.userLogin();
  s.userSearchProduct();
  s.userAddProductToWishlist();
});

// Admin deleting a product
/**
 * Simulates the admin workflow of logging in, navigating to the products page, and deleting a product.
 * This b-thread starts after the setup process completes.
 */
bthread('Admin deletes an item', function () {
  waitFor(Event('setup_end'));
  let s = new SeleniumSession('admin');
  s.start(OpenCartAdminURL);
  s.adminLogin();
  s.adminGoToProductsPage();
  s.adminDeleteProduct();
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

// Two-way event marking
/**
 * Tracks and logs interactions between admin and user sessions, marking events in a two-way relationship.
 * It monitors session interactions, increments counters for admin and user actions, and generates marks for each interaction.
 */
bthread('two way marking', function() {
  waitFor(Event('setup end'));

  let marks = []; // Array to store event marks
  const eventSet = EventSet("", e => true); // Event set that captures all events
  let e = sync({ waitFor: eventSet });
  let prevEvent = e; // Tracks the previous event

  let admin_count = 0; // Counter for admin actions
  let user_count = 0; // Counter for user actions

  // Check if the event is from an admin session and update the counter
  if (e.session ? e.session : e.data.session.name === 'admin') {
    admin_count++;
  } else {
    user_count++;
  }

  // Add a maximum iteration count to prevent infinite loops
  let maxIterations = 100;
  let iterations = 0;

  let adminDeleteProduct_flag = false; // Flag to track admin product deletion
  let userSearchProduct_flag = false; // Flag to track user product search

  // Loop to track events until both admin and user flags are set or iteration limit is reached
  while ((!adminDeleteProduct_flag || !userSearchProduct_flag) && iterations < maxIterations) {
    iterations++;
    e = sync({waitFor: eventSet});

    // Update flags based on specific events
    if (e.name === 'End(adminDeleteProduct)')
      adminDeleteProduct_flag = true;

    if (e.name === 'End(userSearchProduct)')
      userSearchProduct_flag = true;

    // Determine the current session type and update counters
    let e_session = e.session ? e.session : e.data.session.name;
    let prev_session = prevEvent.session ? prevEvent.session : prevEvent.data.session.name;

    if (e_session === 'admin') {
      admin_count++;
    } else {
      user_count++;
    }

    // Create a mark and add it to the marks array
    marks.push(`${user_count},${admin_count},${prev_session}`);

    prevEvent = e; // Update the previous event
  }

  // Send all marks to the controller
  for (let i = 0; i < marks.length; i++) {
    sync({request: Ctrl.markEvent(marks[i])});
  }
});
