import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { reduceQuantity, increaseQuantity } from '../redux/actionCreators/thunks/Cart';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { setNotification } from '../redux/actionCreators/notificationAction';
import { sendOrder } from '../redux/actionCreators/thunks/Orders';
import { dataTestIds } from '../tests/constants/components';

const Cart = () => {
    const cartItems = useSelector(state => state.cart.items);
    const userRole = useSelector(state => state.auth.user.role);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleReduce = (productId) => {
        dispatch(reduceQuantity(productId));
    };

    const handleAdd = (productId) => {
        dispatch(increaseQuantity(productId));
    };

    const handleSubmit = () => {
        if ( userRole === "guest" ) {
            dispatch(setNotification({ message: "You need to login!", state: "error", stateType: "auth" }));
            navigate("/login");
        }
        dispatch(sendOrder());
    }

    return (
        <div data-testid="main-container">
            <h2>Shopping Cart</h2>

            {cartItems.length === 0 ? (
                <p data-testid="empty-container">Cart is empty</p>
            ) : (
                <>
                    <ul>
                        {Array.isArray(cartItems) && cartItems.map(item => (
                            <li key={item.product.id} data-testid={dataTestIds.containerId.listItem(item.product.id)}>
                                <div>
                                    <Link to={`/products/${item.product.id}`} data-testid="name-value">{item.product.name}</Link>
                                    <span data-testid="price-value">{item.product.price}</span>
                                    <span data-testid="quantity-value">Quantity: {item.quantity}</span>
                                    <button onClick={() => handleReduce(item.product.id)} data-testid="reduce">Reduce</button>
                                    <button onClick={() => handleAdd(item.product.id)} data-testid="add">Add</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleSubmit} data-testid="submit">Submit Order</button>
                </>
            )}
        </div>
    );
};

export default Cart;
