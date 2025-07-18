import React, { useState } from "react";
import Modal from "../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import UserService from "../../api/users.api";
import { useForm } from "react-hook-form";
import useApiMutation from "../../hooks/useApiMutation";
import { EyeIcon, ClosedEyeIcon } from "../../ui/icons";
import Spinner from "../../ui/Spinner";

function ModalChangePassword({
  isOpen,
  title,
  userId,
  showOldPassword = true,
  onClose,
  onPasswordChange,
}) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    getValues,
  } = useForm();

  // Observa el valor del campo "new_password"
  const passwordWatch = watch("new_password");

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  const { execute: changePassword, loading } = useApiMutation(
    UserService.changePassword,
    {
      onSuccess: () => {
        showSuccessToast("Contraseña cambiada correctamente");
        onPasswordChange && onPasswordChange(getValues("new_password"));
        handleCloseModal();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const onSubmit = (data) => {
    changePassword({ id: userId, ...data }, setError);
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={handleCloseModal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="modal-body">
          {showOldPassword && (
            <div className="form-floating">
              <input
                type="password"
                name="old_password"
                autoComplete="current-password"
                className={`form-control ${
                  errors.old_password ? "is-invalid" : ""
                }`}
                {...register("old_password", { required: true })}
              ></input>
              <label htmlFor="floatingInput">Contraseña actual*</label>
              {errors.old_password && (
                <div className="invalid-feedback">
                  Por favor, inserte su contraseña actual
                </div>
              )}
            </div>
          )}
          <div className={`form-floating ${showOldPassword && "mt-2"}`}>
            <input
              type={showPwd ? "text" : "password"}
              name="new_password"
              autoComplete="new-password"
              className={`form-control ${
                errors.new_password ? "is-invalid" : ""
              }`}
              {...register("new_password", {
                required: "La contraseña es obligatoria",
              })}
            ></input>
            <label htmlFor="floatingInput">Nueva contraseña*</label>
            {errors.new_password && (
              <div className="invalid-feedback">
                {errors.new_password.message}
              </div>
            )}
            {!errors.new_password && (
              <div
                className="position-absolute pointer pwd-icon"
                onClick={() => setShowPwd(!showPwd)}
              >
                {showPwd ? <EyeIcon /> : <ClosedEyeIcon />}
              </div>
            )}
          </div>
          <div className="form-floating mt-2">
            <input
              type={showConfPwd ? "text" : "password"}
              name="confirm_new_password"
              autoComplete="new-password"
              className={`form-control ${
                errors.confirm_new_password ? "is-invalid" : ""
              }`}
              {...register("confirm_new_password", {
                required: "Debes confirmar la contraseña",
                validate: (value) =>
                  value === passwordWatch || "Las contraseñas no coinciden",
              })}
            ></input>
            <label htmlFor="floatingInput">Confirmar contraseña*</label>
            {errors.confirm_new_password && (
              <div className="invalid-feedback">
                {errors.confirm_new_password.message}
              </div>
            )}
            {!errors.confirm_new_password && (
              <div
                className="position-absolute pointer pwd-icon"
                onClick={() => setShowConfPwd(!showConfPwd)}
              >
                {showConfPwd ? <EyeIcon /> : <ClosedEyeIcon />}
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="submit"
            className="btn btn-primary text-white"
            disabled={loading}
          >
            {loading ? (
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
  );
}

export default ModalChangePassword;
