import React from "react";
import Modal from "../../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { useForm } from "react-hook-form";
import ClassificationService from "../../../api/classifications.api";
import GradeService from "../../../api/grades.api";
import FormSelect from "../../../ui/FormSelect";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";
import Spinner from "../../../ui/Spinner";

function ModalClassifications({
  isOpen,
  onClose,
  onRefresh,
  title,
  classificationData,
}) {
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

  //* Función para cargar los grados
  const { data: grades } = useFetchData(
    isOpen ? GradeService.getGrades : null,
    [],
    []
  );

  //* Función para agregar nueva clasificación
  const { execute: createClasification, loading: creating } = useApiMutation(
    ClassificationService.addClassification,
    {
      onSuccess: () => {
        showSuccessToast("Clasificación agregada con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para actualizar clasificación
  const { execute: updateClassification, loading: updating } = useApiMutation(
    ClassificationService.updateClassification,
    {
      onSuccess: () => {
        showSuccessToast("Clasificación actualizada con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const onSubmit = (data) => {
    if (classificationData?.id) {
      // Si hay una clasificación, estamos editando
      updateClassification({ id: classificationData.id, ...data }, setError);
    } else {
      // Si no hay clasificación, estamos creando uno nuevo
      createClasification(data, setError);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} title={title} onClose={handleCloseModal}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="form-floating">
              <textarea
                type="text"
                name="description"
                className={`form-control ${
                  errors.description ? "is-invalid" : ""
                }`}
                style={{ height: "100px" }}
                defaultValue={classificationData?.description}
                {...register("description", { required: true })}
                autoFocus={true}
              ></textarea>
              <label htmlFor="floatingInput">Descripción*</label>
              {errors.description && (
                <div className="invalid-feedback">
                  Por favor, inserte la descripción de la clasificación
                </div>
              )}
            </div>
            <FormSelect
              className={"mt-3"}
              data={grades?.results || []}
              name={"Grado*"}
              message={"Seleccione un grado"}
              onChange={() => console.log("Grado cambiado")}
              errors={errors}
              register={register}
              setValue={setValue}
              registerName={"grade"}
              defaultValue={classificationData?.grade}
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
              {classificationData ? (
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

export default ModalClassifications;
