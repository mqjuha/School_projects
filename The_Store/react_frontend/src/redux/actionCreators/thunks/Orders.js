import { setOrders, postOrder, setSelectedOrder } from "../ordersAction";
import { clearCartAsync } from "./Cart";

import { setNotification } from "../notificationAction";

export const getOrders = () => async (dispatch) => {
    try {
        dispatch(setNotification({message: "Loading orders...", state: "loading", stateType: "order"}));

        const response = await fetch(`http://localhost:3001/api/orders`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        });
    
        if (response.ok) {
            dispatch(setNotification({message: "Orders are now available!", state: "success", stateType: "order"}));
            const data = await response.json();
            dispatch(setOrders(data));
        } else {
            const error = await response.json();
            dispatch(setNotification({message: error.error, state: "error", stateType: "order"}));
        }
    } catch (error) {
        dispatch(setNotification({message: error, state: "error", stateType: "orders"}));
        console.error(error);
    }
};

export const sendOrder = () => async (dispatch, getState) => {
    try {
        dispatch(setNotification({message: "Sending order...", state: "loading", stateType: "order"}));

        const itemsFromCart = getState().cart;

        console.log("itemsFromCart", itemsFromCart);

        // Poistetaan image, koska POST ei halua imagea
        const updatedItemsFromCart = {
            items: itemsFromCart.items.map(item => {
                if ('image' in item.product) {
                    const { image, ...productWithoutImage } = item.product;
                    return {
                        ...item,
                        product: productWithoutImage
                    };
                }
                return item;
            })
        };

        console.log("itemsFromCart - without image", updatedItemsFromCart);

        const response = await fetch(`http://localhost:3001/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedItemsFromCart),
            credentials: "include"
        });
    
        if (response.ok) {
            dispatch(setNotification({message: "Order is sended!", state: "success", stateType: "order"}));
            const data = await response.json();
            
            console.log("Send order:", data);

            dispatch(postOrder(data));
            dispatch(clearCartAsync());

        } else {
            const error = await response.json();
            dispatch(setNotification({message: error.error, state: "error", stateType: "order"}));
        }
    } catch (error) {
        dispatch(setNotification({message: error, state: "error", stateType: "orders"}));
        console.error(error);
    }
};

export const getOrder = (orderId) => async (dispatch) => {
    try {
        dispatch(setNotification({message: "Loading order...", state: "loading", stateType: "order"}));

        const response = await fetch(`http://localhost:3001/api/orders/${orderId}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: "include"
        });
    
        if (response.ok) {
            dispatch(setNotification({message: "Order detail is now available!", state: "success", stateType: "order"}));
            const data = await response.json();
            dispatch(setSelectedOrder(data));
        } else {
            const error = await response.json();
            dispatch(setNotification({message: error.error, state: "error", stateType: "order"}));
        }
    } catch (error) {
        dispatch(setNotification({message: error, state: "error", stateType: "order"}));
        console.error(error);
    }
};