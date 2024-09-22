import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from "../redux/actionCreators/thunks/Products";
import Product from './Product';
import { dataTestIds } from '../tests/constants/components';

export const Products = () => {

	const dispatch = useDispatch();
	const products = useSelector((state) => state.products);
  
	useEffect(() => {
		// Tarkistetaan, onko tuotteet jo ladattu
		if (!products.length) {
		  	dispatch(getProducts());
		}
	}, [dispatch, products]);

	return (
	  <div>
		<h2>List of products</h2>
		{Array.isArray(products) && products.length > 0 ? (
                <ul data-testid="products">
                    {products.map((product) => (
						<li key={product.id} data-testid={dataTestIds.containerId.listItem(product.id)}>
							<Product
                            product={product}
                        	/>
						</li>
                    ))}
                </ul>
            ) : (
                <p data-testid="empty-container">No products available</p>
        )}
	  </div>
	);
};

export default Products;

//data-testid="main-container"