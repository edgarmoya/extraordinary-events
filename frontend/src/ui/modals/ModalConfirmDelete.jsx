import React from "react";
import Modal from "./Modal";
import Spinner from "../Spinner";

function ModalConfirmDelete({ isOpen, onClose, onDelete, message, loading }) {
  const handleDelete = async () => {
    try {
      await onDelete();
      onClose();
    } catch (error) {
      console.log("Error al eliminar: ", error);
    }
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
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                Eliminando...
              </>
            ) : (
              "Eliminar"
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalConfirmDelete;
