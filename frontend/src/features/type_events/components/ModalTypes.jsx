import Modal from "../../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { useForm } from "react-hook-form";
import TypeService from "../../../api/types.api";
import useApiMutation from "../../../hooks/useApiMutation";
import Spinner from "../../../ui/Spinner";

function ModalTypes({ isOpen, onClose, onRefresh, title, typeData }) {
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

  const { execute: createType, loading: creating } = useApiMutation(
    TypeService.addType,
    {
      onSuccess: () => {
        showSuccessToast("Tipo de hecho agregado con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const { execute: updateType, loading: updating } = useApiMutation(
    TypeService.updateType,
    {
      onSuccess: () => {
        showSuccessToast("Tipo de hecho editado con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const onSubmit = (data) => {
    if (typeData?.id) {
      // Si hay un tipo, estamos editando
      updateType({ id: typeData.id, ...data }, setError);
    } else {
      // Si no hay tipo, estamos creando uno nuevo
      createType(data, setError);
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
                defaultValue={typeData?.description}
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
                defaultChecked={typeData?.is_catastrophic}
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
          </div>
          <div className="modal-footer">
            <button
              type="submit"
              className="btn btn-primary text-white"
              disabled={creating || updating}
            >
              {updating || creating ? (
                <>
                  <Spinner />
                  Guardando...
                </>
              ) : (
                "Aceptar"
              )}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default ModalTypes;
