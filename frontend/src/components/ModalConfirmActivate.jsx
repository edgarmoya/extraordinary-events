import { React, useState } from "react";
import Modal from "./Modal";

function ModalConfirmActivate({
  isOpen,
  onClose,
  onActivate,
  message,
  activated,
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleActivate = async () => {
    setIsLoading(true);
    await onActivate();
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
            onClick={handleActivate}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : activated ? "Inactivar" : "Activar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalConfirmActivate;
