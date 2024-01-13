import React from 'react';
import PropTypes from 'prop-types';

const ConfirmationModal = ({ isOpen, onClose, onConfirm, productName }) => {
  const overlayStyle = {
    display: isOpen ? 'block' : 'none',
  };

  const modalStyle = {
    transform: isOpen,
    opacity: isOpen ? '1' : '0',
  };

  return (
    <div className="modal-overlay" style={overlayStyle} onClick={onClose}>
      <div className="modal mx-auto mt-20" style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h2 className='text-left mb-5'><strong>Add to Cart Confirmation</strong></h2>
        <p className='mb-5'>Are you sure you want to add <strong>{productName}</strong> to your shopping cart?</p>
        <button className="confirm-btn" onClick={onConfirm}>Yes</button>
        <button className="cancel-btn" onClick={onClose}>No</button>
      </div>
    </div>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  productName: PropTypes.string.isRequired,
};

export default ConfirmationModal;
