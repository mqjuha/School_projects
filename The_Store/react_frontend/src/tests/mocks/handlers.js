/** @format */

import jwt from "jsonwebtoken";
import { http, HttpResponse, delay } from "msw";
import { v1 as uuidV1 } from "uuid";
import {
  getAllOrders,
  getAllProducts,
  getAllUsers,
  getOrderById,
  getProductById,
  getUserByEmail,
  getUserById,
} from "./db";

const JWT_SECRET = "kXo!7e#R5V$ZCc*vE&Y&sZs$$F9h%Q";
export const LOGIN_PASSWORD = "1234567890";
const cookieOptions = {
  httpOnly: true,
  path: "/",
  sameSite: "strict",
  secure: false,
};

const expiresPast = new Date("2020-01-01");

const validateOrderItem = (item) => {
  if (!("product" in item)) return false;
  if (!Number.isSafeInteger(item?.quantity) || item.quantity <= 0) return false;
  if (!item?.product?.id) return false;
  if (!item?.product?.name || typeof item.product.name !== "string")
    return false;
  if (!item?.product?.price || typeof item.product.price !== "number")
    return false;
  if (item.product.name.trim() === "") return false;
  if (item.product.price <= 0) return false;
  if (!getProductById(item.product.id)) return false;

  return true;
};

// return always a user or guest
const getUserFromCookie = (cookies) => {
  const guest = { role: "guest" };
  console.log("cookies", cookies);
  const token = cookies?.token;
  if (!token) return guest;

  const decodedToken = jwt.verify(token, JWT_SECRET);
  if (!decodedToken) return guest;

  return { ...decodedToken };
};

const isAdmin = (user) => user?.role === "admin";
const isCustomer = (user) => user?.role === "customer";
const isGuest = (user) => user?.role === "guest";

const respondWithError = (content, status = 400) => {
  const error = typeof content === "string" ? content : { ...content };
  //
  return HttpResponse.json(
    { error },
    // set status
    { status }
  );
};

const respondNotFound = () => {
  return HttpResponse.json(
    { error: "Not found" },
    {
      status: 404,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    }
  );
};

const respondUnauthorized = (message) => {
  return HttpResponse.json(
    { error: message },
    {
      status: 401,
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    }
  );
};

const respondForbidden = (message) => {
  return HttpResponse.json(
    { error: message },
    {
      status: 403,

      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    }
  );
};

const getToken = (user) => {
  if (!user) return "";
  return jwt.sign({ ...user }, JWT_SECRET);
};

const getRandomID = () => {
  return uuidV1().replaceAll("-", "");
};

const cookie = (user, expires) => {
  return `token=${getToken(user)}; 
    `;
};

