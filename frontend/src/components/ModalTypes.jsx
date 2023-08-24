import { React, useContext, useState } from "react";
import Modal from "./Modal";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import AuthContext from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import TypeService from "../api/types.api";

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
    await TypeService.addType(authTokens, data)
      .then((data) => {
        showSuccessToast("Tipo de hecho agregado");
        onRefresh();
        handleCloseModal();
      })
      .catch((error) => {
        showErrorToast("Error al agregar tipo de hecho");
      });
  };

  const handleUpdateType = async (typeId, data) => {
    await TypeService.updateType(authTokens, typeId, data)
      .then((data) => {
        showSuccessToast("Tipo de hecho actualizado");
        onRefresh();
        handleCloseModal();
      })
      .catch((error) => {
        showErrorToast("Error al actualizar tipo de hecho");
      });
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
              <label className="form-check-label" htmlFor="flexCheckChecked">
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
