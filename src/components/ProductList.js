import React from 'react';
import PropTypes from 'prop-types';
import ProductCard from './ProductCard';

const ProductList = ({ products, onAddToCart, onToggleFavorite }) => {
  return (
    <div className='card_container flex flex-wrap mx-auto justify-around mt-10'>
      {products.map((product) => (
        <ProductCard
          key={product.sku}
          product={product}
          onAddToCart={onAddToCart}
          onToggleFavorite={onToggleFavorite}
        />
      ))}
    </div>
  );
};

ProductList.propTypes = {
  products: PropTypes.array.isRequired,
  onAddToCart: PropTypes.func.isRequired,
  onToggleFavorite: PropTypes.func.isRequired,
};

export default ProductList;
