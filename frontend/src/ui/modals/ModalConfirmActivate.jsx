import React from "react";
import Modal from "./Modal";
import Spinner from "../Spinner";

function ModalConfirmActivate({
  isOpen,
  onClose,
  onActivate,
  message,
  activated,
  loading,
}) {
  const handleActivate = async () => {
    try {
      await onActivate();
      onClose();
    } catch (error) {
      console.log("Error al cambiar el estado: ", error);
    }
  };

  return (
    <Modal isOpen={isOpen} title={"Confirmación"} onClose={onClose}>
      <div className="modal-body text-body-emphasis">{message}</div>
      <div className="modal-footer">
        <button type="button" onClick={onClose} className="btn btn-secondary">
          Cancelar
        </button>
        <button
          className="btn btn-danger"
          onClick={handleActivate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner />
              Guardando...
            </>
          ) : activated ? (
            "Inactivar"
          ) : (
            "Activar"
          )}
        </button>
      </div>
    </Modal>
  );
}

export default ModalConfirmActivate;
