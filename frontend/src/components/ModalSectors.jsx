import { React, useContext, useState } from "react";
import Modal from "./Modal";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import AuthContext from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import SectorsService from "../api/sectors.api";
import { HttpStatusCode } from "axios";

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
    try {
      const response = await SectorsService.addSector(authTokens, data);
      if (response.status === HttpStatusCode.Created) {
        showSuccessToast("Sector agregado");
        onRefresh();
      } else {
        showErrorToast("Error al agregar sector");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else {
          showErrorToast("Error al agregar sector");
        }
      }
    } finally {
      handleCloseModal();
    }
  };

  const handleUpdateSector = async (sectorId, data) => {
    try {
      const response = await SectorsService.updateSector(
        authTokens,
        sectorId,
        data
      );

      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Sector actualizado");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al actualizar sector");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else {
          showErrorToast("Error al actualizar sector");
        }
      }
    } finally {
      handleCloseModal();
    }
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
              <label htmlFor="floatingInput">Descripción*</label>
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
