import { dataTestIds } from "./tests/constants/components.js";

import React, { useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { checkAuthentication } from "./redux/actionCreators/thunks/Auth.js";

import HomePage from './pages/home_page.jsx';
import LoginPage from "./pages/login_page.jsx";
import RegisterPage from "./pages/register_page.jsx";
import CartPage from "./pages/cart_page.jsx";
import OrdersPage from "./pages/orders_page.jsx";
import ProductsPage from "./pages/products_page.jsx";
import UsersPage from "./pages/users_page.jsx";
import UserPage from "./pages/user_page.jsx";
import UserModifyPage from "./pages/modify_user_page.jsx";
import OrderPage from "./pages/order_page.jsx";
import ModifyPage from "./pages/modify_product_page.jsx";

import Navbar from "./components/Navbar.jsx";
import Notification from "./components/Notification.jsx";
import ProductPage from "./pages/product_page.jsx";

function BaseStructure() {
  return (
    <div>
      <Navbar></Navbar>
      <Notification></Notification>
      <Outlet></Outlet>
    </div>
  );
}

const App = () => {

  const dispatch = useDispatch();
  const userRole = useSelector(state => state.auth.user.role);

  useEffect(() => {
    dispatch(checkAuthentication());
  }, []);

  return (
    <div data-testid={dataTestIds.app}>
      <footer>
        <Routes>
          <Route element={<BaseStructure/>}>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage/>} />
            <Route path="/products/:productId" element={<ProductPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/cart" element={<CartPage />} />

            { userRole === "customer" && (
              <>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderPage />} />
              </>
            )}

            { userRole === "admin" && (
              <>
                <Route path="/products/:productId/modify" element={<ModifyPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/orders/:orderId" element={<OrderPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/users/:userId" element={<UserPage />} />
                <Route path="/users/:userId/modify" element={<UserModifyPage />} />
              </>
            )}
          </Route>
        </Routes>
      </footer>
    </div>
  );
};

export default App;