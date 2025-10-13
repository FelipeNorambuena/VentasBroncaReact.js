import React, { useContext } from 'react';
import { CartContext } from '../context/CartContext';

function Notification() {
  const { notification } = useContext(CartContext);

  if (!notification) {
    return null;
  }

  return (
    <div 
      className={`alert alert-${notification.type === 'error' ? 'danger' : notification.type} alert-dismissible fade show position-fixed`}
      style={{ top: '100px', right: '20px', zIndex: 1060, minWidth: '300px' }}
      role="alert"
    >
      {notification.message}
      <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  );
}

export default Notification;
