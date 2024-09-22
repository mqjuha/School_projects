import { addProduct, removeProduct, updateProduct, setProduct } from "../productsAction";

import { setNotification } from "../notificationAction";

// admin
export const addNewProduct = (productData) => async (dispatch) => {
  try {
    dispatch(setNotification({message: "Loading...", state: "loading", stateType: "product"}));

    console.log(productData);

    const response = await fetch(`http://localhost:3001/api/products/`, {
        method: 'POST',
        body: JSON.stringify({ name: productData.name, price: productData.price, description: productData.description }),
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: "include",
    });

    if (response.ok) {
      dispatch(setNotification({message: "The product has been added!", state: "success", stateType: "product"}));
      const newProduct = await response.json();
      console.log(newProduct);
      dispatch(addProduct(newProduct));
    }
    else {
      const error = await response.json();
      dispatch(setNotification({message: error.error, state: "error", stateType: "product"}));
      console.error('Failed to add new product:', error);
    }
  } catch (error) {
    dispatch(setNotification({message: error, state: "error", stateType: "product"}));
    console.error('Failed to add new product:', error);
  }
};

export const modifyProduct = (productId, updatedProductData) => async (dispatch) => {
  try {

    dispatch(setNotification({message: "Submitig...", state: "loading", stateType: "product"}));

    const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'PUT',
        body: JSON.stringify({ price: updatedProductData.price, name: updatedProductData.name, description: updatedProductData.description }),
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    });

    if (response.ok) {
      const updatedProduct = await response.json();
      console.log(productId, updatedProduct);
      dispatch(setNotification({message: "The product has been updated!", state: "success", stateType: "product"}));
      dispatch(updateProduct({ productId, updatedProduct }));
    }
    else {
      const error = await response.json();
      dispatch(setNotification({message: error.error, state: "error", stateType: "product"}));
      console.error('Failed to update product:', error);
    }  
  } catch (error) {
    dispatch(setNotification({message: error, state: "error", stateType: "product"}));
    console.error('Failed to update product:', error);
  }
};

export const deleteProduct = (productId) => async (dispatch) => {
  try {

    dispatch(setNotification({message: "Deleteting...", state: "loading", stateType: "product"}));

    const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: "include"
    });

    if (response.ok) {
      dispatch(setNotification({message: "The product has been deleted!", state: "success", stateType: "product"}));
      dispatch(removeProduct(productId));
    }
    else {
      const error = await response.json();
      dispatch(setNotification({message: error.error, state: "error", stateType: "product"}));
      console.error('Failed to delete product:', error.error);
    } 
  } catch (error) {
    dispatch(setNotification({message: error, state: "error", stateType: "product"}));
    console.error('Failed to delete product:', error);
  }
};

export const getProduct = (productId) => async (dispatch) => {
  try {

    const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        const product = await response.json();
        dispatch(setProduct(product));
    }
    else {
        console.error('Failed to get product:', error);
    } 
  } catch (error) {
    console.error('Failed to get product:', error);
  }
};