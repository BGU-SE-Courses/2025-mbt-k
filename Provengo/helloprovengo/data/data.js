/*
 *  This is a good place to put common test data, project-wide constants, etc.
 */

const OpenCartURL = 'http://localhost/opencart';
const OpenCartAdminURL = 'http://localhost/opencart/upload/admin';
const registerURL = 'http://localhost/opencart/upload/index.php?route=account/register&language=en-gb';
const loginURL = 'http://localhost/opencart/upload/index.php?route=account/login&language=en-gb';


const xpaths = {
  registerWindow: {
    firstNameInput: "//*[@id='input-firstname']",
    lastNameInput: "//*[@id='input-lastname']",
    emailInput: "//*[@id='input-email']",
    passwordInput: "//*[@id='input-password']",
    agreeCheckbox: "//*[@name='agree']",
    continueButton: "//*[@type='submit']"
  },
  loginWindow: {
    emailInput: "//*[@id='input-email']",
    passwordInput: "//*[@id='input-password']",
    loginButton: "//div[3]/button[1]"
  },
  adminLoginWindow: {
    usernameInput: "//*[@id='input-username']",
    passwordInput: "//*[@id='input-password']",
    loginButton: "//button[1]"
  },
  adminMainWindow: {
    catalogButton: "//nav[1]/ul[1]/li[2]/a[1]",
    productsButton: "//nav[1]/ul[1]/li[2]/ul[1]/li[2]/a[1]",
    userListButton: "//div[3]/div[1]/div[3]/a[1]",
    logoutButton: "//li[4]/a[1]/span[1]",
    sidebarButton: "//*[@id='button-menu']/i[1]"
  },
  userWishlistWindow: {
    firstProduct: "//td[2]/a[1]"
  },
  userMainWindow: {
    wishlistButton: "//li[3]/a[1]/span[1]",
    searchInput: "//header[1]/div[1]/div[1]/div[2]/div[1]/input[1]",
    searchButton: "//header[1]/div[1]/div[1]/div[2]/div[1]/button[1]/i[1]",
    heartButton: "//*[@id='product-list']/div/div/div/form/div/button[2]",
    accountButton: "//div[1]/div[2]/ul[1]/li[2]/div[1]/a[1]",
    logoutButton: "//li[2]/div[1]/ul[1]/li[5]/a[1]"
  },
  addProductWindow: {
    productNameInput: "//div[1]/div[1]/div[1]/div[1]/div[1]/input[1]",
    tagInput: "//*[@id='input-meta-title-1']",
    dataTab: "//form[1]/ul[1]/li[2]/a[1]",
    modelInput: "//*[@id='input-model']",
    seoTab: "//form[1]/ul[1]/li[11]/a[1]",
    seoInput: "//*[@id='input-keyword-0-1']",
    saveButton: "//div[2]/div[1]/div[1]/div[1]/button[1]"
  },
  userListWindow: {
    emailInput: "//*[@id='input-email']",
    filterButton: "//*[@id='button-filter']",
    selectUserButton: "//tbody[1]/tr[1]/td[1]/input[1]",
    deleteButton: "//button[2]"
  },
  adminProductListWindow: {
    productNameInput: "//*[@id='input-name']",
    filterButton: "//div[1]/div[1]/div[1]/div[2]/div[6]/button[1]",
    selectProductButton: "//tbody[1]/tr[1]/td[1]/input[1]",
    selectAllProductsButton: "//thead[1]/tr[1]/td[1]/input[1]",
    deleteProductButton: "/html/body/div[1]/div[2]/div[1]/div/div/button[3]/i",
    addProductButton: "//div[1]/div[1]/div[1]/a[1]/i[1]",
    openFilterButton: "//div[1]/div[1]/button[1]"
  },
  notification: {
    closeNotificationButton: "//*[@class='btn-close']"

  }
}
const adminUsername = 'admin'
const adminPassword = 'admin'
const userFirstName = 'user'
const userLastName = 'user2'
const userPassword = 'user'
const userEmail = 'user@gmail.com'
const productName = 'product'
const productTag = 'product'
const productModel = 'product'
const productSEO = 'product_test'