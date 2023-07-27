import { React, useContext, useState } from "react";
import Modal from "./Modal";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import AuthContext from "../contexts/AuthContext";
import UserService from "../api/users.api";
import { useForm } from "react-hook-form";

function ModalChangePassword({ isOpen, onClose }) {
  const { user, authTokens } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    getValues,
  } = useForm();

  const handleCloseModal = () => {
    reset();
    setFormSubmitted(false);
    onClose();
  };

  const handleChangePassword = (data) => {
    setIsLoading(true);
    UserService.changePassword(
      authTokens,
      user.user_id,
      data.oldPassword,
      data.newPassword
    )
      .then((data) => {
        showSuccessToast("Contraseña cambiada correctamente.");
        handleCloseModal();
      })
      .catch((error) => {
        showErrorToast("Error al cambiar la contraseña.");
      })
      .finally(() => setIsLoading(false));
  };

  const handleFormSubmit = (data) => {
    setFormSubmitted(true);
    handleSubmit(handleChangePassword)(data);
  };

  return (
    <div>
      <Modal
        isOpen={isOpen}
        title={"Cambiar contraseña"}
        onClose={handleCloseModal}
      >
        <div className="modal-body">
          <form>
            <div className="form-floating">
              <input
                type="password"
                name="oldPassword"
                className={`form-control ${
                  formSubmitted && errors.oldPassword ? "is-invalid" : ""
                }`}
                {...register("oldPassword", { required: true })}
              ></input>
              <label htmlFor="floatingInput">Contraseña actual</label>
              {errors.oldPassword && (
                <div className="invalid-feedback">
                  Por favor, inserte su contraseña actual
                </div>
              )}
            </div>
            <div className="form-floating mt-3">
              <input
                type="password"
                name="newPassword"
                className={`form-control ${
                  formSubmitted && errors.newPassword ? "is-invalid" : ""
                }`}
                {...register("newPassword", { required: true })}
              ></input>
              <label htmlFor="floatingInput">Contraseña nueva</label>
              {errors.newPassword && (
                <div className="invalid-feedback">
                  Por favor, inserte su nueva contraseña
                </div>
              )}
            </div>
            <div className="form-floating mt-3">
              <input
                type="password"
                name="confirmPassword"
                className={`form-control ${
                  formSubmitted && errors.confirmPassword ? "is-invalid" : ""
                }`}
                {...register("confirmPassword", {
                  required: "Por favor, inserte su nueva contraseña",
                  validate: (value) =>
                    value === getValues().newPassword ||
                    "La nueva contraseña debe coincidir",
                })}
              ></input>
              <label htmlFor="floatingInput">Confirmar nueva contraseña</label>
              {errors.confirmPassword && (
                <div className="invalid-feedback">
                  {errors.confirmPassword.message}
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
            {isLoading ? "Cambiando..." : "Cambiar"}
          </button>
        </div>
      </Modal>
    </div>
  );
}

export default ModalChangePassword;
