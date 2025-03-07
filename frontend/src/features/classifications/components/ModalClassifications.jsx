import { React, useState, useEffect, useCallback } from "react";
import Modal from "../../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { useForm } from "react-hook-form";
import ClassificationService from "../../../api/classifications.api";
import GradeService from "../../../api/grades.api";
import FormSelect from "../../../ui/FormSelect";
import { HttpStatusCode } from "axios";

function ModalClassifications({
  isOpen,
  onClose,
  onRefresh,
  title,
  classificationData,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [grades, setGrades] = useState([]);

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

  //* Función para cargar los grados
  const loadGrades = useCallback(async () => {
    try {
      const response = await GradeService.getGrades();
      setGrades(response.data.results);
    } catch (error) {
      console.error("Error obteniendo los grados: ", error);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      loadGrades();
    }
  }, [isOpen, loadGrades]);

  //* Función para agregar nueva clasificación
  const handleAddClasification = async (data) => {
    try {
      const response = await ClassificationService.addClassification(data);
      if (response.status === HttpStatusCode.Created) {
        showSuccessToast("Clasificación agregada con éxito");
        onRefresh();
      } else {
        showErrorToast("Error al agregar clasificación");
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

  //* Función para actualizar clasificación
  const handleUpdateClassification = async (classificationId, data) => {
    try {
      const response = await ClassificationService.updateClassification(
        classificationId,
        data
      );

      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Clasificación actualizada con éxito");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al actualizar clasificación");
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

  const handleSaveClassification = async (data) => {
    setIsLoading(true);
    if (classificationData?.id) {
      await handleUpdateClassification(classificationData.id, data);
    } else {
      await handleAddClasification(data);
    }
    setIsLoading(false);
  };

  const handleFormSubmit = (data) => {
    setFormSubmitted(true);
    handleSubmit(handleSaveClassification)(data);
  };

  return (
    <div>
      <Modal isOpen={isOpen} title={title} onClose={handleCloseModal}>
        <div className="modal-body">
          <form>
            <div className="form-floating">
              <textarea
                type="text"
                name="description"
                className={`form-control ${
                  formSubmitted && errors.description ? "is-invalid" : ""
                }`}
                style={{ height: "100px" }}
                defaultValue={
                  classificationData ? classificationData?.description : ""
                }
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
              data={grades}
              name={"Grado*"}
              message={"Seleccione un grado"}
              onChange={() => console.log("Grado cambiado")}
              errors={errors}
              register={register}
              setValue={setValue}
              registerName={"grade"}
              defaultValue={classificationData ? classificationData.grade : ""}
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
            {isLoading
              ? "Guardando..."
              : classificationData
              ? "Modificar"
              : "Añadir"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalClassifications;
