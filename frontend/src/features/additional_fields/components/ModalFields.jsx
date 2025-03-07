import { React, useState } from "react";
import Modal from "../../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { useForm } from "react-hook-form";
import FieldService from "../../../api/fields.api";
import FormSelect from "../../../ui/FormSelect";
import { HttpStatusCode } from "axios";

function ModalFields({ isOpen, onClose, onRefresh, title, fieldData }) {
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [typeChoices] = useState([
    {
      id: "text",
      description: "Texto",
    },
    {
      id: "number",
      description: "Número",
    },
    {
      id: "date",
      description: "Fecha",
    },
  ]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const handleCloseModal = () => {
    reset();
    setFormSubmitted(false);
    onClose();
  };

  //* Función para agregar nuevo campo adicional
  const handleAddField = async (data) => {
    try {
      const response = await FieldService.addField(data);
      if (response.status === HttpStatusCode.Created) {
        showSuccessToast("Campo adicional agregado con éxito");
        onRefresh();
      } else {
        showErrorToast("Error al agregar campo adicional");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    } finally {
      handleCloseModal();
    }
  };

  //* Función para actualizar campo
  const handleUpdateField = async (fieldId, data) => {
    try {
      const response = await FieldService.updateField(fieldId, data);

      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Campo adicional actualizado con éxito");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al actualizar campo adicional");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    } finally {
      handleCloseModal();
    }
  };

  const handleSaveField = async (data) => {
    setIsLoading(true);
    if (fieldData?.id) {
      await handleUpdateField(fieldData.id, data);
    } else {
      await handleAddField(data);
    }
    setIsLoading(false);
  };

  const handleFormSubmit = (data) => {
    setFormSubmitted(true);
    handleSubmit(handleSaveField)(data);
  };

  return (
    <div>
      <Modal isOpen={isOpen} title={title} onClose={handleCloseModal}>
        <div className="modal-body">
          <form>
            <div className="form-floating">
              <input
                type="text"
                name="description"
                className={`form-control ${
                  formSubmitted && errors.description ? "is-invalid" : ""
                }`}
                defaultValue={fieldData ? fieldData.description : ""}
                {...register("description", { required: true })}
                autoFocus={true}
              ></input>
              <label htmlFor="floatingInput">Descripción*</label>
              {errors.description && (
                <div className="invalid-feedback">
                  Por favor, inserte la descripción del campo adicional
                </div>
              )}
            </div>
            <FormSelect
              className={"mt-3"}
              data={typeChoices}
              name={"Tipo de campo*"}
              message={"Seleccione un tipo"}
              onChange={() => console.log("Tipo cambiado")}
              errors={errors}
              register={register}
              setValue={setValue}
              registerName={"field_type"}
              defaultValue={fieldData ? fieldData.field_type : ""}
            />
          </form>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleFormSubmit}
            className="btn btn-primary"
            disabled={isLoading}
          >
            {isLoading ? "Guardando..." : fieldData ? "Modificar" : "Añadir"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalFields;
