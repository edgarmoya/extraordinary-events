import React, { useState } from "react";
import { Check2 } from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";
import ActionButton from "../ui/ActionButton";
import { showErrorToast } from "../utils/toastUtils";

function TopBar({
  onAdd,
  onUpdate,
  onDelete,
  onActivate,
  onWatch,
  onSearch,
  watchButton,
  searchInput,
  searchMessage,
  pathAll,
  pathActive,
  pathInactive,
  textPathAll,
  textPathActive,
  textPathInactive,
  closeBtn,
}) {
  const location = useLocation(); // Obtiene la ubicación actual
  const [searchTerm, setSearchTerm] = useState("");

  // Función para verificar si el enlace debe estar activo
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const isCheck = (path) => {
    return location.pathname === path ? "" : "d-none";
  };

  return (
    <div className="row row-cols-auto justify-content-between justify-content-sm-start px-3 mt-1 column-gap-1 column-gap-sm-2 row-gap-1 row-gap-sm-0">
      <ActionButton
        tooltipText="Agregar"
        onClick={onAdd}
        svgPath={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            height={"1.5rem"}
          >
            <path d="m16.5 14.5a1.5 1.5 0 0 1 -1.5 1.5h-1.5v1.5a1.5 1.5 0 0 1 -3 0v-1.5h-1.5a1.5 1.5 0 0 1 0-3h1.5v-1.5a1.5 1.5 0 0 1 3 0v1.5h1.5a1.5 1.5 0 0 1 1.5 1.5zm5.5-6.343v10.343a5.506 5.506 0 0 1 -5.5 5.5h-9a5.506 5.506 0 0 1 -5.5-5.5v-13a5.506 5.506 0 0 1 5.5-5.5h6.343a5.464 5.464 0 0 1 3.889 1.611l2.657 2.657a5.464 5.464 0 0 1 1.611 3.889zm-3 10.343v-9.5h-4a2 2 0 0 1 -2-2v-4h-5.5a2.5 2.5 0 0 0 -2.5 2.5v13a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5z" />
          </svg>
        }
      />

      <ActionButton
        tooltipText="Modificar"
        onClick={onUpdate}
        svgPath={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            height={"1.5rem"}
          >
            <path d="m13,9c-1.105,0-2-.895-2-2V3h-5.5c-1.378,0-2.5,1.122-2.5,2.5v13c0,1.378,1.122,2.5,2.5,2.5h3c.829,0,1.5.671,1.5,1.5s-.671,1.5-1.5,1.5h-3c-3.033,0-5.5-2.467-5.5-5.5V5.5C0,2.467,2.467,0,5.5,0h6.343c1.469,0,2.85.572,3.889,1.611l2.657,2.657c1.039,1.039,1.611,2.419,1.611,3.889v1.343c0,.829-.671,1.5-1.5,1.5s-1.5-.671-1.5-1.5v-.5h-4Zm10.512,3.849c-.875-1.07-2.456-1.129-3.409-.176l-6.808,6.808c-.813.813-1.269,1.915-1.269,3.064v.955c0,.276.224.5.5.5h.955c1.149,0,2.252-.457,3.064-1.269l6.715-6.715c.85-.85,1.013-2.236.252-3.167Z" />
          </svg>
        }
      />
      <ActionButton
        tooltipText={`${closeBtn ? "Cerrar" : "Activar/Desactivar"}`}
        onClick={onActivate}
        svgPath={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            height={"1.5rem"}
          >
            <path d="m20.389 4.268-2.657-2.657a5.462 5.462 0 0 0 -3.889-1.611h-6.343a5.506 5.506 0 0 0 -5.5 5.5v13a5.506 5.506 0 0 0 5.5 5.5h9a5.506 5.506 0 0 0 5.5-5.5v-10.343a5.464 5.464 0 0 0 -1.611-3.889zm-3.889 16.732h-9a2.5 2.5 0 0 1 -2.5-2.5v-13a2.5 2.5 0 0 1 2.5-2.5h5.5v4a2 2 0 0 0 2 2h4v9.5a2.5 2.5 0 0 1 -2.5 2.5zm.586-9.534a1.5 1.5 0 0 1 -.052 2.12l-3.586 3.414a3.5 3.5 0 0 1 -4.923-.025l-1.525-1.355a1.5 1.5 0 1 1 2-2.24l1.586 1.414a.584.584 0 0 0 .414.206.5.5 0 0 0 .353-.146l3.613-3.44a1.5 1.5 0 0 1 2.12.052z" />
          </svg>
        }
      />
      <ActionButton
        tooltipText="Eliminar"
        onClick={onDelete}
        svgPath={
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            height={"1.5rem"}
          >
            <path d="m15.561 13.561-1.44 1.439 1.44 1.439a1.5 1.5 0 0 1 -2.122 2.122l-1.439-1.44-1.439 1.44a1.5 1.5 0 0 1 -2.122-2.122l1.44-1.439-1.44-1.439a1.5 1.5 0 0 1 2.122-2.122l1.439 1.44 1.439-1.44a1.5 1.5 0 0 1 2.122 2.122zm6.439-5.404v10.343a5.506 5.506 0 0 1 -5.5 5.5h-9a5.506 5.506 0 0 1 -5.5-5.5v-13a5.506 5.506 0 0 1 5.5-5.5h6.343a5.464 5.464 0 0 1 3.889 1.611l2.657 2.657a5.464 5.464 0 0 1 1.611 3.889zm-3 10.343v-9.5h-4a2 2 0 0 1 -2-2v-4h-5.5a2.5 2.5 0 0 0 -2.5 2.5v13a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5z" />
          </svg>
        }
      />

      {watchButton && (
        <ActionButton
          tooltipText="Ver"
          onClick={onWatch}
          svgPath={
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              height={"1.5rem"}
            >
              <path d="M23.8,11.478c-.13-.349-3.3-8.538-11.8-8.538S.326,11.129.2,11.478L0,12l.2.522c.13.349,3.3,8.538,11.8,8.538s11.674-8.189,11.8-8.538L24,12ZM12,18.085c-5.418,0-8.041-4.514-8.79-6.085C3.961,10.425,6.585,5.915,12,5.915S20.038,10.424,20.79,12C20.038,13.576,17.415,18.085,12,18.085Z" />
              <circle cx="12" cy="12" r="4" />
            </svg>
          }
        />
      )}

      {/* Dropdown */}
      <div
        className={`btn-group dropdown-center px-0 ${
          watchButton ? "col-12 col-sm-1" : "col-4 col-sm-1"
        }`}
      >
        <button
          className="btn bg-body text-body border-secondary-subtle shadow-sm"
          type="button"
        >
          Estado
        </button>
        <button
          type="button"
          className="btn bg-body text-body border-secondary-subtle shadow-sm dropdown-toggle dropdown-toggle-split"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <span className="visually-hidden">Toggle Dropdown</span>
        </button>
        <ul className="dropdown-menu p-1 shadow">
          <li>
            <Link
              className={`dropdown-item rounded-1 ${isActive(pathAll)}`}
              to={pathAll}
            >
              {textPathAll ? textPathAll : "Mostrar todos"}
              <Check2 className={`ms-3 ${isCheck(pathAll)}`} />
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown-item rounded-1 mt-1 ${isActive(pathActive)}`}
              to={pathActive}
            >
              {textPathActive ? textPathActive : "Mostrar activos"}
              <Check2 className={`ms-3 ${isCheck(pathActive)}`} />
            </Link>
          </li>
          <li>
            <Link
              className={`dropdown-item rounded-1 mt-1 ${isActive(
                pathInactive
              )}`}
              to={pathInactive}
            >
              {textPathInactive ? textPathInactive : "Mostrar inactivos"}
              <Check2 className={`ms-3 ${isCheck(pathInactive)}`} />
            </Link>
          </li>
        </ul>
      </div>
      {searchInput ? (
        <div className={`d-flex p-0 ms-sm-auto col-12 col-sm-4`}>
          <input
            className="form-control me-2"
            type="search"
            placeholder={searchMessage}
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value === "") {
                setSearchTerm(null);
                onSearch(null);
              }
            }}
          />
          <button
            className="btn btn-primary ms-auto"
            type="button"
            onClick={() => {
              if (searchTerm === "") {
                showErrorToast("El campo de búsqueda no puede estar vacío");
              } else {
                onSearch(searchTerm);
              }
            }}
          >
            Buscar
          </button>
        </div>
      ) : (
        <div
          className={`d-flex p-0 ms-sm-auto ${
            watchButton ? "col-12" : "col-12"
          }`}
        ></div>
      )}
    </div>
  );
}

export default TopBar;
