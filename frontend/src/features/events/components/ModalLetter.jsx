import { useState, useEffect } from "react";
import Typewriter from "./Typewriter";
import Modal from "../../../ui/modals/Modal";
import { showErrorToast, showSuccessToast } from "../../../utils/toastUtils";
import AiService from "../../../api/ai.api";
import Skeleton from "../../../ui/skeletons/Skeleton";
import { WarningIcon } from "../../../ui/icons";

function ModalLetter({ isOpen, onClose, title, size, eventId }) {
  const [letter, setLetter] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  //* Función para copiar al portapapeles
  const handleClipboard = async () => {
    try {
      const cleanText = letter.replace(/\*/g, "");
      await navigator.clipboard.writeText(cleanText);
      showSuccessToast("Carta copiada al portapapeles");
    } catch (err) {
      showErrorToast("No se pudo copiar al portapapeles");
      console.error(err);
    }
  };

  //* Al abrir el modal, obtener la carta
  useEffect(() => {
    if (!isOpen || !eventId) return;

    setLoading(true);
    AiService.ask(eventId)
      .then((response) => {
        setLetter(response.data.answer || "");
      })
      .catch((error) => {
        const msg = error.response?.data?.detail || "Error desconocido";
        setError(msg);
        console.log(msg);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isOpen, eventId]);

  return (
    <Modal isOpen={isOpen} title={title} size={size} onClose={onClose}>
      <div className="modal-body text-body-emphasis">
        {loading ? (
          <Skeleton>
            <Skeleton.Text width="70%" className="mt-0" />
            <Skeleton.Rectangle height="120px" className="mt-2" />
            <Skeleton.Rectangle height="140px" className="mt-2" />
            <Skeleton.Text width="30%" className="mt-2" />
          </Skeleton>
        ) : letter ? (
          <>
            <div className="alert alert-warning px-3 py-2 d-flex gap-3 align-items-center">
              <WarningIcon size="2.2rem" />
              <div>
                <span>
                  <strong>¡Atención!</strong> La siguiente información ha sido
                  generada automáticamente utilizando inteligencia artificial.
                  Revíse la carta cuidadosamente antes de su uso oficial.
                </span>
              </div>
            </div>

            <Typewriter text={letter} speed={10} />
          </>
        ) : (
          <div className="alert alert-danger px-3 py-2 d-flex gap-3 align-items-center">
            <WarningIcon size="2.2rem" />
            <div>
              <span>
                <strong>Upss!</strong> Ha ocurrido un error al generar el texto
                con inteligencia artificial. Por favor, intente nuevamente o
                contacte al administrador. <strong>{error}</strong>
              </span>
            </div>
          </div>
        )}
      </div>
      <div className="modal-footer">
        <button type="button" className="btn btn-secondary" onClick={onClose}>
          Cancelar
        </button>

        <button
          type="button"
          className="btn btn-primary text-white"
          onClick={handleClipboard}
          disabled={letter === ""}
        >
          Copiar
        </button>
      </div>
    </Modal>
  );
}

export default ModalLetter;
