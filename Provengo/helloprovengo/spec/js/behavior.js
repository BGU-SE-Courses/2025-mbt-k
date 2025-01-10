/* @provengo summon selenium */
/* @provengo summon ctrl */
/* @provengo summon constraints */


/**
 * This story responsible for the setup of the tested use cases.
 * It adds an item to the store and registers a user.
 */
bthread('setup', function () {
  let s = new SeleniumSession('setup admin').start(OpenCartAdminURL)
  sync({ request: Ctrl.markEvent('setup start') })
  sync({ request: Event('Start(adminLogin)') })
  sync({ waitFor: Event('End(adminLogin)') })
  sync({ request: Event('Start(adminGoToProductsPage)') })
  sync({ waitFor: Event('End(adminGoToProductsPage)') })
  sync({ request: Event('Start(adminAddProduct)') })
  sync({ waitFor: Event('End(adminAddProduct)') })
  request(Event('setup end'));

})

/**
 * This story responsible for the use case of user adding a product to wishlist.
 */
bthread('Add item to wishlist', function () {
  waitFor(Event('setup end'));
  let s = new SeleniumSession('user').start(loginURL)


  sync({ request: Event('Start(userLogin)') })
  sync({ waitFor: Event('End(userLogin)') })
  sync({ request: Event('Start(userSearchProduct)') })
  sync({ waitFor: Event('End(userSearchProduct)') })
  interrupt(any('aboutToDeleteProduct'), function () {

    sync({ request: Event('Start(userAddProductToWishlist)') })
    sync({ waitFor: Event('End(userAddProductToWishlist)') })
  })
})

/**
 * This story responsible for the use case of admin deleting a product for the store
 */
bthread('Admin deletes an item', function () {
  waitFor(Event('setup end'));
  let s = new SeleniumSession('admin').start(OpenCartAdminURL)
  sync({ request: Event('Start(adminLogin)') })
  sync({ waitFor: Event('End(adminLogin)') })
  sync({ request: Event('Start(adminGoToProductsPage)') })
  sync({ waitFor: Event('End(adminGoToProductsPage)') })
  sync({ request: Event('Start(adminDeleteProduct)') })
  sync({ waitFor: Event('End(adminDeleteProduct)') })
})

/**
 * This story responsible to block the option to add an item to wishlist after an admin deleted the product.
 */
bthread('Block adding to wishlist after removing the item', function () {
  sync({ waitFor: any('aboutToDeleteProduct') });
  sync({ block: any('Start(userAddProductToWishlist)') });
})

/**
 * bthread that responsible for marking the critical events in the system for the domain specific marking.
 */
/*
bthread('domain specific marking', function() {

  const endOfActionES = EventSet("", e => e.name.startsWith("End("));

  let e = sync({ waitFor: endOfActionES });
  let criticalEvents = ["userSearchProduct", "userAddProductToWishlist", "adminDeleteProduct"];

  let criticalEventsOrder = [];

  while (e.name !== "End(adminDeleteProduct)") {
    criticalEvents.forEach(ce => {
      if (e.name.includes(ce)) {
        criticalEventsOrder.push(ce);
      }
    });
    e = sync ({waitFor: endOfActionES});
  }
  criticalEventsOrder.push("adminDeleteProduct");

  let ceo = criticalEventsOrder.join(" -> ");
  sync({request: Ctrl.markEvent(ceo)});
})

 */

/**
 * bthread that responsible for marking the states of the user and admin that were visited during the test.
 * an example marking is: 1,2,admin
 * 1 - the index of the user event
 * 2 - the index of the admin event
 * admin - the session that the event belongs to (user/admin)
 * this marking means that from user event 1 and admin event 1, the next event was an admin event.
 * therefore recording the edges that were visited during the test.
 */
bthread('two way marking', function () {
  //gives us a list of all the events
  waitFor(Event('setup end'));

  let marks = [];

  const eventSet = EventSet("", e => true);
  let e = sync({ waitFor: eventSet });
  let prevEvent = e

  let admin_count = 0;
  let user_count = 0;


  //get the first event counter running
  if (e.session ? e.session : e.data.session.name === 'admin') {
    admin_count++;
  } else {
    user_count++;
  }

  let adminDeleteProduct_flag = false;
  let userSearchProduct_flag = false;
  while (!adminDeleteProduct_flag || !userSearchProduct_flag) {
    e = sync({ waitFor: eventSet });

    if (e.name === 'End(adminDeleteProduct)')
      adminDeleteProduct_flag = true;

    if (e.name === 'End(userSearchProduct)')
      userSearchProduct_flag = true;

    //we have 2 types of events: selenium actions and our events like 'Start(adminDeleteProduct)'
    //each one saves the session name differently
    let e_session = e.session ? e.session : e.data.session.name;
    let prev_session = prevEvent.session ? prevEvent.session : prevEvent.data.session.name;

    //update the counter
    if (e_session === 'admin') {
      admin_count++;
    } else {
      user_count++;
    }
    marks.push(`${user_count},${admin_count},${prev_session}`);

    //update the prev event to the current event
    prevEvent = e;
  }

  for (let i = 0; i < marks.length; i++) {
    sync({ request: Ctrl.markEvent(marks[i]) });
  }
})