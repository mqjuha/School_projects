import { addToCart, reduce, increase, clearCart } from '../cartAction';

// cart - no backend requests, but user should be notified when items are added/removed from the cart (both success events)
import { setNotification } from '../notificationAction';

export const addToCartAsync = (product) => (dispatch) => {
    dispatch(addToCart(product));
    dispatch(setNotification({message: "Product is added to the cart.", state: "success", stateType: "cart"}));
};

export const reduceQuantity = (productId) => (dispatch) => {
    dispatch(setNotification({message: "You have reduced the quantity.", state: "success", stateType: "cart"}));
    dispatch(reduce(productId));
};

export const increaseQuantity = (productId) => (dispatch) => {
    dispatch(setNotification({message: "You have increased the quantity.", state: "success", stateType: "cart"}));
    dispatch(increase(productId));
};

export const clearCartAsync = () => (dispatch) => {
    //dispatch(setNotification({message: "The cart is cleared.", state: "success", stateType: "cart"}));
    dispatch(clearCart());
};
