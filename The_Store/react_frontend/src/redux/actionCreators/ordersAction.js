import { SET_ORDERS, ADD_ORDER, SET_SELECTED_ORDER } from "../constants";

export const setOrders = (orders) => ({
    type: SET_ORDERS,
    payload: orders
});

export const postOrder = (orders) => ({
    type: ADD_ORDER,
    payload: orders,
});

export const setSelectedOrder = (order) => ({
    type: SET_SELECTED_ORDER,
    payload: order
})