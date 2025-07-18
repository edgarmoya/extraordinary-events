import Modal from "./Modal";
import Spinner from "../Spinner";
import { QuestionIcon } from "../icons";

function ModalConfirmActivate({
  isOpen,
  onClose,
  onActivate,
  message,
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
          onClick={handleActivate}
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner />
              Guardando...
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
  );
}

export default ModalConfirmActivate;
