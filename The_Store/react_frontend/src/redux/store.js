import { legacy_createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";

// Redux-devtools extension library
import { composeWithDevTools } from "@redux-devtools/extension";

// Reducers
import authReducer from "./reducers/authReducer";
import cartReducer from "./reducers/cartReducer";
import notificationReducer from "./reducers/notificationReducer";
import ordersReducer from "./reducers/ordersReducer";
import productsReducer from "./reducers/productsReducer";
import usersReducer from "./reducers/usersReducer";
import { selectedOrderReducer } from "./reducers/orderReducer";
import { selectedProductReducer } from "./reducers/productReducer";

export const reducers = combineReducers({
  notification: notificationReducer,
  auth: authReducer,
  products: productsReducer,
  cart: cartReducer,
  users: usersReducer,
  orders: ordersReducer,
  order: selectedOrderReducer,
  product: selectedProductReducer
});

export default legacy_createStore(
  reducers,
  composeWithDevTools(applyMiddleware(thunk))
);
