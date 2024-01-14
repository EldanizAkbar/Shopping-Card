import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus, faHeart } from '@fortawesome/free-solid-svg-icons';
import Link from 'next/link';

const Header = ({ cartCount, favoritesCount }) => {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="container flex justify-between mx-auto">
        <div>
          <Link href="/" className="text-2xl font-bold">Online Store
          </Link>
        </div>
        <div className="flex items-center">
          <div className="mr-4">
            <Link href="/cart">
                <FontAwesomeIcon icon={faCartPlus} size="lg" />
                <span className="ml-1">{cartCount}</span>
            </Link>
          </div>
          <div>
          <Link href="/favorite">
            <FontAwesomeIcon icon={faHeart} size="lg" />
            <span className="ml-1">{favoritesCount}</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

Header.propTypes = {
  cartCount: PropTypes.number.isRequired,
  favoritesCount: PropTypes.number.isRequired,
};

export default Header;
