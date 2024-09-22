import React, { useState } from 'react';
import { addNewProduct } from '../redux/actionCreators/thunks/Product';
import { useDispatch } from 'react-redux';

const NewProduct = ({ onClose }) => {

    const [name, setName] = useState("");
    const [price, setPrice] = useState(0);
    const [description, setDescription] = useState("");

    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addNewProduct({ name, price, description }))
            .then(() => {
                onClose();
            });
    };
    
    const handleCancel = () => {
        onClose();
    };

    return (
        <div data-testid="form-container">
            <form onSubmit={handleSubmit}>

                <label>
                    Name: 
                    <input
                    type="text"
                    onChange={(e) => setName(e.target.value)}
                    data-testid="name-input"
                    />
                </label>

                <label>
                    Price:
                    <input
                    type="number"
                    onChange={(e) => setPrice(e.target.value)}
                    data-testid="price-input"
                    />
                </label>

                <label>
                    Description:
                    <input
                    onChange={(e) => setDescription(e.target.value)}
                    data-testid="description-input"
                    />
                </label>

                <button type="submit" data-testid="submit">Submit</button>
                <button type="button" onClick={handleCancel} data-testid="cancel">Cancel</button>
            </form>

        </div>

    );
};

export default NewProduct;