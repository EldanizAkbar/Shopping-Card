import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ConfirmationModal from './ConfirmationModal';
import Link from 'next/link';

const ProductCard = ({ product, onAddToCart, onToggleFavorite }) => {
  const [isAddedToCart, setIsAddedToCart] = useState(localStorage.getItem(`cart_${product.sku}`) === 'true');
  const [isFavorite, setIsFavorite] = useState(localStorage.getItem(`favorite_${product.sku}`) === 'true');
  const [showModal, setShowModal] = useState(false);

  const addToCart = () => {
    setShowModal(true);
  };

  const confirmAddToCart = () => {
    setIsAddedToCart(true);
    localStorage.setItem(`cart_${product.sku}`, 'true');
    setShowModal(false);
    onAddToCart(product.sku); 
  };

  const cancelAddToCart = () => {
    setShowModal(false);
  };

  const toggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    localStorage.setItem(`favorite_${product.sku}`, !isFavorite ? 'true' : 'false');
    onToggleFavorite(isFavorite, product.sku); 
  };

  return (
    <div className="w-60 rounded overflow-hidden shadow-lg m-4 text-center product_card pb-4">
      <img className="mx-auto mt-3" src={product.image} alt={product.title} />
      <div className="px-2 pb-1">
        <div className="font-bold text-xl mb-2">{product.title}</div>
        <p className="text-gray-700 text-base">Price: <strong>${product.price}</strong></p>
        <p className="text-gray-700 text-base">SKU:  <strong>{product.sku}</strong></p>
        <p className="text-gray-700 text-base">Color:  <strong>{product.color}</strong></p>
      </div>
      <div className="px-6 pt-1">
        <button
          onClick={addToCart}
          className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 mb-3 rounded ${
            isAddedToCart && 'bg-green-500 hover:bg-green-500 cursor-not-allowed'
          }`}
          disabled={isAddedToCart}
        >
          {isAddedToCart ? 'In Cart' : 'Add to Cart'}
        </button>
        <button
          onClick={toggleFavorite}
          className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-1 px-2 rounded ml-2 ${
            isFavorite && 'bg-yellow-700'
          }`}
        >
          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        </button>
        
        <Link href={`/products/${product.sku}`} className='block bg-gray-500 hover:bg-gray-700 text-white font-bold py-2  rounded-full mt-4'>View More Detail</Link>
      </div>
      <ConfirmationModal
        isOpen={showModal}
        onClose={cancelAddToCart}
        onConfirm={confirmAddToCart}
        productName={product.title}
        modalHeader='Add to Cart Confirmation'
        modalQuestion={`Are you sure you want to add ${product.title}to your shopping cart?`}
      />
    </div>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

export default ProductCard;
