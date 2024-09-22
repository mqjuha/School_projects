import { ADD_TO_CART, REDUCE_QUANTITY, ADD_QUANTITY, CLEAR_CART } from '../constants';
  
export const addToCart = (product) => {
    return {
        type: ADD_TO_CART,
        payload: product
    }
};
  
export const reduce = (productId) => {
    return {
        type: REDUCE_QUANTITY,
        payload: productId
    }
};
  
export const increase = (productId) => {
    return {
        type: ADD_QUANTITY,
        payload: productId
    }
};
  
export const clearCart = () => {
    return {
        type: CLEAR_CART,
    }
};
  