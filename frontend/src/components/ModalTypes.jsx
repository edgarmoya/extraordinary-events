import { React, useContext, useState } from "react";
import Modal from "./Modal";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import AuthContext from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import TypeService from "../api/types.api";
import { HttpStatusCode } from "axios";

function ModalTypes({ isOpen, onClose, onRefresh, title, typeData }) {
  const { authTokens } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleCloseModal = () => {
    reset();
    setFormSubmitted(false);
    onClose();
  };

  const handleAddType = async (data) => {
    try {
      const response = await TypeService.addType(authTokens, data);
      if (response.status === HttpStatusCode.Created) {
        showSuccessToast("Tipo de hecho agregado");
        onRefresh();
      } else {
        showErrorToast("Error al agregar tipo de hecho");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else {
          showErrorToast("Error al agregar tipo de hecho");
        }
      }
    } finally {
      handleCloseModal();
    }
  };

  const handleUpdateType = async (typeId, data) => {
    try {
      const response = await TypeService.updateType(authTokens, typeId, data);

      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Tipo de hecho actualizado");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al actualizar tipo de hecho");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else {
          showErrorToast("Error al actualizar tipo de hecho");
        }
      }
    } finally {
      handleCloseModal();
    }
  };

  const handleSaveType = async (data) => {
    setIsLoading(true);
    if (typeData && typeData.id) {
      await handleUpdateType(typeData.id, data);
    } else {
      await handleAddType(data);
    }
    setIsLoading(false);
  };

  const handleFormSubmit = (data) => {
    setFormSubmitted(true);
    handleSubmit(handleSaveType)(data);
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
                defaultValue={typeData ? typeData.description : ""}
                {...register("description", { required: true })}
                autoFocus={true}
              ></input>
              <label htmlFor="floatingInput">Descripción*</label>
              {errors.description && (
                <div className="invalid-feedback">
                  Por favor, ingrese la descripción del tipo de hecho
                </div>
              )}
            </div>
            <div className="form-check mt-2">
              <input
                className="form-check-input"
                type="checkbox"
                defaultChecked={typeData && typeData.is_catastrophic}
                id="flexCheckChecked"
                {...register("is_catastrophic")}
              />
              <label
                className="form-check-label text-body "
                htmlFor="flexCheckChecked"
              >
                Catastrófico
              </label>
            </div>
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
            {isLoading ? "Guardando..." : typeData ? "Modificar" : "Añadir"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalTypes;
