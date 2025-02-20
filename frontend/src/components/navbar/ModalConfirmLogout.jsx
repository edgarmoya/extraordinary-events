import { React, useState } from "react";
import Modal from "../Modal";

function ModalConfirmLogout({ isOpen, onClose, onLogout }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await onLogout();
    setIsLoading(false);
    onClose();
  };

  return (
    <div>
      <Modal isOpen={isOpen} title={"Confirmación"} onClose={onClose}>
        <div className="modal-body text-body-emphasis">
          ¿Está seguro de que desea cerrar la sesión?
        </div>
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            className="btn btn-danger"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalConfirmLogout;
