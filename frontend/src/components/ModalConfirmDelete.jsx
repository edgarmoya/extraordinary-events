import { React, useState } from "react";
import Modal from "./Modal";

function ModalConfirmDelete({ isOpen, onClose, onDelete, message }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    setIsLoading(true);
    await onDelete();
    setIsLoading(false);
    onClose();
  };

  return (
    <div>
      <Modal isOpen={isOpen} title={"Confirmación"} onClose={onClose}>
        <div className="modal-body">{message}</div>
        <div className="modal-footer">
          <button type="button" onClick={onClose} className="btn btn-secondary">
            Cancelar
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading ? "Eliminando..." : "Eliminar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalConfirmDelete;
