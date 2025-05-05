import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import Paths from "../../../routes/Paths";
import AuthContext from "../../../contexts/AuthContext";
import { useForm } from "react-hook-form";
import { ClosedEyeIcon, EyeIcon } from "../../../ui/icons";
import packageJson from "../../../../package.json";
import { showLoginToast, showErrorToast } from "../../../utils/toastUtils";

export const LoginForm = () => {
  const navigate = useNavigate();

  const { loginUser } = useContext(AuthContext);
  const [showPwd, setShowPwd] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm();

  const handleLogin = (data) => {
    loginUser({ user_name: data.username, password: data.password })
      .then((data) => {
        navigate(`${Paths.HOME}`);
        showLoginToast(getValues("username"));
      })
      .catch((error) => {
        showErrorToast("Error de autenticación");
      });
  };

  const handleFormSubmit = (data) => {
    setFormSubmitted(true);
    handleSubmit(handleLogin)(data);
  };

  return (
    <div className="card shadow d-flex bg-body-tertiary justify-content-center p-4">
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

        <p className="w-100 text-center mb-4">
          Inserte sus datos de autenticación para continuar
        </p>
        <form>
          <div className="form-floating">
            <input
              type="text"
              name="username"
              className={`form-control ${
                formSubmitted && errors.username ? "is-invalid" : ""
              }`}
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
              className={`form-control ${
                formSubmitted && errors.password ? "is-invalid" : ""
              }`}
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
            className="btn btn-primary text-white w-100 mt-4"
            onClick={handleFormSubmit}
          >
            Iniciar sesión
          </button>
        </form>
        <div className="container mt-4">
          <div className="d-flex justify-content-center align-items-center">
            <div className="flex-grow-1">
              <hr className="w-100" />
            </div>
            <div className="px-3">o</div>
            <div className="flex-grow-1">
              <hr className="w-100" />
            </div>
          </div>
        </div>
      </div>
      <div className="container-fluid px-3 mb-2">
        <Link
          className="btn btn-admin w-100 border-dark-subtle"
          to={Paths.ADMIN}
        >
          <svg
            className="me-1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            height={"1.2rem"}
          >
            <path d="M15,6c0-3.309-2.691-6-6-6S3,2.691,3,6s2.691,6,6,6,6-2.691,6-6Zm-6,3c-1.654,0-3-1.346-3-3s1.346-3,3-3,3,1.346,3,3-1.346,3-3,3Zm-.012,6.314c.103,.822-.48,1.571-1.303,1.674-2.627,.328-4.686,2.749-4.686,5.512,0,.829-.671,1.5-1.5,1.5s-1.5-.671-1.5-1.5c0-4.249,3.213-7.977,7.314-8.488,.818-.106,1.571,.48,1.674,1.303Zm14.012,3.184l-.638-.376c.084-.362,.138-.735,.138-1.123s-.054-.76-.138-1.123l.638-.376c.714-.42,.952-1.34,.531-2.054-.421-.714-1.34-.95-2.054-.531l-.648,.382c-.523-.471-1.144-.825-1.83-1.043v-.755c0-.829-.671-1.5-1.5-1.5s-1.5,.671-1.5,1.5v.755c-.686,.218-1.307,.572-1.83,1.043l-.648-.382c-.713-.418-1.632-.183-2.054,.531-.42,.714-.183,1.633,.531,2.054l.638,.376c-.084,.362-.138,.735-.138,1.123s.054,.76,.138,1.123l-.638,.376c-.714,.42-.952,1.34-.531,2.054,.28,.475,.78,.739,1.294,.739,.259,0,.521-.067,.76-.208l.648-.382c.523,.471,1.144,.825,1.83,1.043v.755c0,.829,.671,1.5,1.5,1.5s1.5-.671,1.5-1.5v-.755c.686-.218,1.307-.572,1.83-1.043l.648,.382c.239,.141,.501,.208,.76,.208,.514,0,1.014-.264,1.294-.739,.42-.714,.183-1.633-.531-2.054Zm-5.5,.001c-.827,0-1.5-.673-1.5-1.5s.673-1.5,1.5-1.5,1.5,.673,1.5,1.5-.673,1.5-1.5,1.5Z" />
          </svg>
          Continuar como administrador
        </Link>
      </div>
    </div>
  );
};
