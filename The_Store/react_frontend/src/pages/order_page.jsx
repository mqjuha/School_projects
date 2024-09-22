import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { dataTestIds } from '../tests/constants/components';
import { setNotification } from '../redux/actionCreators/notificationAction';
import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getOrder } from '../redux/actionCreators/thunks/Orders';

const OrderPage = () => {
    const { orderId } = useParams();
    const dispatch = useDispatch();

    const order = useSelector((state) => state.order);

    useEffect(() => {
        dispatch(getOrder(orderId))
        return () => {}
    }, [])

    return (
        <div data-testid="inspect-container">
            <h2>Order Details</h2>
                {order && order.items ? (
                    <ul>
                        {order.items.map(item => (
                            <li key={item.product.id} data-testid={dataTestIds.containerId.listItem(item.product.id)}>
                                <p data-testid="name-value">{item.product.name}</p>
                                <p data-testid="quantity-value">{item.quantity}</p>
                            </li>
                        ))}
                    </ul>
                ) : null }
        </div>
    );
};

export default OrderPage;

//<p data-testid="empty-container">No items found</p>