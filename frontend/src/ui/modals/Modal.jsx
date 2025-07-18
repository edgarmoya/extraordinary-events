function Modal({ isOpen, title, onClose, size, icon, children }) {
  return (
    <div>
      {isOpen && (
        <div className="backdrop z-3">
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            data-bs-backdrop="static"
            data-bs-keyboard="false"
          >
            <div className={`modal-dialog ${size}`}>
              <div className="modal-content">
                <div className="modal-header">
                  <div className="d-flex align-items-center gap-2">
                    {icon && <span>{icon}</span>}
                    <h5 className="modal-title text-body-emphasis">{title}</h5>
                  </div>
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
