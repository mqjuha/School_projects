import * as React from 'react';
import Products from '../components/Products.jsx';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import NewProduct from '../components/NewProduct.jsx';

function ProductsPage() {
  const [isOpen, setIsOpen] = useState(false);

  const userRole = useSelector(state => state.auth.user.role);

  const toggleNewProductForm = () => {
      setIsOpen(!isOpen);
  };

  return (
    <div data-testid="main-container">
      <h2>Products</h2>
      {userRole === 'admin' && (
        <div>
          <button data-testid="add" onClick={toggleNewProductForm}>Add New Product</button>
        </div>
      )}
      {isOpen && (
        <NewProduct onClose={toggleNewProductForm}></NewProduct>
      )}
      <Products></Products>
    </div>
  );
}
  
export default ProductsPage;

//data-testid="add"
//data-testid="main-container"