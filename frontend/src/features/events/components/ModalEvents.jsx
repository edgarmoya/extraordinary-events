import { useContext, useState, useEffect, useCallback } from "react";
import Modal from "../../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import AuthContext from "../../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import EventService from "../../../api/event.api";
import ModalEventsGeneral from "./ModalEventsGeneral";
import ModalEventsMeasure from "./ModalEventsMeasure";
import ModalEventsAttachment from "./ModalEventsAttachment";
import ModalEventsField from "./ModalEventsField";
import { format } from "date-fns";
import useApiMutation from "../../../hooks/useApiMutation";
import Spinner from "../../../ui/Spinner";

function ModalEvents({
  isOpen,
  onClose,
  onRefresh,
  title,
  size,
  eventData,
  readOnly,
}) {
  const { user } = useContext(AuthContext);
  const [occurrenceDate, setOccurrenceDate] = useState(new Date());

  const [measures, setMeasures] = useState([]);
  const [attachments, setAttachments] = useState([]);
  const [fieldValues, setFieldValues] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const handleEventDateChange = useCallback(() => {
    const parsed = eventData ? new Date(eventData.occurrence_date) : new Date();

    const localDate = new Date(
      parsed.getUTCFullYear(),
      parsed.getUTCMonth(),
      parsed.getUTCDate()
    );

    setOccurrenceDate(localDate);
  }, [eventData]);

  const handleCloseModal = () => {
    reset();
    setMeasures([]);
    setAttachments([]);
    setFieldValues([]);
    onClose();
  };

  const { execute: createEvent, loading: creating } = useApiMutation(
    EventService.addEvent,
    {
      onSuccess: () => {
        showSuccessToast("Hecho extraordinario agregado con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const convertFileToAttachment = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64Data = reader.result.split(",")[1]; // quitar el encabezado
        resolve({
          filename: file.name,
          content_type: file.type,
          data_base64: base64Data,
        });
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  //* Función para agregar hechos extraordinarios
  const handleAddEvent = async (data) => {
    try {
      const processedAttachments = await Promise.all(
        attachments.map((attachment) =>
          convertFileToAttachment(attachment.data)
        )
      );

      const fullEventPayload = {
        ...data,
        measures: measures.map((measure) => ({
          description: measure.description,
        })),
        attachments: processedAttachments,
        fields: fieldValues.map((fieldValue) => ({
          add_field: fieldValue.add_field,
          value: fieldValue.value,
        })),
      };

      await createEvent(fullEventPayload);
    } catch (err) {
      console.error("Error procesando los archivos: ", err);
    }
  };

  const { execute: updateEvent, loading: updating } = useApiMutation(
    EventService.updateEvent,
    {
      onSuccess: () => {
        showSuccessToast("Hecho extraordinario actualizado con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para actualizar un hecho extraordinario
  const handleUpdateEvent = async (id, data) => {
    const processedAttachments = await Promise.all(
      attachments.map(async (attachment) => {
        if (
          attachment.data instanceof File ||
          attachment.data instanceof Blob
        ) {
          // Archivo nuevo, convierte a base64
          return await convertFileToAttachment(attachment.data);
        } else {
          // Archivo existente
          return {
            id: attachment.id,
            filename: attachment.filename,
            content_type: attachment.content_type,
            data_base64: attachment.data,
          };
        }
      })
    );

    const fullEventPayload = {
      ...data,
      measures: measures.map((measure) => ({
        description: measure.description,
        ...(measure.id !== null && { id: measure.id }), // para saber si actualizar o crear
      })),
      attachments: processedAttachments,
      fields: fieldValues.map((fieldValue) => ({
        add_field: fieldValue.add_field,
        value: fieldValue.value,
        ...(fieldValue.id !== null && { id: fieldValue.id }),
      })),
    };

    await updateEvent({ id, event: fullEventPayload });
  };

  const handleSaveEvent = async (data) => {
    if (eventData?.id) {
      await handleUpdateEvent(eventData.id, data);
    } else {
      await handleAddEvent(data);
    }
  };

  const handleFormSubmit = (data) => {
    const modifiedData = {
      ...data,
      created_by: user.user_id,
      occurrence_date: format(occurrenceDate, "yyyy-MM-dd"),
    };
    handleSaveEvent(modifiedData);
  };

  useEffect(() => {
    if (isOpen) {
      handleEventDateChange();
    }
  }, [isOpen, handleEventDateChange]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={title}
        size={size}
        onClose={handleCloseModal}
      >
        <div className="modal-body">
          <div className="tabs">
            <ul className="nav nav-tabs nav-fill justify-content-center">
              <li className="nav-item">
                <button
                  className="nav-link active"
                  id="general-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#general-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="general-tab-pane"
                  aria-selected="true"
                >
                  General
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  id="measure-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#measure-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="measure-tab-pane"
                  aria-selected="false"
                >
                  Medidas
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  id="attachment-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#attachment-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="attachment-tab-pane"
                  aria-selected="false"
                >
                  Anexos
                </button>
              </li>
              <li className="nav-item">
                <button
                  className="nav-link"
                  id="field-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#field-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="field-tab-pane"
                  aria-selected="false"
                >
                  Campos adicionales
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="general-tab-pane"
                role="tabpanel"
                aria-labelledby="general-tab"
                tabIndex="0"
              >
                <ModalEventsGeneral
                  eventData={eventData}
                  register={register}
                  errors={errors}
                  setValue={setValue}
                  occurrenceDate={occurrenceDate}
                  setOccurrenceDate={setOccurrenceDate}
                  readOnly={readOnly}
                />
              </div>
              <div
                className="tab-pane fade"
                id="measure-tab-pane"
                role="tabpanel"
                aria-labelledby="measure-tab"
                tabIndex="0"
              >
                <ModalEventsMeasure
                  measures={measures}
                  setMeasures={setMeasures}
                  eventData={eventData}
                  readOnly={readOnly}
                />
              </div>
              <div
                className="tab-pane fade"
                id="attachment-tab-pane"
                role="tabpanel"
                aria-labelledby="attachment-tab"
                tabIndex="0"
              >
                <ModalEventsAttachment
                  attachments={attachments}
                  setAttachments={setAttachments}
                  eventData={eventData}
                  readOnly={readOnly}
                />
              </div>
              <div
                className="tab-pane fade"
                id="field-tab-pane"
                role="tabpanel"
                aria-labelledby="field-tab"
                tabIndex="0"
              >
                <ModalEventsField
                  fieldValues={fieldValues}
                  setFieldValues={setFieldValues}
                  eventData={eventData}
                  readOnly={readOnly}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={handleSubmit(handleFormSubmit)}
              className="btn btn-primary text-white"
              disabled={creating || updating}
            >
              {eventData ? (
                updating ? (
                  <>
                    <Spinner />
                    Actualizando...
                  </>
                ) : (
                  "Modificar"
                )
              ) : creating ? (
                <>
                  <Spinner />
                  Creando...
                </>
              ) : (
                "Añadir"
              )}
            </button>
          )}
        </div>
      </Modal>
    </>
  );
}

export default ModalEvents;
