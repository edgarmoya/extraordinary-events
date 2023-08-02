import React from "react";

function Modal({ isOpen, title, onClose, children }) {
  return (
    <div
      className={`modal fade ${isOpen ? "show" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ display: isOpen ? "block" : "none" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title text-body-emphasis">{title}</h5>
            <button className="btn btn-close" onClick={onClose} />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
