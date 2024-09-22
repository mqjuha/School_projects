import * as React from 'react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useDispatch, useSelector } from 'react-redux';
import { getOrders } from '../redux/actionCreators/thunks/Orders';
import { setNotification } from '../redux/actionCreators/notificationAction';

import { dataTestIds } from '../tests/constants/components';

function Orders() {

    const dispatch = useDispatch();
    const orders = useSelector(state => state.orders);

    console.log("Orders of OrdersPage", orders);

    const handleInspect = () => {
        //dispatch(setNotification({ message: "Loading details...", state: "loading", stateType: "order" }));
    }

    useEffect(() => {
        dispatch(getOrders());
    }, []); //dispatch

    return (
        <div data-testid="main-container">
            {Array.isArray(orders) && orders.length > 0 ? (
                <ul>
                    {orders.map(order => (
                        <li key={order.id} data-testid={dataTestIds.containerId.listItem(order.id)}>
                            <p data-testid={`id-value`}>{order.id}</p>
                            <Link to={`/orders/${order.id}`} data-testid={dataTestIds.linkId.inspect(order.id)} onClick={handleInspect}>Inspect</Link>
                        </li>
                    ))}
                </ul>
            ) : (
                <p data-testid="empty-container">No orders found</p>
            )}

        </div>
    );
}
  
export default Orders;