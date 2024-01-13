import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function Product(props) {
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [isAddedToCart, setIsAddedToCart] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const storedCartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    const storedFavoritesCount = parseInt(localStorage.getItem('favoritesCount')) || 0;

    setCartCount(storedCartCount);
    setFavoritesCount(storedFavoritesCount);

    const storedIsAddedToCart = localStorage.getItem(`cart_${props.sku}`);
    setIsAddedToCart(storedIsAddedToCart === 'true');

    const storedIsFavorite = localStorage.getItem(`favorite_${props.sku}`);
    setIsFavorite(storedIsFavorite === 'true');
  }, [props.sku]);

  const handleAddToCart = () => {
    if (!isAddedToCart) {
      setCartCount((prevCount) => prevCount + 1);
      localStorage.setItem('cartCount', cartCount + 1);
      setIsAddedToCart(true);
      localStorage.setItem(`cart_${props.sku}`, 'true');
    }
  };

  const handleToggleFavorite = () => {
    setIsFavorite((prev) => !prev);
    localStorage.setItem(`favorite_${props.sku}`, !isFavorite ? 'true' : 'false');
    setFavoritesCount((prevCount) => (isFavorite ? prevCount - 1 : prevCount + 1));
    localStorage.setItem('favoritesCount', isFavorite ? favoritesCount - 1 : favoritesCount + 1);
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
