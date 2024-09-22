import { SET_PRODUCTS, ADD_PRODUCT, UPDATE_PRODUCT, REMOVE_PRODUCT, SET_PRODUCT } from '../constants';

export const setProducts = (products) => {
  return {
    type: SET_PRODUCTS,
    payload: products
}};

export const addProduct = (product) => ({
  type: ADD_PRODUCT,
  payload: product,
});

export const updateProduct = (productId, updatedProduct) => ({
  type: UPDATE_PRODUCT,
  payload: { productId, updatedProduct },
});

export const removeProduct = (productId) => ({
  type: REMOVE_PRODUCT,
  payload: productId,
});

export const setProduct = (product) => ({
  type: SET_PRODUCT,
  payload: product,
});