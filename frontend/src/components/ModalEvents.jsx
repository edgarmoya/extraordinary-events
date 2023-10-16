import React, { useContext, useState, useEffect } from "react";
import Modal from "./Modal";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import AuthContext from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import EventService from "../api/event.api";
import ModalEventsGeneral from "./ModalEventsGeneral";
import ModalEventsMeasure from "./ModalEventsMeasure";
import ModalEventsAttachment from "./ModalEventsAttachment";
import { HttpStatusCode } from "axios";
import { format } from "date-fns";

function ModalEvents({
  isOpen,
  onClose,
  onRefresh,
  title,
  size,
  eventData,
  readOnly,
}) {
  const { authTokens, user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [occurrenceDate, setOccurrenceDate] = useState(new Date());

  const [measures, setMeasures] = useState([]);
  const [attachments, setAttachments] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm();

  const handleEventDateChange = () => {
    const eventDataValue = eventData
      ? new Date(eventData.occurrence_date)
      : new Date();

    const timezoneOffset = eventDataValue.getTimezoneOffset();
    eventDataValue.setMinutes(eventDataValue.getMinutes() + timezoneOffset);

    if (eventDataValue.getTime() !== occurrenceDate.getTime()) {
      setOccurrenceDate(eventDataValue);
    }
  };

  const handleCloseModal = () => {
    reset();
    setMeasures([]);
    setAttachments([]);
    onClose();
  };

  const handleAddEvent = async (data) => {
    try {
      const response = await EventService.addEvent(authTokens, data);
      if (response.status === HttpStatusCode.Created) {
        // Agregar medidas
        for (const measure of measures) {
          const measureData = {
            event: response.data.id,
            description: measure.description,
          };
          await handleAddMeasure(measureData);
        }

        // Agregar anexos
        for (const attachment of attachments) {
          const attachmentData = {
            event: response.data.id,
            image: attachment.image,
          };
          await handleAddAttachment(attachmentData);
        }

        showSuccessToast("Hecho extraordinario agregado");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al agregar, compruebe los campos");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
          handleCloseModal();
        } else if (status === HttpStatusCode.BadRequest) {
          showErrorToast("Error al agregar, compruebe los campos");
        } else {
          showErrorToast("Error al agregar hecho");
        }
      }
    }
  };

  const handleAddMeasure = async (data) => {
    try {
      const response = await EventService.addMeasure(authTokens, data);
      return response.status;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          throw Error("No tiene permiso para realizar esta acción");
        } else if (status === HttpStatusCode.BadRequest) {
          throw Error("Error al agregar, compruebe los campos");
        } else {
          throw Error("Error al agregar medidas");
        }
      }
    }
  };

  const handleAddAttachment = async (data) => {
    try {
      const response = await EventService.addAttachment(authTokens, data);
      return response.status;
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          throw Error("No tiene permiso para realizar esta acción");
        } else if (status === HttpStatusCode.BadRequest) {
          throw Error("Error al agregar, compruebe los campos");
        } else {
          throw Error("Error al agregar medidas");
        }
      }
    }
  };

  /*const handleUpdateEntity = async (entityId, data) => {
    try {
      const response = await EntityService.updateEntity(
        authTokens,
        entityId,
        data
      );

      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Entidad actualizada");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al actualizar entidad");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
          handleCloseModal();
        } else if (status === HttpStatusCode.BadRequest) {
          showErrorToast("Error al actualizar, código existente");
        } else {
          showErrorToast("Error al actualizar entidad");
        }
      }
    }
  };*/

  const handleSaveEvent = async (data) => {
    setIsLoading(true);
    if (eventData && eventData.id) {
      // await handleUpdateEvent(eventData.id, data);
    } else {
      await handleAddEvent(data);
    }
    setIsLoading(false);
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
    handleEventDateChange();
  }, [isOpen, eventData]);

  return (
    <div>
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
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : eventData ? "Modificar" : "Añadir"}
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ModalEvents;
