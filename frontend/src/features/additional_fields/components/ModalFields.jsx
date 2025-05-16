import { React, useState } from "react";
import Modal from "../../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { useForm } from "react-hook-form";
import FieldService from "../../../api/fields.api";
import FormSelect from "../../../ui/FormSelect";
import Spinner from "../../../ui/Spinner";
import useApiMutation from "../../../hooks/useApiMutation";

function ModalFields({ isOpen, onClose, onRefresh, title, fieldData }) {
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
    setError,
  } = useForm();

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  //* Función para agregar nuevo campo adicional
  const { execute: createField, loading: creating } = useApiMutation(
    FieldService.addField,
    {
      onSuccess: () => {
        showSuccessToast("Campo adicional agregado con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para actualizar campo
  const { execute: updateField, loading: updating } = useApiMutation(
    FieldService.updateField,
    {
      onSuccess: () => {
        showSuccessToast("Campo adicional actualizado con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const onSubmit = (data) => {
    if (fieldData?.id) {
      // Si hay un campo, estamos editando
      updateField({ id: fieldData.id, ...data }, setError);
    } else {
      // Si no hay campo, estamos creando uno nuevo
      createField(data, setError);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} title={title} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="form-floating">
              <input
                type="text"
                name="description"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                defaultValue={fieldData?.description}
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
              defaultValue={fieldData?.field_type}
            />
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
              type="submit"
              className="btn btn-primary text-white"
              disabled={creating || updating}
            >
              {fieldData ? (
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
          </div>
        </form>
      </Modal>
    </>
  );
}

export default ModalFields;
