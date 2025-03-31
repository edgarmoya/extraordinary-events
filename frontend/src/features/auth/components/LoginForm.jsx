import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Paths from "../../../routes/Paths";
import AuthContext from "../../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { ClosedEyeIcon, EyeIcon } from "../../../ui/icons";
import packageJson from "../../../../package.json";
import { showLoginToast, showErrorToast } from "../../../utils/toastUtils";
import Spinner from "../../../ui/Spinner";

export const LoginForm = () => {
  const navigate = useNavigate();

  const { loginUser } = useContext(AuthContext);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(
    "Conectando con el servidor..."
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const handleLogin = (data) => {
    loginUser(
      { user_name: data.username, password: data.password },
      setLoading,
      setStatusMessage
    )
      .then((data) => {
        navigate(`${Paths.HOME}`);
        showLoginToast(getValues("username"));
      })
      .catch((error) => {
        showErrorToast("Error de autenticación");
      });
  };

  const handleFormSubmit = (data) => {
    handleSubmit(handleLogin)(data);
  };

  return (
    <div className="card shadow bg-body-tertiary pt-2 px-3 pb-4">
      <div className="card-body">
        <div className="d-flex flex-row justify-content-center align-items-center gap-2">
          <img
            src={"/images/logo_he.png"}
            alt="logo_he"
            height={35}
            width={35}
          />
          <div className="position-relative">
            <h2 className="text-body-emphasis">Bienvenido</h2>
            <span className="version version-right">{`v${packageJson.version}`}</span>
          </div>
        </div>

        <p className="w-100 text-center mb-3">
          Inserte sus datos de autenticación para continuar
        </p>
        <form>
          <div className="form-floating">
            <input
              type="text"
              name="username"
              className={`form-control ${errors.username ? "is-invalid" : ""}`}
              placeholder="Username"
              autoComplete="username"
              {...register("username", {
                required: "Por favor, ingrese su usuario",
              })}
            ></input>
            <label htmlFor="floatingInput">Usuario</label>
            {errors.username && (
              <div className="invalid-feedback">{errors.username.message}</div>
            )}
          </div>
          <div className="form-floating mt-3">
            <input
              type={showPwd ? "text" : "password"}
              name="password"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Password"
              autoComplete="current-password"
              {...register("password", {
                required: "Por favor, ingrese su contraseña",
              })}
            ></input>
            <label htmlFor="floatingInput">Contraseña</label>
            {errors.password && (
              <div className="invalid-feedback">{errors.password.message}</div>
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
          <button
            className="btn btn-primary text-white w-100 mt-5"
            onClick={handleFormSubmit}
          >
            {loading ? (
              <>
                <Spinner />
                {statusMessage}
              </>
            ) : (
              "Iniciar sesión"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
