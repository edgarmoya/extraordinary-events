import React, { useState } from "react";
import CardAttachment from "./CardAttachment";
import { useForm } from "react-hook-form";

function ModalEvents_Attachment() {
  const [attachments, setAttachments] = useState([]);
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
    };
    setAttachments([...attachments, newAttachment]);
    console.log(attachments);
    setLastId(lastId + 1);
    reset();
  };

  const handleFormSubmit = (data) => {
    handleSaveAttachment(data);
  };

  const handleDeleteAttachment = (id) => {
    const updatedAttachments = attachments.filter(
      (attachment) => attachment.id !== id
    );
    setAttachments(updatedAttachments);
  };

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
          />
          <button
            type="button"
            className="input-group-text"
            htmlFor="inputGroupFile"
            onClick={handleSubmit(handleFormSubmit)}
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
              {attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="d-flex col-lg-4 col-md-6 col-sm-12"
                >
                  <CardAttachment
                    id={attachment.id}
                    imageUrl={attachment.url}
                    onDelete={handleDeleteAttachment}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ModalEvents_Attachment;
