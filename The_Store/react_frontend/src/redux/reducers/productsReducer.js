import { SET_PRODUCTS, ADD_PRODUCT, UPDATE_PRODUCT, REMOVE_PRODUCT } from "../constants";

const initialState = []; // products

const productsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCTS:
        return action.payload;
    case ADD_PRODUCT:
      return [...state, action.payload];
    case UPDATE_PRODUCT:
      return state.map(product =>
          product.id === action.payload.productId ? action.payload.updatedProduct : product
        );
    case REMOVE_PRODUCT:
      return state.filter(product => product.id !== action.payload);
    default:
      return state;
  }
};

export default productsReducer;