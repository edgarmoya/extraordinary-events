import { React, useState } from "react";
import Modal from "../Modal";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import { useForm } from "react-hook-form";
import SectorsService from "../../api/sectors.api";
import { HttpStatusCode } from "axios";

function ModalSectors({ isOpen, onClose, onRefresh, title, sectorData }) {
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
      const response = await SectorsService.addSector(data);
      if (response.status === HttpStatusCode.Created) {
        showSuccessToast("Sector agregado con éxito");
        onRefresh();
      } else {
        showErrorToast("Error al agregar sector");
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

  const handleUpdateSector = async (sectorId, data) => {
    try {
      const response = await SectorsService.updateSector(sectorId, data);

      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Sector actualizado con éxito");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al actualizar sector");
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

  const handleSaveSector = async (data) => {
    setIsLoading(true);
    if (sectorData?.id) {
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
    <>
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
                autoFocus={true}
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
    </>
  );
}

export default ModalSectors;
