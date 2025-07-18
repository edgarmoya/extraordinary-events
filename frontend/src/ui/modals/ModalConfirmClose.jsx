import { useState } from "react";
import Modal from "./Modal";
import { QuestionIcon } from "../icons";

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
      <Modal
        isOpen={isOpen}
        title={"Confirmación"}
        icon={<QuestionIcon color="#a0a0a0" size="1.4rem" />}
        onClose={onClose}
      >
        <div className="modal-body text-body-emphasis">{message}</div>
        <div className="modal-footer">
          <button
            className="btn btn-danger"
            onClick={handleAction}
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : "Sí"}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            No
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalConfirmClose;
