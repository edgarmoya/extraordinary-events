import { React, useContext, useState } from "react";
import Modal from "./Modal";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import AuthContext from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import SectorsService from "../api/sectors.api";

function ModalAddSectors({ isOpen, onClose, onSectorAdded }) {
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

  const handleAddSector = (data) => {
    setIsLoading(true);
    SectorsService.addSector(authTokens, data)
      .then((data) => {
        showSuccessToast("Sector agregado correctamente.");
        onSectorAdded();
        handleCloseModal();
      })
      .catch((error) => {
        showErrorToast("Error al agregar sector.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleFormSubmit = (data) => {
    setFormSubmitted(true);
    handleSubmit(handleAddSector)(data);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        title={"Añadir nuevo sector"}
        onClose={handleCloseModal}
      >
        <div className="modal-body">
          <form>
            <div className="form-floating">
              <input
                type="text"
                name="description"
                className={`form-control ${
                  formSubmitted && errors.description ? "is-invalid" : ""
                }`}
                {...register("description", { required: true })}
              ></input>
              <label htmlFor="floatingInput">Descripción</label>
              {errors.description && (
                <div className="invalid-feedback">
                  Por favor, inserte la descripción del sector
                </div>
              )}
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
            {isLoading ? "Añadiendo..." : "Añadir"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalAddSectors;
