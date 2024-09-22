import * as React from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';
import { getProduct, modifyProduct } from '../redux/actionCreators/thunks/Product';
import { useNavigate } from 'react-router-dom';
import { setNotification } from '../redux/actionCreators/notificationAction';
import { useEffect } from 'react';
import { getProducts } from '../redux/actionCreators/thunks/Products';

function ModifyPage() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { productId } = useParams();
    //const products = useSelector(state => state.products);
    //const product = products.find(product => product.id === productId);

    const product = useSelector(state => state.product);

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        dispatch(getProduct(productId));
        setName(product.name);
        setDescription(product.description);
        setPrice(product.price)
        return () => {}
    }, [product.id, product.name, product.price, product.description])

    //console.log(typeof product.price);

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log(name, description, price);

        dispatch(modifyProduct(product.id, { name, description, price }))
        .then(() => {
            dispatch(getProducts()).then(() => {
                navigate(-1);
            });
        /*if ( price < 1 ){
            dispatch(setNotification({ message: "Price must be at least 1", state: "error", stateType: "product" }));
        }
        else {
            dispatch(modifyProduct(product.id, { name, description, price }))
            .then(() => {
                navigate(-1);*/
        });
    };
    
    const handleCancel = () => {
        navigate(-1);
    };

    //dispatch(setNotification({ message: null, state: null, stateType: null }));

    return (
        <div data-testid="form-container">
            <h2>Modify Product</h2>
            <form onSubmit={handleSubmit}>

                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                data-testid="name-input"
                />

                <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                data-testid="price-input"
                />

                <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                data-testid="description-input"
                />

                <button type="submit" data-testid="submit">Submit</button>
                <button type="button" onClick={handleCancel} data-testid="cancel">Cancel</button>
            </form>
        </div>
    );
}
  
export default ModifyPage;