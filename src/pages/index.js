import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import Header from '../components/Header';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartProducts, setCartProducts] = useState([]);
  const [favoritesProducts, setFavoritesProducts] = useState([]); // Corrected variable name

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/products.json');

        if (!response.ok) {
          throw new Error(`Failed to fetch data (HTTP ${response.status})`);
        }

        const data = await response.json();

        if (!Array.isArray(data)) {
          throw new Error('Data format is not as expected');
        }

        setProducts(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const storedCartCount = parseInt(localStorage.getItem('cartCount')) || 0;
    const storedFavoritesCount = parseInt(localStorage.getItem('favoritesCount')) || 0;

    setCartCount(storedCartCount);
    setFavoritesCount(storedFavoritesCount);

    // Retrieve cart products from local storage
    const storedCartProducts = JSON.parse(localStorage.getItem('cartProducts')) || [];
    setCartProducts(storedCartProducts);

    const storedFavoriteProducts = JSON.parse(localStorage.getItem('favoriteProducts')) || [];
    setFavoritesProducts(storedFavoriteProducts); // Corrected variable name
  }, []);

  const handleAddToCart = (sku) => {
    setCartCount((prevCount) => {
      const newCount = prevCount + 1;
      localStorage.setItem('cartCount', newCount);
  
      const productToAdd = products.find((product) => product.sku === sku);

      setCartProducts((prevProducts) => {
        const updatedProducts = [...prevProducts, productToAdd];
        localStorage.setItem('cartProducts', JSON.stringify(updatedProducts));
        return updatedProducts;
      });
  
      return newCount;
    });
  };

  const handleToggleFavorite = (isFavorite, sku) => {
    if (isFavorite) {
      setFavoritesCount((prevCount) => Math.max(prevCount - 1, 0));
      const updatedFavoriteProducts = favoritesProducts.filter((product) => product.sku !== sku); // Corrected variable name
      localStorage.removeItem(`favorite_${sku}`);
      setFavoritesProducts(updatedFavoriteProducts); // Corrected variable name
      localStorage.setItem('favoriteProducts', JSON.stringify(updatedFavoriteProducts));
    } else {
      const productToAdd = products.find((product) => product.sku === sku);
  
      setFavoritesProducts((prevProducts) => {
        const updatedProducts = [...prevProducts, productToAdd];
        localStorage.setItem('favoriteProducts', JSON.stringify(updatedProducts));
        return updatedProducts;
      });
      setFavoritesCount((prevCount) => prevCount + 1);
    }
    localStorage.setItem('favoritesCount', favoritesCount + (isFavorite ? -1 : 1));
  };
  

  return (
    <>
      <div>
        <Header cartCount={cartCount} favoritesCount={favoritesCount} />
        {loading && <img src='https://c.tenor.com/0iK9a1WkT40AAAAC/loading-white.gif' className="text-center mx-auto mt-20" />}
        {error && <p className="text-center text-red-500">Error: {error}</p>}
        {!loading && !error && (
          <ProductList
            products={products}
            onAddToCart={handleAddToCart}
            onToggleFavorite={handleToggleFavorite}
          />
        )}
      </div>
    </>
  );
};

export default Home;
