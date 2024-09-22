import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { deleteProduct } from '../redux/actionCreators/thunks/Product';
import { addToCartAsync } from '../redux/actionCreators/thunks/Cart';
import { Link, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { dataTestIds } from '../tests/constants/components';

const Product = ({ product }) => {

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const userRole = useSelector(state => state.auth.user.role);
  
    const handleDelete = () => {
        dispatch(deleteProduct(product.id))
            .then(() => {
                navigate("/products");
            })
    };
  
    const handleModify = () => {
        navigate(`/products/${product.id}/modify`);
    };
  
    const handleAddToCart = () => {
        dispatch(addToCartAsync(product));
    };

    const isProductPage = location.pathname.includes('/products/');

    return (
        <div data-testid="inspect-container">
            <h3 data-testid="name-value">{product.name}</h3>

            {isProductPage && <p data-testid="description-value">Description: {product.description}</p>}
            
            <p data-testid="price-value">Price: {product.price}</p>
            
            {!isProductPage && <Link data-testid={dataTestIds.linkId.inspect(product.id)} to={`/products/${product.id}`}>See details</Link>}

            { userRole === "admin" ? (
                <div>
                <button onClick={handleDelete} data-testid='delete'>Delete</button>
                <button onClick={handleModify} data-testid='modify'>Modify</button>
                </div>
            ) : (
                <button onClick={handleAddToCart} data-testid='add'>Add to Cart</button>
            )}
        </div>
    );
};

export default Product;
