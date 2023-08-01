import { React, useContext, useState } from "react";
import Modal from "./Modal";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import AuthContext from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import SectorsService from "../api/sectors.api";

function ModalSectors({ isOpen, onClose, onRefresh, title, sectorData }) {
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

  const handleAddSector = async (data) => {
    await SectorsService.addSector(authTokens, data)
      .then((data) => {
        showSuccessToast("Sector agregado");
        onRefresh();
        handleCloseModal();
      })
      .catch((error) => {
        showErrorToast("Error al agregar sector");
      });
  };

  const handleUpdateSector = async (sectorId, data) => {
    await SectorsService.updateSector(authTokens, sectorId, data)
      .then((data) => {
        showSuccessToast("Sector actualizado");
        onRefresh();
        handleCloseModal();
      })
      .catch((error) => {
        showErrorToast("Error al actualizar sector");
      });
  };

  const handleSaveSector = async (data) => {
    setIsLoading(true);
    if (sectorData && sectorData.id) {
      await handleUpdateSector(sectorData.id, data);
    } else {
      await handleAddSector(data);
    }
    setIsLoading(false);
  };

  const handleFormSubmit = (data) => {
    setFormSubmitted(true);
    handleSubmit(handleSaveSector)(data);
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
                defaultValue={sectorData ? sectorData.description : ""}
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
            {isLoading ? "Guardando..." : sectorData ? "Modificar" : "Añadir"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalSectors;
