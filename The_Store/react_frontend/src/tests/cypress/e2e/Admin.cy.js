/** @format */

import { dataTestIds, stateTypes } from "../../constants/components.js";
import { getAllOrders, getAllProducts, getAllUsers } from "../../mocks/db.js";
import { getElement } from "../utils/getElement.js";

const {
  clickId,
  linkId,
  textId,
  selectId,
  inputId,
  containerId,
  notificationId,
} = dataTestIds;

import {
  expectNotification,
  login,
  logOut,
  navigateToPage,
  testNavigationIsFor,
  testPathIsCorrect,
  testRoleIsCorrect,
  visitPath,
} from "../utils/testHelpers.js";

const credentials = {
  admin: {
    email: "admin@email.com",
    password: "1234567890",
  },
};

const products = getAllProducts();
const product = products[0];
const users = getAllUsers();
// Get a user that is an admin
const user = users.find((user) => user.role === "admin");
// Get a user that is not the same as the admin
const otherUser = users.find((u) => u.id !== user.id);
const orders = getAllOrders();
const order = { ...orders[0] };

describe("END-TO-END - ADMIN", () => {
  beforeEach(() => {
    // cy.stubServer();
    cy.visit("/", {});

    login(credentials.admin);
  });

  describe("Navigation and Other UI Elements'", () => {
    it('Role is "admin" after successful login', () => {
      testRoleIsCorrect("admin"); // THIS IS A NEW REQUIREMENT: REMEMBER TO TAKE INTO ACCOUNT IN DOCUMENTATION!!
      logOut();
    });
    it("Navigation is shown correctly after successful admin login", () => {
      testNavigationIsFor("admin");
      logOut();
    });
  });
  // /**
  //  * Orders
  //  * @description This section tests the orders component and its children for the admin user.
  //  */
  describe("Orders (CORS) (Path: /orders)", () => {
    let ordersContainer;
    beforeEach(() => {
      navigateToPage("orders");
      expectNotification(notificationId.loading(stateTypes.order));
      expectNotification(notificationId.success(stateTypes.order));
      ordersContainer = getElement(containerId.main);
    });

    it("Should be able to look at all orders from the backend.", () => {
      ordersContainer.checkChildCount("list-item", orders.length);
      logOut();
    });

    describe("Single Order", () => {
      let orderContainer;

      beforeEach(() => {
        orderContainer = getElement(containerId.listItem(order.id));
      });

      afterEach(() => {
        // We log out in the orders page after each test
        logOut();
        // Expect to be redirected to login page
        testPathIsCorrect(`/login`);
        // Expect to see login component
        getElement(containerId.form).exists();
      });

      it("The visible order should have the same id as the order's id", () => {
        orderContainer.checkText(textId.id, order.id);
      });
      it("Should be able to inspect a single order from the backend.", () => {
        testPathIsCorrect(`/orders`);

        orderContainer.click(linkId.inspect(order.id));
        testPathIsCorrect(`/orders/${order.id}`);
        getElement(containerId.inspect).exists();
      });

      it("Should be able to directly visit a single order from the backend.", () => {
        visitPath(`/orders/${order.id}`);
        expectNotification(notificationId.loading(stateTypes.order));
        expectNotification(notificationId.success(stateTypes.order));
        getElement(containerId.inspect).exists();
      });

      describe("Order Items inspected (Path: /orders/:orderId)", () => {
        const orderProduct = order.items[0].product;
        const orderProductQuantity = order.items[0].quantity;
        let inspectContainer;
        beforeEach(() => {
          visitPath(`/orders/${order.id}`);
          expectNotification(notificationId.loading(stateTypes.order));
          expectNotification(notificationId.success(stateTypes.order));
          inspectContainer = getElement(containerId.inspect);
        });
        it("Should contain all the products of that order", () => {
          inspectContainer.checkChildCount("list-item", order.items.length);
        });

        it("Should show the name of the product and its quantity in an order inside a list-item", () => {
          const orderItemContainer = inspectContainer.getChildElement(
            containerId.listItem(orderProduct.id)
          );
          orderItemContainer.checkText(textId.name, orderProduct.name);
          orderItemContainer.checkText(textId.quantity, orderProductQuantity);
        });
      });
    });
  });
  /**
   * Users
   * @description Tests for the users page for the admin.
   */
  describe("Users (CORS) (Path: /users)", () => {
    let usersContainer;

    beforeEach(() => {
      navigateToPage("users");
      expectNotification(notificationId.loading(stateTypes.user));
      expectNotification(notificationId.success(stateTypes.user));
      usersContainer = getElement(containerId.main);
    });

    it("Should have all the users listed", () => {
      usersContainer.checkChildCount("list-item", users.length);
      logOut();
    });
    describe("Single User element (Paths: /users)", () => {
      let userContainer;

      beforeEach(() => {
        userContainer = getElement(containerId.listItem(user.id));
      });

      afterEach(() => {
        logOut();
        // Expect to be redirected to login page
        testPathIsCorrect(`/login`);
        // Expect to see a form component
        getElement(containerId.form).exists();
      });

      it("Should be able to see a single users name ", () => {
        userContainer.checkText(textId.name, user.name);
      });

      it("Should be able to see a single users role ", () => {
        userContainer.checkText(textId.role, user.role);
      });

      it("Should be able to delete another user from the backend.", () => {
        userContainer = getElement(containerId.listItem(otherUser.id));
        userContainer.click(clickId.delete);
        expectNotification(notificationId.loading(stateTypes.user));
        expectNotification(notificationId.success(stateTypes.user));
        usersContainer.checkChildCount("list-item", users.length - 1);
      });

      it("Should be able to modify another users role", () => {
        userContainer = getElement(containerId.listItem(otherUser.id));
        userContainer.checkText(textId.role, otherUser.role);
        userContainer.click(clickId.modify);
        testPathIsCorrect(`/users/${otherUser.id}/modify`);

        const userModifierContainer = getElement(containerId.form);
        userModifierContainer.checkText(selectId.role, otherUser.role);
        const changedRole = otherUser.role === "admin" ? "user" : "admin";
        userModifierContainer.selectFromDropdown(selectId.role, changedRole);
        userModifierContainer.click(clickId.submit);
        expectNotification(notificationId.loading(stateTypes.user));
        expectNotification(notificationId.success(stateTypes.user));
        testPathIsCorrect("/users");
        userContainer.checkText(textId.role, changedRole);
      });

      it("Should be unable to delete or modify their own user-details", () => {
        const ownUserContainer = getElement(containerId.listItem(user.id));
        ownUserContainer.doesNotHaveElement(clickId.delete);
        ownUserContainer.doesNotHaveElement(clickId.modify);
      });

      describe("User inspected (path: /users/:userId)", () => {
        it("Should be able to inspect a single users details", () => {
          userContainer = getElement(containerId.listItem(user.id));
          userContainer.click(linkId.inspect(user.id));
          testPathIsCorrect(`/users/${user.id}`);
          const userInspectContainer = getElement(containerId.inspect);
          userInspectContainer.exists();
        });
        it("Should be able to directly visit a single users details", () => {
          visitPath(`/users/${user.id}`);
          expectNotification(notificationId.loading(stateTypes.user));
          expectNotification(notificationId.success(stateTypes.user));
          const userInspectContainer = getElement(containerId.inspect);
          userInspectContainer.exists();
        });
        it("Should be able to see the name, email and role of the user", () => {
          visitPath(`/users/${user.id}`);
          expectNotification(notificationId.loading(stateTypes.user));
          expectNotification(notificationId.success(stateTypes.user));
          const userInspectContainer = getElement(containerId.inspect);

          userInspectContainer.checkText(textId.name, user.name);
          userInspectContainer.checkText(textId.email, user.email);
          userInspectContainer.checkText(textId.role, user.role);
        });
        it("Should be able to delete another user. Once deleted, return automatically to /users page with userMsg.delete in notification and see user now deleted. ", () => {
          userContainer = getElement(containerId.listItem(otherUser.id));
          userContainer.click(linkId.inspect(otherUser.id));
          const userInspectContainer = getElement(containerId.inspect);
          userInspectContainer.click(clickId.delete);
          expectNotification(notificationId.loading(stateTypes.user));
          expectNotification(notificationId.success(stateTypes.user));
          testPathIsCorrect("/users");
          usersContainer.checkChildCount("list-item", users.length - 1);
        });
        it("Should be able to go to modify another user. Once modified, return to inspect page.", () => {
          visitPath(`/users/${otherUser.id}`);
          const userInspectContainer = getElement(containerId.inspect);
          userInspectContainer.click(clickId.modify);
          testPathIsCorrect(`/users/${otherUser.id}/modify`);
          const userModifierContainer = getElement(containerId.form);
          userModifierContainer.checkText(selectId.role, otherUser.role);
          const changedRole = otherUser.role === "admin" ? "user" : "admin";
          userModifierContainer.selectFromDropdown(selectId.role, changedRole);
          userModifierContainer.click(clickId.submit);
          expectNotification(notificationId.loading(stateTypes.user));
          expectNotification(notificationId.success(stateTypes.user));
          testPathIsCorrect(`/users/${otherUser.id}`);
          userInspectContainer.checkText(textId.role, changedRole);
        });
        it("Should be able to go to modify another user. if cancelled, return to inspect page", () => {
          visitPath(`/users/${otherUser.id}`);
          const userInspectContainer = getElement(containerId.inspect);
          userInspectContainer.click(clickId.modify);
          testPathIsCorrect(`/users/${otherUser.id}/modify`);
          const userModifierContainer = getElement(containerId.form);
          userModifierContainer.checkText(selectId.role, otherUser.role);
          const changedRole = otherUser.role === "admin" ? "user" : "admin";
          userModifierContainer.selectFromDropdown(selectId.role, changedRole);
          userModifierContainer.click(clickId.cancel);
          testPathIsCorrect(`/users/${otherUser.id}`);
          userInspectContainer.checkText(textId.role, otherUser.role);
        });
      });
    });
  });
  /**
   * Products
   * @description Product tests for the admin role
   *
   */
  describe("Products (CORS) (Path: /products)", () => {
    let productsContainer;

    beforeEach(() => {
      navigateToPage("products");
      expectNotification(notificationId.loading(stateTypes.product));
      expectNotification(notificationId.success(stateTypes.product));
      productsContainer = getElement(containerId.main);
    });

    describe("Default behaviour: Read and Add", () => {
      afterEach(() => {
        logOut();
        testPathIsCorrect(`/products`);
        productsContainer.exists();
      });
      it("Should be able to look at all products from the backend", () => {
        productsContainer.checkChildCount("list-item", products.length);
      });
      it("Should be able to add a new product to the backend", () => {
        const newProduct = {
          name: "test-name",
          price: "99",
          description: "Test description",
        };
        productsContainer.click(clickId.add);
        const newProductformContainer = getElement(containerId.form);
        newProductformContainer.type(inputId.name, newProduct.name);
        newProductformContainer.type(inputId.price, newProduct.price);
        newProductformContainer.type(
          inputId.description,
          newProduct.description
        );
        newProductformContainer.click(clickId.submit);
        // expectNotification(notificationId.loading(stateTypes.product));
        // expectNotification(notificationId.success(stateTypes.product));
        // testPathIsCorrect("/products");
        // productsContainer.checkChildCount("list-item", products.length + 1);
      });
    });

    describe("Existing product", () => {
      let product;
      let productContainer;
      beforeEach(() => {
        product = products[0];
        productContainer = productsContainer.getChildElement(
          containerId.listItem(product.id)
        );
      });

      it("Should be able to delete existing product from the backend", () => {
        productContainer.click(clickId.delete);
        expectNotification(notificationId.loading(stateTypes.product));
        expectNotification(notificationId.success(stateTypes.product));
        productContainer.doesNotExist();
        productsContainer.checkChildCount("list-item", products.length - 1);
        logOut();
      });

      it("Should be able to click inspect on an existing product and see it's details", () => {
        productContainer.click(linkId.inspect(product.id));
        const inspectContainer = getElement(containerId.inspect);
        inspectContainer.checkText(textId.name, product.name);
        inspectContainer.checkText(textId.price, product.price);
        inspectContainer.checkText(textId.description, product.description);
        logOut();
      });

      describe("Product in inspect (Path: /products/:productId)", () => {
        let inspectProductContainer;
        beforeEach(() => {
          productContainer.click(linkId.inspect(product.id));
          testPathIsCorrect(`/products/${product.id}`);
          inspectProductContainer = getElement(containerId.inspect);
        });
        afterEach(() => {
          logOut();
        });

        it("Should be able to go to modify an existing product. Once modified, return to inspect page.", () => {
          inspectProductContainer.click(clickId.modify);
          testPathIsCorrect(`/products/${product.id}/modify`);
          const productModifierContainer = getElement(containerId.form);
          productModifierContainer.type(inputId.name, "-test-change");
          productModifierContainer.type(inputId.price, "99");
          productModifierContainer.click(clickId.submit);
          expectNotification(notificationId.loading(stateTypes.product));
          expectNotification(notificationId.success(stateTypes.product));
          testPathIsCorrect(`/products/${product.id}`);
          inspectProductContainer.checkText(
            textId.name,
            product.name + "-test-change"
          );
          inspectProductContainer.checkText(textId.price, product.price + "99");
        });

        it("Should be able to go to modify an existing product. If cancelled, return to inspect page.", () => {
          inspectProductContainer.click(clickId.modify);
          testPathIsCorrect(`/products/${product.id}/modify`);
          const productModifierContainer = getElement(containerId.form);
          productModifierContainer.type(inputId.name, "-test-change");
          productModifierContainer.type(inputId.price, "99");
          productModifierContainer.click(clickId.cancel);
          testPathIsCorrect(`/products/${product.id}`);
          inspectProductContainer.checkText(textId.name, product.name);
          inspectProductContainer.checkText(textId.price, product.price);
        });

        it("Should be able to go to delete an existing product. If deleted, return to products page.", () => {
          inspectProductContainer.click(clickId.delete);
          expectNotification(notificationId.loading(stateTypes.product));
          expectNotification(notificationId.success(stateTypes.product));
          testPathIsCorrect(`/products`);
          productsContainer.doesNotExist();
        });
      });
      describe("Single product in modify (Path: /products/:productId/modify) ", () => {
        afterEach(() => {
          logOut();
          testPathIsCorrect(`/login`);
          getElement(containerId.form).exists();
        });

        it("Should be able to cancel the modification of an existing product's details", () => {
          productContainer.click(clickId.modify);
          testPathIsCorrect(`/products/${product.id}/modify`);
          let productModifierContainer = getElement(containerId.form);
          productModifierContainer.type(inputId.name, "-test-change");
          productModifierContainer.type(inputId.price, "99");
          productModifierContainer.click(clickId.cancel);
          testPathIsCorrect("/products");
          productContainer.click(clickId.modify);
          productModifierContainer.checkValue(inputId.name, product.name);
          productModifierContainer.checkValue(inputId.price, product.price);
        });

        it("Should be able to update existing products from the backend", () => {
          productContainer.click(clickId.modify);
          testPathIsCorrect(`/products/${product.id}/modify`);
          let productModifierContainer = getElement(containerId.form);
          productModifierContainer.type(inputId.name, "-test-change");
          productModifierContainer.type(inputId.price, "99");
          productModifierContainer.click(clickId.submit);
          expectNotification(notificationId.loading(stateTypes.product));
          expectNotification(notificationId.success(stateTypes.product));
          testPathIsCorrect("/products");
          productContainer.click(clickId.modify);

          productModifierContainer.checkValue(
            inputId.name,
            product.name + "-test-change"
          );
          productModifierContainer.checkValue(
            inputId.price,
            product.price + "99"
          );
        });
      });
    });
  });
});
