/** @format */

import { dataTestIds } from "../../constants/components.js";
import { getElement } from "./getElement.js";

const allLinks = [
  "Home",
  "Products",
  "Login",
  "Register",
  "Cart",
  "Orders",
  "Profile",
];

const {
  clickId,
  linkId,
  listId,
  textId,
  selectId,
  inputId,
  containerId,
  notificationId,
} = dataTestIds;

const navbarShouldShow = (availableLinks) => {
  const navbar = getElement(containerId.navbar);
  navbar.exists();
  const notAvailableLinks = allLinks.filter(
    (link) => !availableLinks.includes(link)
  );
  availableLinks.forEach((link) => {
    // Should be visible and contain text of link and be a link to the correct path
    navbar.checkText(linkId[link.toLowerCase()], link);
  });

  notAvailableLinks.forEach((link) => {
    navbar.doesNotExist(linkId[link.toLowerCase()]);
  });
};

export const testNavigationIsFor = (role = "guest") => {
  const links = ["Home", "Products"];

  switch (role) {
    case "customer":
      links.push("Orders", "Cart");
      break;
    case "admin":
      links.push("Orders", "Users");
      break;
    default:
      links.push("Login", "Cart", "Register");
  }

  navbarShouldShow(links);
};

export const visitPath = (path) => {
  cy.visit(path);
  testPathIsCorrect(path);
};

export const navigateToPage = (link) => {
  cy.get(`[data-testid="${link.toLowerCase()}-link"]`).click();
  // cy.url().should('include', allNavLinks[link]);
  testPathIsCorrect("/" + link);
};

export const login = ({ email, password }) => {
  testNavigationIsFor("guest");
  navigateToPage("login");
  cy.wait(100);
  const loginComponent = getElement(containerId.form);
  loginComponent.type(inputId.email, email);
  loginComponent.type(inputId.password, password);
  loginComponent.click(clickId.submit);
  expectNotification(notificationId.loading("auth"));
  getElement(containerId.main);

  testPathIsCorrect("/");
  expectNotification(notificationId.success("auth"));
};

export const testRoleIsCorrect = (role = "guest") => {
  const profileComponent = getElement(containerId.profile);
  profileComponent.checkText(textId.role, role);
};

export const expectMany = (compName, items) => {
  cy.findAllByTestId(`${compName}-component`).should(
    "have.length",
    items.length
  );
};

/**
 * @description - Test that a notification is shown for a specific type. Make sure no other state of that type is shown.
 * @param {*} notification - The type of notification to expect. Example: "product-success-notification"
 */
export const expectNotification = (notification) => {
  const allNotificationStates = ["success", "loading", "error"];
  const notificationContainer = getElement(containerId.notification);
  const thisState = notification.split("-")[1];
  const thisType = notification.split("-")[0];
  notificationContainer.hasElement(notification);

  allNotificationStates.forEach((state) => {
    if (state !== thisState) {
      notificationContainer.doesNotHaveElement(notificationId[state](thisType));
    }
  });
};

export const logOut = () => {
  try {
    getElement(containerId.navbar).click(clickId.logout);
    // expectNotification('User logged out!');
    testNavigationIsFor("guest");
  } catch (e) {
    console.log("Logout failed, trying again");
  }
};

export const testPathIsCorrect = (correctPath) => {
  cy.url().should("include", correctPath);
  // cy.url().should('include', correctPath);
};

export const selectFromDropdown = (dropdownTestId, optionText) => {
  cy.get(`[data-testid="${dropdownTestId}"]`).select(optionText, {
    force: true,
  });
};

// Currently not in use
export const getStore = () => {
  const store = cy.window().its("store");
  return {
    dispatch: (type, payload) => {
      store.invoke("dispatch", { type, payload });
    },
  };
};

export function interceptIndefinitely(requestMatcher, response) {
  let sendResponse = () => {};
  // Create a Promise and capture a reference to its resolve function so that we can resolve it when we want to:
  const trigger = new Promise((resolve) => {
    sendResponse = resolve;
  });

  // Intercept requests to the URL we are loading data from and do not let the response occur until our above Promise is resolved
  cy.intercept(requestMatcher, (request) => {
    return trigger.then(() => {
      return request.reply(response);
    });
  });

  return { sendResponse };
}
