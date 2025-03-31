import React from "react";
import Modal from "../../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { useForm } from "react-hook-form";
import SectorsService from "../../../api/sectors.api";
import Spinner from "../../../ui/Spinner";
import useApiMutation from "../../../hooks/useApiMutation";

function ModalSectors({ isOpen, onClose, onRefresh, title, sectorData }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError,
  } = useForm();

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  const { execute: createSector, loading: creating } = useApiMutation(
    SectorsService.addSector,
    {
      onSuccess: () => {
        showSuccessToast("Sector agregado con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const { execute: updateSector, loading: updating } = useApiMutation(
    SectorsService.updateSector,
    {
      onSuccess: () => {
        showSuccessToast("Sector actualizado con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const onSubmit = (data) => {
    if (sectorData?.id) {
      // Si hay un sector, estamos editando
      updateSector({ id: sectorData.id, ...data }, setError);
    } else {
      // Si no hay sector, estamos creando uno nuevo
      createSector(data, setError);
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
                defaultValue={sectorData?.description}
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
              {sectorData ? (
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

export default ModalSectors;
