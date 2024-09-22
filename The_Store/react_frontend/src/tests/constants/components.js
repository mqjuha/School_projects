/** @format */

/**
 * @fileOverview
 * This file contains the data-test-ids for the components
 * used in the application.
 *
 * It is used to make the tests more readable and to avoid
 * hardcoding the data-test-ids in the tests. You can also
 * use them in the application to ensure that the data-test-ids
 * are consistent.
 *
 * It also hosts the stateTypes object which contains the types
 * of states in the application. It is used to specify the state
 * type when dispatching notifications.
 */

/**
 * @constant stateTypes
 * @type {Object}
 * @description The request types of states in the application. It is used to specify the state request type when creating notifications.
 */
export const stateTypes = {
  product: "product", // For the product state
  user: "user", // For the user state
  order: "order", // For the order state
  cart: "cart", // For the cart state
  auth: "auth", // For the auth state
};

/**
 * @constant dataTestIds
 * @type {Object}
 * @description The data-test-ids for the components used in the application. It is used to make the tests more readable and to avoid hardcoding the data-test-ids in the tests. You can also use them in the application to ensure that the data-test-ids are consistent.
 */
export const dataTestIds = {
  linkId: {
    home: "home-link", // For the element that links to the home page
    products: "products-link", // For the element that links to the products page
    orders: "orders-link", // For the element that links to the orders page
    users: "users-link", // For the element that links to the users page
    register: "register-link", // For the element that links to the register page
    login: "login-link", // For the element that links to the login page
    inspect: (id) => `inspect-${id}-link`, // For the element that links to the inspect pages (products, orders, users). The id is the id of the item
    cart: "cart-link", // For the element that links to the cart page
  },
  clickId: {
    logout: "logout", // For the element that logs out
    modify: "modify", // For accessing the modify containers/routes
    submit: "submit", // submit operations (login, register, modify, ...)
    delete: "delete", // delete items (products, users, ...)
    cancel: "cancel", // cancel operations (modify operations)
    reduce: "reduce", // reduce the amount of an item (cart)
    add: "add", // add the amount of an item (cart), add a new item (products)
  },
  notificationId: {
    /** 2024 NEW */
    success: (stateType) => `${stateType}-success-notification`, // For the element that displays a success notification for a specific type. Example, if the stateType is "product", the data-testid will be "product-success-notification"
    loading: (stateType) => `${stateType}-loading-notification`, // For the element that displays a loading notification for a specific type
    error: (stateType) => `${stateType}-error-notification`, // For the element that displays an error notification for a specific type
  },

  containerId: {
    main: "main-container", // For the element that contains the main content of the page
    listItem: (itemId) => `list-item-${itemId}-container`, // For the element that contains the list item
    profile: "profile-container", // For the element that contains the profile
    navbar: "navbar-container", // For the element that contains the navbar
    notification: "notifications-container", // For the element that contains the notifications
    app: "app-container", // For the element that contains the app
    empty: "empty-container", // For the element that contains the empty page
    inspect: "inspect-container", // For the element that contains the inspect page
    form: "form-container", // For the element that contains the form
  },
  selectId: {
    role: "role-select", // For the element that selects the role
  },
  inputId: {
    name: "name-input", // For the element that inputs the name
    email: "email-input", // For the element that inputs the email
    password: "password-input", // For the element that inputs the password
    passwordConfirmation: "passwordConfirmation-input", // For the element that inputs the password confirmation
    description: "description-input", // For the element that inputs the description
    price: "price-input", // For the element that inputs the price
    id: "id-input", // For the element that inputs the id (**2024: NEW**)
  },
  textId: {
    description: "description-value", // For the element that displays the description
    name: "name-value", // For the element that displays the name
    price: "price-value", // For the element that displays the price
    email: "email-value", // For the element that displays the email
    role: "role-value", // For the element that displays the role
    id: "id-value", // For the element that displays the id of the item
    customerId: "customerId-value", // For the element that displays the customer id (**2024: NEW**)
    quantity: "quantity-value", // For the element that displays the quantity of an item
    title: "title-value", // For the element that displays the title
  },
};

export const validEmailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