const checkStatus = async ({ cookies }) => {
  await delay();

  const user = getUserFromCookie(cookies);
  const userJSON = JSON.stringify({ user });
  return new HttpResponse(userJSON, {
    headers: {
      "Set-Cookie": cookie(user),
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  });
  //   return res(
  //     ctx.cookie("token", getToken(user), cookieOptions),
  //     ctx.status(200),
  //     ctx.json({ user })
  //   );
};

const registerUser = async ({ cookies, request }) => {
  console.log("registerUser called");
  await delay();

  if (!isGuest(getUserFromCookie(cookies))) {
    return respondForbidden("Only for guests");
  }

  const { name, email, password } = (await request.json()) ?? {};
  if (name.trim() === "") return respondWithError({ name: "name is required" });
  if (email.trim() === "")
    return respondWithError({ email: "email is required" });

  if (password.trim().lenth < 10) {
    return respondWithError({
      password: "password is required and must be at least 10 characters long",
    });
  }

  if (getUserByEmail(email)) {
    return respondWithError({
      email: "User with the same email address already exists.",
    });
  }

  const user = {
    id: getRandomID(),
    name,
    email,
    role: "customer",
  };

  const userJSON = JSON.stringify({ user });
  return new HttpResponse(userJSON, {
    status: 201,
    headers: {
      "Set-Cookie": cookie(user),
      // "Set-Cookie": "token=1234567890",
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  });
};

const loginUser = async ({ cookies, request }) => {
  await delay();
  console.log("loginUser called");
  if (!isGuest(getUserFromCookie(cookies))) {
    return respondForbidden("Only for guests");
  }

  const { email, password } = await request.json();
  const user = getUserByEmail(email);
  const userJSON = JSON.stringify({ user });

  if (!user || password !== LOGIN_PASSWORD) {
    return respondForbidden("Login failed. Check email and password.");
  }

  return new HttpResponse(
    // send user in body so that it can be used in the frontend, without it being [Object object] in the response
    userJSON,
    {
      status: 200,
      headers: {
        "Set-Cookie": cookie(user),
        "Content-Type": "application/json",
        "Access-Control-Allow-Credentials": "true",
        "Access-Control-Allow-Origin": "http://localhost:3000",
      },
    }
  );
};

const logOut = async () => {
  await delay();
  // Not exactly the same as in the real backend but should be effectively same
  const message = "User logged out!";
  const messageJSON = JSON.stringify({ message });

  return new HttpResponse(messageJSON, {
    status: 200,
    headers: {
      "Set-Cookie": cookie({ role: "" }),
      "Content-Type": "application/json",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "http://localhost:3000",
    },
  });
};

const getProducts = async () => {
  await delay();
  return HttpResponse.json(getAllProducts());
};

const getProduct = async ({ params }) => {
  await delay();
  const product = getProductById(params.productId);
  if (!product) return respondNotFound();
  return HttpResponse.json(product);
};

const deleteProduct = async ({ cookies, params }) => {
  await delay();
  const currentUser = getUserFromCookie(cookies);
  if (!isAdmin(currentUser)) return respondForbidden("Admin rights required");

  const product = getProductById(params.productId);
  if (!product) return respondNotFound();
  return HttpResponse.json(product);
};

const createProduct = async ({ request, cookies }) => {
  await delay();
  const currentUser = getUserFromCookie(cookies);
  if (!isAdmin(currentUser)) return respondForbidden("Admin rights required");
  const req = await request.json();

  const name = req?.name ?? null;
  const price = req?.price ?? null;
  const image = req?.image ?? null;
  const description = req?.description ?? null;

  if (name === null) return respondWithError({ name: "name is required" });
  if (name.trim() === "")
    return respondWithError({ name: "name cannot be empty" });
  if (price === null) return respondWithError({ price: "price is required" });

  if (Number.parseFloat(price) <= 0) {
    return respondWithError({
      price: "price must be a positive number",
    });
  }

  const product = {
    id: getRandomID(),
    name: name.trim(),
    price: Number.parseFloat(price),
  };
  if (description !== null) product.description = description;
  if (image !== null) product.image = image;

  return HttpResponse.json(product, {
    status: 201,
    "Access-Control-Allow-Origin": "http://localhost:3000",
  });
};

const updateProduct = async ({ cookies, request, params }) => {
  await delay();
  const currentUser = getUserFromCookie(cookies);
  if (!isAdmin(currentUser)) return respondForbidden("Admin rights required");

  const product = getProductById(params.productId);
  if (!product) return respondNotFound();

  const req = await request.json();
  const name = req?.name ?? null;
  const price = req?.price ?? null;
  const image = req?.image ?? null;
  const description = req.description ?? null;

  if (name !== null && name.trim() === "") {
    return respondWithError({ name: "name cannot be empty" });
  }

  if (price !== null && Number.parseFloat(price) <= 0) {
    return respondWithError({
      price: "price must be a positive number",
    });
  }

  if (name !== null) product.name = name.trim();
  if (price !== null) product.price = Number.parseFloat(price);
  if (description !== null) product.description = description;
  if (image !== null) product.image = image;

  return HttpResponse.json(product, {
    status: 200,
    "Access-Control-Allow-Origin": "http://localhost:3000",
  });
};

const getUsers = async ({ cookies }) => {
  await delay();
  const currentUser = getUserFromCookie(cookies);
  if (isGuest(currentUser)) return respondUnauthorized("Login required");
  if (!isAdmin(currentUser)) return respondForbidden("Admin rights required");

  return HttpResponse.json(getAllUsers(), {
    "Access-Control-Allow-Origin": "http://localhost:3000",
  });
};

const getUser = async ({ cookies, params }) => {
  await delay();
  const currentUser = getUserFromCookie(cookies);
  if (isGuest(currentUser)) return respondUnauthorized("Login required");
  if (!isAdmin(currentUser)) return respondForbidden("Admin rights required");

  const user = getUserById(params.userId);
  if (!user) return respondNotFound();
  return HttpResponse.json(user, {
    "Access-Control-Allow-Origin": "http://localhost:3000",
  });
};

const updateUserRole = async ({ cookies, params, request }) => {
  await delay();
  const currentUser = getUserFromCookie(cookies);
  if (isGuest(currentUser)) return respondUnauthorized("Login required");
  if (!isAdmin(currentUser)) return respondForbidden("Admin rights required");

  if (currentUser.id === params.userId) {
    return respondWithError("Modifying own data is not allowed");
  }

  const { role } = await request.json();
  if (role !== "customer" && role !== "admin") {
    return respondWithError({ role: `Unknown role ${role}` });
  }

  const user = getUserById(params.userId);
  if (!user) return respondNotFound();

  return HttpResponse.json(
    { ...user, role },
    {
      "Access-Control-Allow-Origin": "http://localhost:3000",
    }
  );
};

const deleteUser = async ({ cookies, params }) => {
  await delay();
  const currentUser = getUserFromCookie(cookies);
  if (isGuest(currentUser)) return respondUnauthorized("Login required");
  if (!isAdmin(currentUser)) return respondForbidden("Admin rights required");

  if (currentUser.id === params.userId) {
    return respondWithError("Modifying own data is not allowed");
  }

  const user = getUserById(params.userId);
  if (!user) return respondNotFound();

  return HttpResponse.json(user);
};

const getOrders = async (info) => {
  await delay();
  console.log("getOrders called");
  console.log("info", info);
  const { cookies } = info;
  const currentUser = getUserFromCookie(cookies);
  if (isGuest(currentUser)) return respondUnauthorized("Login required");

  // show all orders for admin
  if (isAdmin(currentUser)) {
    return HttpResponse.json(getAllOrders());
  }

  // customers can see only their own orders
  return HttpResponse.json(getAllOrders(currentUser.id));
};

const getOrder = async ({ cookies, params }) => {
  await delay();
  console.log("getOrder called");
  const currentUser = getUserFromCookie(cookies);
  if (isGuest(currentUser)) return respondUnauthorized("Login required");

  const order = isAdmin(currentUser)
    ? getOrderById(params.orderId)
    : getOrderById(params.orderId, currentUser.id);
  if (!order) return respondNotFound();

  return HttpResponse.json(order, {
    "Access-Control-Allow-Origin": "http://localhost:3000",
  });
};

const createOrder = async ({ cookies, request }) => {
  await delay();
  const currentUser = getUserFromCookie(cookies);
  if (isGuest(currentUser)) return respondUnauthorized("Login required");
  if (!isCustomer(currentUser))
    return respondForbidden("Customer rights required");

  const { items } = await request.json();

  if (!Array.isArray(items)) {
    return respondWithError({
      items: '"items" is missing or not an array',
    });
  }

  if (!items.every(validateOrderItem)) {
    return respondWithError("One or more order items are invalid");
  }

  const order = {
    id: getRandomID(),
    customerId: currentUser.id,
    items,
  };

  return HttpResponse.json(
    order,
    { status: 201 },
    {
      "Access-Control-Allow-Origin": "http://localhost:3000",
    }
  );
};

export const checkStatusApi = "**/api/check-status";
export const loginApi = "**/api/login";
export const logOutApi = "**/api/logout";
export const registerApi = "**/api/register";
export const ordersApi = "**/api/orders";
export const productsApi = "**/api/products";
export const usersApi = "**/api/users";

export const handlers = [
  // login and registration
  http.get(checkStatusApi, checkStatus),
  http.post(registerApi, registerUser),
  http.post(loginApi, loginUser),
  http.get(logOutApi, logOut),

  // products
  http.get(productsApi, getProducts),
  http.post(productsApi, createProduct),
  http.get(`${productsApi}/:productId`, getProduct),
  http.put(`${productsApi}/:productId`, updateProduct),
  http.delete(`${productsApi}/:productId`, deleteProduct),

  // users
  http.get(usersApi, getUsers),
  http.get(`${usersApi}/:userId`, getUser),
  http.put(`${usersApi}/:userId`, updateUserRole),
  http.delete(`${usersApi}/:userId`, deleteUser),

  // orders
  http.get(ordersApi, getOrders),
  http.post(ordersApi, createOrder),
  http.get(`${ordersApi}/:orderId`, getOrder),
];
