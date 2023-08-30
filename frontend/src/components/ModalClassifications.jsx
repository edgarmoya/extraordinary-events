import { React, useContext, useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import AuthContext from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import ClassificationService from "../api/classifications.api";
import GradeService from "../api/grades.api";
import FormSelect from "./FormSelect";
import { HttpStatusCode } from "axios";

function ModalClassifications({
  isOpen,
  onClose,
  onRefresh,
  title,
  classificationData,
}) {
  const { authTokens } = useContext(AuthContext);
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
      const response = await GradeService.getGrades(authTokens);
      setGrades(response.data.results);
    } catch (error) {
      console.error("Error fetching grades: ", error);
    }
  }, [authTokens]);

  useEffect(() => {
    loadGrades();
  }, [loadGrades]);

  //* Función para agregar nueva clasificación
  const handleAddClasification = async (data) => {
    try {
      const response = await ClassificationService.addClassification(
        authTokens,
        data
      );
      if (response.status === HttpStatusCode.Created) {
        showSuccessToast("Clasificación agregada");
        onRefresh();
      } else {
        showErrorToast("Error al agregar clasificación");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else {
          showErrorToast("Error al agregar clasificación");
        }
      }
    } finally {
      handleCloseModal();
    }
  };

  //* Función para actualizar clasificación
  const handleUpdateClassification = async (classificationId, data) => {
    try {
      const response = await ClassificationService.updateClassification(
        authTokens,
        classificationId,
        data
      );

      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Clasificación actualizada");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al actualizar clasificación");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else {
          showErrorToast("Error al actualizar clasificación");
        }
      }
    } finally {
      handleCloseModal();
    }
  };

  const handleSaveClassification = async (data) => {
    setIsLoading(true);
    if (classificationData && classificationData.id) {
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
                  classificationData ? classificationData.description : ""
                }
                {...register("description", { required: true })}
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
