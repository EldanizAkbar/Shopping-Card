import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Header from '@/components/Header';

const Favorite = () => {
  const [favoritesProducts, setFavoritesProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedFavoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
      setFavoritesProducts(storedFavoriteProducts);

      const storedCartCount = parseInt(localStorage.getItem('cartCount')) || 0;
      const storedFavoritesCount = parseInt(localStorage.getItem('favoritesCount')) || 0;

      setCartCount(storedCartCount);
      setFavoritesCount(storedFavoritesCount);
    }
  }, []);

  const handleRemoveFromFavorites = (sku) => {
    const updatedFavoritesProducts = favoritesProducts.filter((product) => product.sku !== sku);

    localStorage.removeItem(`favorite_${sku}`);

    setFavoritesProducts(updatedFavoritesProducts);
    localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavoritesProducts));

    setFavoritesCount((prevCount) => Math.max(prevCount - 1, 0));
    localStorage.setItem('favoritesCount', Math.max(favoritesCount - 1, 0));
  };

  return (
    <>
      <Header cartCount={cartCount} favoritesCount={favoritesCount} />
      <div>
        <h2 className="text-4xl font-bold mb-4 text-center mt-3">Favorites</h2>
        {favoritesProducts && favoritesProducts.length === 0 ? (
          <p className='text-2xl font-bold mb-4 text-center mt-3'><i>You do not have favorite products.</i></p>
        ) : (
          <div className='flex justify-around flex-wrap carts_container mx-auto'>
            {favoritesProducts?.map((product) => (
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
                    onClick={() => handleRemoveFromFavorites(product.sku)}
                    className="py-2 px-2 mt-5 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700"
                  >
                    Remove From Favorites
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

Favorite.propTypes = {
  favoritesProducts: PropTypes.array,
};

export default Favorite;
