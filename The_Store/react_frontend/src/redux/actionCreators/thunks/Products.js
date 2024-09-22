import { setProducts } from "../productsAction";

import { setNotification } from "../notificationAction";

export const getProducts = () => async (dispatch) => {
    try {
        dispatch(setNotification({message: "Loading products...", state: "loading", stateType: "product"}));

        const response = await fetch(`http://localhost:3001/api/products`);
    
        if (response.ok) {
            dispatch(setNotification({message: "Products are loaded!", state: "success", stateType: "product"}));
            const data = await response.json();
            dispatch(setProducts(data));
        } else {
            const error = await response.json();
            dispatch(setNotification({message: error.error, state: "error", stateType: "product"}));
            console.error(error);
        }
    } catch (error) {
        dispatch(setNotification({message: error, state: "error", stateType: "product"}));
        console.error(error);
    }
};