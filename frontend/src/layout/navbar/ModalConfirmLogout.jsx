import { useState } from "react";
import Modal from "../../ui/modals/Modal";
import Spinner from "../../ui/Spinner";
import { QuestionIcon } from "../../ui/icons";

function ModalConfirmLogout({ isOpen, onClose, onLogout }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await onLogout();
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
        <div className="modal-body text-body-emphasis">
          ¿Está seguro de que desea cerrar la sesión?
        </div>
        <div className="modal-footer">
          <button
            className="btn btn-danger"
            onClick={handleLogout}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Spinner />
                Cerrando sesión...
              </>
            ) : (
              "Sí"
            )}
          </button>
          <button type="button" onClick={onClose} className="btn btn-secondary">
            No
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalConfirmLogout;
