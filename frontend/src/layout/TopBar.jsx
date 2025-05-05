import React, { useState } from "react";
import { Check2 } from "react-bootstrap-icons";
import { Link, useLocation } from "react-router-dom";
import { showErrorToast } from "../utils/toastUtils";
import Tooltip from "../ui/Tooltip";

const TopBar = ({ children }) => {
  return (
    <div className="row row-cols-auto justify-content-between justify-content-sm-start mx-0 mt-1 column-gap-1 column-gap-md-2 row-gap-1 row-gap-md-0">
      {children}
    </div>
  );
};

function Button({ label, onClick, icon: Icon, disabled }) {
  return (
    <Tooltip
      tooltipText={label}
      childClassName="p-0 flex-grow-1 flex-md-grow-0"
    >
      <button
        type="button"
        onClick={onClick}
        className="btn-accion shadow-sm w-100"
        disabled={disabled}
      >
        <Icon />
      </button>
    </Tooltip>
  );
}

function Dropdown({
  pathAll,
  pathActive,
  pathInactive,
  textPathAll,
  textPathActive,
  textPathInactive,
}) {
  const location = useLocation(); // Obtiene la ubicación actual

  // Función para verificar si el enlace debe estar activo
  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  const isCheck = (path) => {
    return location.pathname === path ? "" : "d-none";
  };

  return (
    <div className="btn-group dropdown-center px-0 col-12 col-md-1">
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
            className={`dropdown-item rounded-1 mt-1 ${isActive(pathInactive)}`}
            to={pathInactive}
          >
            {textPathInactive ? textPathInactive : "Mostrar inactivos"}
            <Check2 className={`ms-3 ${isCheck(pathInactive)}`} />
          </Link>
        </li>
      </ul>
    </div>
  );
}

function Search({ onSearch, searchMessage }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className={`d-flex p-0 ms-sm-auto col-12 col-md-4`}>
      <input
        className="form-control me-2 border-1 border-secondary-subtle shadow-sm"
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
        className="btn btn-primary text-white ms-auto shadow-sm"
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
  );
}

TopBar.Button = Button;
TopBar.Dropdown = Dropdown;
TopBar.Search = Search;
export default TopBar;
