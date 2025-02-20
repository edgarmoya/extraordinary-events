import React from "react";

function Modal({ isOpen, title, onClose, size, children }) {
  return (
    <div>
      {isOpen && (
        <div className="backdrop z-3">
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
            aria-hidden="true"
          >
            <div className={`modal-dialog ${size}`}>
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-body-emphasis">{title}</h5>
                  <button className="btn btn-close" onClick={onClose} />
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Modal;
