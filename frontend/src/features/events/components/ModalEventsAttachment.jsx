import React, { useState, useCallback, useEffect } from "react";
import CardAttachment from "./CardAttachment";
import EventService from "../../../api/event.api";
import { useForm } from "react-hook-form";

function ModalEventsAttachment({
  attachments,
  setAttachments,
  eventData,
  readOnly,
}) {
  const [lastId, setLastId] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleSaveAttachment = (data) => {
    const file = data.attachment[0];
    const url = URL.createObjectURL(file);
    const newAttachment = {
      id: lastId + 1,
      url: url,
      image: file,
    };
    setAttachments([...attachments, newAttachment]);
    setLastId(lastId + 1);
    reset();
  };

  //* Función para cargar los anexos
  const loadAttachments = useCallback(async () => {
    try {
      const response = await EventService.getAttachments(eventData?.id);
      setAttachments(response.data);
    } catch (error) {
      console.error("Error obteniendo anexos: ", error);
    }
  }, [eventData, setAttachments]);

  const handleFormSubmit = (data) => {
    handleSaveAttachment(data);
  };

  const handleDeleteAttachment = (id) => {
    const updatedAttachments = attachments.filter(
      (attachment) => attachment.id !== id
    );
    setAttachments(updatedAttachments);
  };

  useEffect(() => {
    if (eventData?.id) {
      loadAttachments();
    }
  }, [eventData, loadAttachments]);

  return (
    <section>
      <div className="mt-3">
        {/* New attachment */}
        <form className="input-group">
          <input
            type="file"
            id="inputGroupFile"
            name="attachment"
            className={`form-control mb-0 ${
              errors.attachment ? "is-invalid" : ""
            }`}
            {...register("attachment", { required: true })}
            autoFocus={true}
            accept="image/*"
            disabled={readOnly}
          />
          <button
            type="button"
            className="input-group-text"
            htmlFor="inputGroupFile"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={readOnly}
          >
            Agregar
          </button>
        </form>

        {/* Attachments */}
        <div
          className="overflow-y-auto overflow-x-hidden mt-1"
          style={{ height: 300 }}
        >
          {attachments.length === 0 ? (
            <div className="d-flex h-75 justify-content-center align-items-center mt-3">
              <p>No se han registrado anexos para este hecho</p>
            </div>
          ) : (
            <div className="row d-flex align-content-center">
              {attachments.map((attachment, index) => (
                <div key={index} className="d-flex col-lg-4 col-md-6 col-sm-12">
                  {attachment.url ? (
                    <CardAttachment
                      id={attachment.id}
                      imageUrl={attachment.url}
                      onDelete={handleDeleteAttachment}
                      readOnly={readOnly}
                    />
                  ) : (
                    <CardAttachment
                      id={attachment.id}
                      imageUrl={attachment.image}
                      onDelete={handleDeleteAttachment}
                      readOnly={readOnly}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ModalEventsAttachment;
