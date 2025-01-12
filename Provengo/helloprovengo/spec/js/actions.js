
// Define an event filter for start events in a session
const AnyStartInSession = function (s) {
  return bp.EventSet("AnyStartInSession-" + s, function (e) {
    return e.data !== null && e.data.hasOwnProperty('startEvent') && e.data.startEvent && String(s).equals(e.data.session.name)
  })
}

defineAction = function (name, func) {
  // Add the new action to the SeleniumSession prototype
  SeleniumSession.prototype[name] = function (data) {
    let session = this;

    // Request a start event
    sync({ request: bp.Event(`Start(${name})`, { session: session, startEvent: true, parameters: data }) })

    // Block any other start events in the session while the function is executing
    block(AnyStartInSession(this.name), function () {
      // Execute the function
      func(session, data)

      // Request an end event
      sync({ request: bp.Event(`End(${name})`, { session: session, endEvent: true, parameters: data }) })
    })
  }
}


defineAction('registerUser', function (session) {
  session.writeText(xpaths.registerWindow.firstNameInput, userFirstName)
  session.writeText(xpaths.registerWindow.lastNameInput, userLastName)
  session.writeText(xpaths.registerWindow.emailInput, userEmail)
  session.writeText(xpaths.registerWindow.passwordInput, userPassword)
  session.click(xpaths.registerWindow.agreeCheckbox)
  session.click(xpaths.registerWindow.continueButton)
  session.close()
})


defineAction('adminLogin', function (session) {
  with (session) {
    session.writeText(xpaths.adminLoginWindow.usernameInput, adminUsername)
    session.writeText(xpaths.adminLoginWindow.passwordInput, adminPassword)
    session.waitForClickability(xpaths.adminLoginWindow.loginButton)
    session.click(xpaths.adminLoginWindow.loginButton)
    session.waitForVisibility(xpaths.notification.closeNotificationButton)
    session.click(xpaths.notification.closeNotificationButton)
  }
})

defineAction('adminGoToProductsPage', function (session) {
  with (session) {
    // click(xpaths.adminMainWindow.sidebarButton)
    click(xpaths.adminMainWindow.catalogButton)
    click(xpaths.adminMainWindow.productsButton)
  }
})

defineAction('adminAddProduct', function (session) {
  with (session) {
    click(xpaths.adminProductListWindow.addProductButton)
    writeText(xpaths.addProductWindow.productNameInput, productName)
    writeText(xpaths.addProductWindow.tagInput, productTag)
    click(xpaths.addProductWindow.dataTab)
    writeText(xpaths.addProductWindow.modelInput, productModel)
    click(xpaths.addProductWindow.seoTab)
    writeText(xpaths.addProductWindow.seoInput, productSEO)
    click(xpaths.addProductWindow.saveButton)

    //waitForVisibility(xpaths.notification.closeNotificationButton)
    //click(xpaths.notification.closeNotificationButton)
    close()
  }
})

defineAction('adminDeleteProduct', function (session) {
  with (session) {
    waitForClickability(xpaths.adminProductListWindow.selectAllProductsButton)
    click(xpaths.adminProductListWindow.selectAllProductsButton)
    waitForClickability(xpaths.adminProductListWindow.deleteProductButton)
    sync({ request: bp.Event('aboutToDeleteProduct', { session: session }) }) // Intermediate event
    click(xpaths.adminProductListWindow.deleteProductButton)
    if (isAlertPresent()) {
      acceptAlert()
    }
    sync({ request: bp.Event(`End(aboutToDeleteProduct)`, { session: session }) }) // End event
  }
})


defineAction('adminLogout', function (session) {
  with (session) {
    click(xpaths.adminMainWindow.logoutButton)
  }
})

defineAction('userLogin', function (session) {
  with (session) {
    writeText(xpaths.loginWindow.emailInput, userEmail)
    writeText(xpaths.loginWindow.passwordInput, userPassword)
    click(xpaths.loginWindow.loginButton)
  }
})

defineAction('userSearchProduct', function (session) {
  with (session) {
    waitForClickability(xpaths.userMainWindow.searchInput)
    waitForClickability(xpaths.userMainWindow.searchButton)
    writeText(xpaths.userMainWindow.searchInput, productName)
    click(xpaths.userMainWindow.searchButton)
    //wait(1000))
  }
})

defineAction('userAddProductToWishlist', function (session) {
  with (session) {
    moveToElement(xpaths.userMainWindow.heartButton)
    waitForClickability(xpaths.userMainWindow.heartButton)
    click(xpaths.userMainWindow.heartButton)
  }
})

function HandleAlert(session) {
  try {
      let driver = session.driver; 
      let alert = driver.switchTo().alert();
      if (alert) {
          alert.accept();
      }
  } catch (e) {
      // Alert not present - continue
  }
}

function isAlertPresent() {
  try {
    let alert = driver.switchTo().alert();
    return alert !== null;
  } catch (e) {
    return false;
  }
}