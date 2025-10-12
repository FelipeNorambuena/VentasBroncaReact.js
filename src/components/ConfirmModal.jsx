import React from 'react';

function ConfirmModal({ show, onConfirm, onCancel, title, message }) {
  if (!show) {
    return null;
  }

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1055 }}></div>
      <div className="modal fade show" style={{ display: 'block', zIndex: 1060 }} tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
              <button type="button" className="btn-close" onClick={onCancel} aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <p>{message}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={onCancel}>Cancelar</button>
              <button type="button" className="btn btn-danger" onClick={onConfirm}>Aceptar</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ConfirmModal;
