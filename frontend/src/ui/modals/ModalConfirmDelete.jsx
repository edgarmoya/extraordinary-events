import Modal from "./Modal";
import Spinner from "../Spinner";
import { QuestionIcon } from "../icons";

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
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner />
                Eliminando...
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

export default ModalConfirmDelete;
