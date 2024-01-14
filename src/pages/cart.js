import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Header from '@/components/Header';
import ConfirmationModal from '@/components/ConfirmationModal';

const Cart = () => {
  const [cartProducts, setCartProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showModal, setShowModal] = useState(false); // State for showing the confirmation modal
  const [selectedProduct, setSelectedProduct] = useState(null); // State to track the product being removed

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
      setCartProducts(storedCartProducts);

      const storedCartCount = parseInt(localStorage.getItem('cartCount')) || 0;
      const storedFavoritesCount = parseInt(localStorage.getItem('favoritesCount')) || 0;

      setCartCount(storedCartCount);
      setFavoritesCount(storedFavoritesCount);
    }
  }, []);

  // Function to handle opening the confirmation modal for a product
  const openConfirmationModal = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  // Function to handle the removal of a product from the cart
  const handleRemoveFromCart = () => {
    if (selectedProduct) {
      const sku = selectedProduct.sku;
      const updatedCartProducts = cartProducts.filter((product) => product.sku !== sku);

      localStorage.removeItem(`cart_${sku}`);

      // Update state and localStorage
      setCartProducts(updatedCartProducts);
      localStorage.setItem('cartProducts', JSON.stringify(updatedCartProducts));

      // Update cart count
      setCartCount((prevCount) => Math.max(prevCount - 1, 0));
      localStorage.setItem('cartCount', Math.max(cartCount - 1, 0));

      // Close the confirmation modal
      setShowModal(false);
    }
  };

  // Function to handle canceling the removal
  const cancelRemoveFromCart = () => {
    setShowModal(false);
  };

  return (
    <>
      <Header cartCount={cartCount} favoritesCount={favoritesCount} />
      <div>
        <h2 className="text-4xl font-bold mb-4 text-center mt-3">Cart</h2>
        {cartProducts && cartProducts.length === 0 ? (
          <p className='text-2xl font-bold mb-4 text-center mt-3'><i>Your cart is empty.</i></p>
        ) : (
          <div className='flex justify-around flex-wrap carts_container mx-auto'>
            {cartProducts?.map((product) => (
              <div key={product.sku} className="w-80 rounded overflow-hidden shadow-lg m-4 text-center product_card flex items-center p-5 justify-around">
                <div>
                  <img className="mx-auto" src={product.image} alt={product.title} />
                </div>
                <div className="px-2 pb-1">
                  <div className="font-bold text-xl mb-2">{product.title}</div>
                  <p className="text-gray-700 text-base">Price: <strong>${product.price}</strong></p>
                  <p className="text-gray-700 text-base">SKU:  <strong>{product.sku}</strong></p>
                  <p className="text-gray-700 text-base">Color:  <strong>{product.color}</strong></p>
                  <button
                    onClick={() => openConfirmationModal(product)}
                    className="py-2 px-2 mt-5 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Remove From Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmationModal
        isOpen={showModal}
        onClose={cancelRemoveFromCart}
        onConfirm={handleRemoveFromCart}
        productName={selectedProduct ? selectedProduct.title : ''}
        modalHeader='Remove from Cart Confirmation'
        modalQuestion={`Are you sure you want to remove ${selectedProduct ? selectedProduct.title : ''} from your shopping cart?`}
      />
    </>
  );
};

Cart.propTypes = {
  cartProducts: PropTypes.array,
};

export default Cart;
