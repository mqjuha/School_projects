import React from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { getProduct } from '../redux/actionCreators/thunks/Product';
import { useDispatch } from 'react-redux';
import Product from '../components/Product';
import { useEffect } from 'react';

function ProductPage() {
    const { productId } = useParams();
    //const dispatch = useDispatch();
    
    const products = useSelector(state => state.products);
    const product = products.find(product => product.id === productId);

    //const product = useSelector(state => state.product);

    /*useEffect(() => {
        dispatch(getProduct(productId));
        //return () => {}
    }, [product.id, product.name, product.price, product.description])*/

    return (
        <div>
            <h2>Product Page</h2>
            <Product
                key={product.id}
                product={product}
            /> 
        </div>
    );
}
  
export default ProductPage;