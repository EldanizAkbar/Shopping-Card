import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';
import ConfirmationModal from '@/components/ConfirmationModal';

export default function Product(props) {
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cartProducts, setCartProducts] = useState([]);
  const [favoritesProducts, setFavoritesProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const storedCartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    const storedFavoritesCount = parseInt(localStorage.getItem('favoritesCount')) || 0;

    setCartCount(storedCartCount);
    setFavoritesCount(storedFavoritesCount);

    const storedIsAddedToCart = localStorage.getItem(`cart_${props.sku}`);
    setIsAddedToCart(storedIsAddedToCart === 'true');

    const storedIsFavorite = localStorage.getItem(`favorite_${props.sku}`);
    setIsFavorite(storedIsFavorite === 'true');

    // Retrieve cart products from local storage
    const storedCartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
    setCartProducts(storedCartProducts);
  }, [props.sku]);

  const handleAddToCart = () => {
    setShowModal(true); // Open the confirmation modal
  };

  const confirmAddToCart = () => {
    // If the user clicks "Yes" in the modal
    setCartCount((prevCount) => prevCount + 1);
    localStorage.setItem('cartCount', cartCount + 1);
    setIsAddedToCart(true);
    localStorage.setItem(`cart_${props.sku}`, 'true');

    const productToAdd = props;

    setCartProducts((prevProducts) => {
      const updatedProducts = [...prevProducts, productToAdd];
      localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
      return updatedProducts;
    });

    setShowModal(false); // Close the modal
  };

  const cancelAddToCart = () => {
    // If the user clicks "No" in the modal
    setShowModal(false); // Close the modal
  };

  const handleToggleFavorite = () => {
    const newIsFavorite = !isFavorite;
    setIsFavorite(newIsFavorite);
    localStorage.setItem(`favorite_${props.sku}`, newIsFavorite ? 'true' : 'false');
  
    if (newIsFavorite) {
      // Add to favorites
      const productToAdd = { ...props };
      setFavoritesProducts((prevProducts) => {
        const updatedProducts = [...prevProducts, productToAdd];
        localStorage.setItem('favoriteProducts', JSON.stringify(updatedProducts));
        return updatedProducts;
      });
    } else {
      // Remove from favorites
      const updatedFavoriteProducts = favoritesProducts.filter((product) => product.sku !== props.sku);
      localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavoriteProducts));
      setFavoritesProducts(updatedFavoriteProducts);
    }
  
    // Update favorites count and local storage
    setFavoritesCount((prevCount) => (newIsFavorite ? prevCount + 1 : prevCount - 1));
    localStorage.setItem('favoritesCount', newIsFavorite ? favoritesCount + 1 : favoritesCount - 1);
  };

  return (
    <>
      <Header cartCount={cartCount} favoritesCount={favoritesCount} />
      <div className="container mx-auto p-8">
        <div className="bg-white shadow-md p-6 rounded-md text-center product_conta mx-auto">
          <img src={props.image} alt={props.title} className='mx-auto mb-10' />  
          <h1 className="text-3xl font-bold mb-4">{props.title}</h1>
          <p className="text-lg mb-2">Price: <strong>${props.price}</strong></p>
          <p className="text-lg mb-2">SKU: <strong>{props.sku}</strong></p>
          <p className="text-lg mb-2">Color: <strong>{props.color}</strong></p>
          <p className="text-lg mb-4"><i>{props.description}</i></p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleAddToCart}
              className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ${
                isAddedToCart && 'bg-green-500 hover:bg-green-500 cursor-not-allowed'
              }`}
              disabled={isAddedToCart}
            >
              {isAddedToCart ? 'In Cart' : 'Add to Cart'}
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded ${
                isFavorite && 'bg-yellow-700'
              }`}
            >
              {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            </button>
          </div>
          <Link href="/" className='text-blue-500 hover:underline mt-4 block'>Back to Home</Link>
        </div>
      </div>
      <ConfirmationModal
        isOpen={showModal}
        onClose={cancelAddToCart}
        onConfirm={confirmAddToCart}
        productName={props.title}
        modalHeader='Add to Cart Confirmation'
        modalQuestion={`Are you sure you want to add ${props.title} to your shopping cart?`}
      />
    </>
  );
}

export const getServerSideProps = async ({ query }) => {
  const response = await fetch('https://online-store-tau-fawn.vercel.app/products.json');
  const data = await response.json();

  const product = data.find((product) => product.sku === query.id);

  return {
    props: product || {},
  };
};
