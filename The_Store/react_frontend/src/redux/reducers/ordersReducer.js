import { SET_ORDERS, ADD_ORDER } from "../constants";

const defaultState = [];

const ordersReducer = (state = defaultState, action) => {
    switch (action.type) {
        case SET_ORDERS:
            return action.payload;
        case ADD_ORDER:
            return [...state, action.payload];
        default:
            return state;
    }
};

export default ordersReducer;