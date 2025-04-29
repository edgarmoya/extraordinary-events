import { React, useState, useEffect } from "react";
import Modal from "../../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { useForm } from "react-hook-form";
import UserService from "../../../api/users.api";
import { ClosedEyeIcon, EyeIcon } from "../../../ui/icons";
import Spinner from "../../../ui/Spinner";
import useApiMutation from "../../../hooks/useApiMutation";

function ModalUsers({ isOpen, onClose, onRefresh, title, userData }) {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfPwd, setShowConfPwd] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  // Observa el valor del campo "password"
  const passwordWatch = watch("password");

  // Resetear formulario cada vez que se abre el modal
  useEffect(() => {
    if (isOpen) {
      reset(userData || {}); // Restaura con los datos del usuario o vacíos si es un nuevo usuario
    }
  }, [isOpen, userData, reset]);

  const handleCloseModal = () => {
    reset();
    onClose();
  };

  const { execute: createUser, loading: creating } = useApiMutation(
    UserService.addUser,
    {
      onSuccess: () => {
        showSuccessToast("Usuario agregado con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const { execute: updateUser, loading: updating } = useApiMutation(
    UserService.updateUser,
    {
      onSuccess: () => {
        showSuccessToast("Usuario actualizado con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const onSubmit = (data) => {
    if (userData?.id) {
      // Si hay un usuario, estamos editando
      updateUser({ id: userData?.id, ...data }, setError);
    } else {
      // Si no hay usuario, estamos creando uno nuevo
      createUser(data, setError);
    }
  };

  return (
    <Modal isOpen={isOpen} title={title} onClose={handleCloseModal}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="modal-body">
          <div className="form-floating">
            <input
              type="text"
              name="user_name"
              className={`form-control ${errors.user_name ? "is-invalid" : ""}`}
              defaultValue={userData?.user_name}
              {...register("user_name", {
                required: "Por favor, inserte el usuario",
                minLength: {
                  value: 3,
                  message: "El usuario debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 20,
                  message:
                    "El usuario debe no puede tener más de 20 caracteres",
                },
                pattern: {
                  value: /^[a-zA-Z0-9_]*$/,
                  message: "El usuario no debe contener caracteres especiales",
                },
              })}
              autoFocus={true}
            />
            <label htmlFor="floatingInput">Usuario*</label>
            {errors.user_name && (
              <div className="invalid-feedback">{errors.user_name.message}</div>
            )}
          </div>
          <div className="form-floating mt-2">
            <input
              type="text"
              name="first_name"
              className={`form-control ${
                errors.first_name ? "is-invalid" : ""
              }`}
              defaultValue={userData?.first_name}
              {...register("first_name", { required: true })}
            />
            <label htmlFor="floatingInput">Nombre*</label>
            {errors.first_name && (
              <div className="invalid-feedback">
                Por favor, inserte el nombre
              </div>
            )}
          </div>
          <div className="form-floating mt-2">
            <input
              type="text"
              name="last_name"
              className={`form-control ${errors.last_name ? "is-invalid" : ""}`}
              defaultValue={userData?.last_name}
              {...register("last_name", { required: true })}
            />
            <label htmlFor="floatingInput">Apellidos*</label>
            {errors.last_name && (
              <div className="invalid-feedback">
                Por favor, inserte los apellidos
              </div>
            )}
          </div>
          {!userData?.id && (
            <>
              <div className="form-floating mt-2">
                <input
                  type={showPwd ? "text" : "password"}
                  name="password"
                  className={`form-control ${
                    errors.password ? "is-invalid" : ""
                  }`}
                  {...register("password", {
                    required: "La contraseña es obligatoria",
                  })}
                ></input>
                <label htmlFor="floatingInput">Contraseña*</label>
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}
                {!errors.password && (
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
                  name="confirm_password"
                  className={`form-control ${
                    errors.confirm_password ? "is-invalid" : ""
                  }`}
                  {...register("confirm_password", {
                    required: "Debes confirmar la contraseña",
                    validate: (value) =>
                      value === passwordWatch || "Las contraseñas no coinciden",
                  })}
                ></input>
                <label htmlFor="floatingInput">Confirmar contraseña*</label>
                {errors.confirm_password && (
                  <div className="invalid-feedback">
                    {errors.confirm_password.message}
                  </div>
                )}
                {!errors.confirm_password && (
                  <div
                    className="position-absolute pointer pwd-icon"
                    onClick={() => setShowConfPwd(!showConfPwd)}
                  >
                    {showConfPwd ? <EyeIcon /> : <ClosedEyeIcon />}
                  </div>
                )}
              </div>
            </>
          )}
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
            {userData ? (
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
  );
}

export default ModalUsers;
