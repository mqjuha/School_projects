import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/actionCreators/thunks/Auth';

const Navbar = () => {
    const user = useSelector(state => state.auth.user);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const isOnProductsPage = window.location.pathname === "/products";

    const handleLogout = () => {
        dispatch(logoutUser())
            .then(() => {
                if (isOnProductsPage) {
                    navigate("/products");
                } else {
                    navigate("/login");
                }
            });
    };

    return (
        <div data-testid="navbar-container">
            <Link to="/" data-testid="home-link">Home</Link>
            <Link to="/products" data-testid="products-link">Products</Link>
            {user.role === 'admin' && (
                <Link to="/orders" data-testid="orders-link">Orders</Link>
            )}
            {user.role === 'customer' && (
                <>
                    <Link to="/orders" data-testid="orders-link">Orders</Link>
                    <Link to="/cart" data-testid="cart-link">Cart</Link>
                    <Link data-testid="logout" onClick={handleLogout}>Logout</Link>
                </>
            )}
            {user.role === 'admin' && (
                <>
                    <Link to="/users" data-testid="users-link">Users</Link>
                    <Link data-testid="logout" onClick={handleLogout}>Logout</Link>
                </>
            )}
            {user.role === 'guest' && (
                <>
                    <Link to="/cart" data-testid="cart-link">Cart</Link>
                    <Link to="/login" data-testid="login-link">Login</Link>
                    <Link to="/register" data-testid="register-link">Register</Link>
                </>
            )}
            <div data-testid="profile-container">
                <p data-testid="role-value">User role: {user.role}</p>
            </div>
        </div>
    );
};

export default Navbar;
