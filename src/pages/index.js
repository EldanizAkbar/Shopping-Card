import React, { useState, useEffect } from 'react';
import ProductList from '../components/ProductList';
import Header from '../components/Header';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
  }, []);

  const handleAddToCart = () => {
    setCartCount((prevCount) => prevCount + 1);
    localStorage.setItem('cartCount', cartCount + 1);
  };

  const handleToggleFavorite = (isFavorite) => {
    if (isFavorite) {
      setFavoritesCount((prevCount) => Math.max(prevCount - 1, 0));
    } else {
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
        {!loading && !error && <ProductList products={products} onAddToCart={handleAddToCart} onToggleFavorite={handleToggleFavorite} />}
      </div>
    </>
  );
};

export default Home;
