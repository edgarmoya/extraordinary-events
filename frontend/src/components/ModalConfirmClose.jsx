import { React, useState } from "react";
import Modal from "./ui/Modal";

function ModalConfirmClose({ isOpen, onClose, onAction, message }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAction = async () => {
    setIsLoading(true);
    await onAction();
    onClose();
    setIsLoading(false);
  };

  return (
    <div>
      <Modal isOpen={isOpen} title={"Confirmación"} onClose={onClose}>
        <div className="modal-body text-body-emphasis">{message}</div>
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            className="btn btn-danger"
            onClick={handleAction}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Confirmar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalConfirmClose;
