import React, { useContext, useState, useEffect, useCallback } from "react";
import Modal from "../ui/Modal";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import AuthContext from "../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import EventService from "../../api/event.api";
import FieldService from "../../api/fields.api";
import ModalEventsGeneral from "./ModalEventsGeneral";
import ModalEventsMeasure from "./ModalEventsMeasure";
import ModalEventsAttachment from "./ModalEventsAttachment";
import ModalEventsField from "./ModalEventsField";
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
  const { user } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
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
    const eventDataValue = eventData
      ? new Date(eventData.occurrence_date)
      : new Date();

    const timezoneOffset = eventDataValue.getTimezoneOffset();
    eventDataValue.setMinutes(eventDataValue.getMinutes() - timezoneOffset);

    // Solo actualiza si el tiempo es diferente
    setOccurrenceDate((prevDate) => {
      if (eventDataValue.getTime() !== prevDate.getTime()) {
        return eventDataValue;
      }
      return prevDate; // No actualiza si son iguales
    });
  }, [eventData]);

  const handleCloseModal = () => {
    reset();
    setMeasures([]);
    setAttachments([]);
    setFieldValues([]);
    onClose();
  };

  //* Función para agregar hechos extraordinarios
  const handleAddEvent = async (data) => {
    try {
      const response = await EventService.addEvent(data);
      if (response.status === HttpStatusCode.Created) {
        const eventId = response.data.id;

        // Promesas para agregar dependencias
        const measurePromises = measures.map((measure) =>
          handleAddMeasure({
            event: eventId,
            description: measure.description,
          })
        );

        const attachmentPromises = attachments.map((attachment) =>
          handleAddAttachment({
            event: eventId,
            image: attachment.image,
          })
        );

        const fieldPromises = fieldValues.map((fieldValue) =>
          handleAddField({
            event: eventId,
            add_field: fieldValue.add_field,
            value: fieldValue.value,
          })
        );

        // Ejecutar todas las promesas en paralelo
        await Promise.all([
          ...measurePromises,
          ...attachmentPromises,
          ...fieldPromises,
        ]);

        showSuccessToast("Hecho extraordinario agregado con éxito");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al agregar, compruebe los campos");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    }
  };

  //* Función para agregar medida
  const handleAddMeasure = async (data) => {
    try {
      const response = await EventService.addMeasure(data);
      return response.status;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    }
  };

  //* Función para eliminar medida
  const handleDeleteMeasure = async (measureId) => {
    try {
      const response = await EventService.deleteMeasure(measureId);

      if (response.status === HttpStatusCode.NoContent) {
        return response.status;
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    }
  };

  //* Función para modificar las medidas
  const handleAddDeleteMeasures = async (eventId, measures) => {
    // Obtener medidas existentes asociadas al evento
    const existingMeasures = await EventService.getMeasures(eventId);

    // Identificar medidas a agregar y eliminar
    const measuresToAdd = [];
    const measuresToDelete = [];

    // Identificar medidas existentes a editar y eliminar
    for (const existingMeasure of existingMeasures.data) {
      const matchingMeasure = measures.find((m) => m.id === existingMeasure.id);

      if (!matchingMeasure) {
        // La medida no se encuentra en las medidas nuevas, entonces agregar a las medidas a eliminar
        measuresToDelete.push(existingMeasure.id);
      }
    }

    // Identificar medidas nuevas a agregar
    for (const measure of measures) {
      if (!existingMeasures.data.some((m) => m.id === measure.id)) {
        // La medida no existe en las medidas existentes, entonces agregar a las medidas a agregar
        measuresToAdd.push({
          event: eventId,
          description: measure.description,
        });
      }
    }

    for (const measureToAdd of measuresToAdd) {
      await handleAddMeasure(measureToAdd);
    }

    for (const measureIdToDelete of measuresToDelete) {
      await handleDeleteMeasure(measureIdToDelete);
    }
  };

  //* Función para agregar anexo
  const handleAddAttachment = async (data) => {
    try {
      const response = await EventService.addAttachment(data);
      return response.status;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    }
  };

  //* Función para eliminar anexo
  const handleDeleteAttachment = async (attachId) => {
    try {
      const response = await EventService.deleteAttachment(attachId);

      if (response.status === HttpStatusCode.NoContent) {
        return response.status;
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    }
  };

  //* Función para modificar los anexos
  const handleAddDeleteAttachment = async (eventId, attachments) => {
    // Obtener anexos existentes asociadas al evento
    const existingAttachs = await EventService.getAttachments(eventId);

    // Identificar anexos a agregar y eliminar
    const attachsToAdd = [];
    const attachsToDelete = [];

    // Identificar anexos existentes a eliminar
    for (const existingAttach of existingAttachs.data) {
      const matchingAttach = attachments.find(
        (m) => m.id === existingAttach.id
      );

      if (!matchingAttach) {
        // El anexo no se encuentra en los nuevos, entonces agregar a los anexos a eliminar
        attachsToDelete.push(existingAttach.id);
      }
    }

    // Identificar anexos nuevos a agregar
    for (const attach of attachments) {
      if (!existingAttachs.data.some((m) => m.id === attach.id)) {
        // El anexo no existe en los existentes, entonces agregar a los anexos a agregar
        attachsToAdd.push({
          id: attach.id,
          event: eventId,
          url: attach.url,
          image: attach.image,
        });
      }
    }

    for (const attachToAdd of attachsToAdd) {
      await handleAddAttachment(attachToAdd);
    }

    for (const attachIdToDelete of attachsToDelete) {
      await handleDeleteAttachment(attachIdToDelete);
    }
  };

  //* Función para agregar campo adicional
  const handleAddField = async (data) => {
    try {
      const response = await FieldService.addFieldValue(data);
      return response.status;
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    }
  };

  //* Función para eliminar campo adicional
  const handleDeleteField = async (fieldId) => {
    try {
      const response = await FieldService.deleteFieldValue(fieldId);

      if (response.status === HttpStatusCode.NoContent) {
        return response.status;
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    }
  };

  //* Función para modificar los campos adicionales
  const handleAddDeleteFields = async (eventId, fieldValues) => {
    // Obtener campos existentes asociadas al evento
    const existingFields = await FieldService.getFieldValues(eventId);

    // Identificar campos a agregar y eliminar
    const fieldsToAdd = [];
    const fieldsToDelete = [];

    // Identificar campos existentes a editar y eliminar
    for (const existingField of existingFields.data) {
      const matchingField = fieldValues.find((m) => m.id === existingField.id);

      if (!matchingField) {
        // El campo no se encuentra en los campos nuevos, entonces es un campo a eliminar
        fieldsToDelete.push(existingField.id);
      }
    }

    // Identificar campos nuevos a agregar
    for (const fieldValue of fieldValues) {
      if (!existingFields.data.some((m) => m.id === fieldValue.id)) {
        // El campo no existe en los campos existentes, entonces agregar
        fieldsToAdd.push({
          event: eventId,
          add_field: fieldValue.add_field,
          value: fieldValue.value,
        });
      }
    }

    for (const fieldToAdd of fieldsToAdd) {
      await handleAddField(fieldToAdd);
    }

    for (const fieldToDelete of fieldsToDelete) {
      await handleDeleteField(fieldToDelete);
    }
  };

  //* Función para actualizar un hecho extraordinario
  const handleUpdateEvent = async (eventId, data) => {
    try {
      const response = await EventService.updateEvent(eventId, data);

      if (response.status !== HttpStatusCode.Ok) {
        showErrorToast("Error al actualizar hecho");
        return;
      }

      await handleAddDeleteMeasures(eventId, measures);
      await handleAddDeleteAttachment(eventId, attachments);
      await handleAddDeleteFields(eventId, fieldValues);

      showSuccessToast("Hecho extraordinario actualizado con éxito");
      onRefresh();
      handleCloseModal();
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    }
  };

  const handleSaveEvent = async (data) => {
    setIsLoading(true);
    if (eventData?.id) {
      await handleUpdateEvent(eventData.id, data);
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
    if (isOpen) {
      handleEventDateChange();
    }
  }, [isOpen, handleEventDateChange]);

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
