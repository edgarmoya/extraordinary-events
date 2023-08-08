import React, { useState, useEffect } from "react";
import { Check2 } from "react-bootstrap-icons";

function TopBar({
  onAdd,
  onUpdate,
  onDelete,
  onActivate,
  onWatch,
  onSearch,
  watchButton,
  searchMessage,
  pathAll,
  pathActive,
  pathInactive,
}) {
  const [currentURL, setCurrentURL] = useState(window.location.pathname);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentURL(window.location.pathname);
    };
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Función para verificar si el enlace debe estar activo
  const isActive = (path) => {
    return currentURL === path ? "active" : "";
  };

  const isCheck = (path) => {
    return currentURL === path ? "" : "d-none";
  };

  const handleClearSearch = () => {
    setSearchTerm("");
    onSearch("");
  };

  return (
    <div className="row row-cols-md-auto justify-content-between px-3 mt-1">
      <button
        name="addBtn"
        type="button"
        onClick={onAdd}
        className="btn border-secondary-subtle btn-accions-blue shadow-sm me-md-2 col-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          height={"1.5rem"}
        >
          <path d="m16.5 14.5a1.5 1.5 0 0 1 -1.5 1.5h-1.5v1.5a1.5 1.5 0 0 1 -3 0v-1.5h-1.5a1.5 1.5 0 0 1 0-3h1.5v-1.5a1.5 1.5 0 0 1 3 0v1.5h1.5a1.5 1.5 0 0 1 1.5 1.5zm5.5-6.343v10.343a5.506 5.506 0 0 1 -5.5 5.5h-9a5.506 5.506 0 0 1 -5.5-5.5v-13a5.506 5.506 0 0 1 5.5-5.5h6.343a5.464 5.464 0 0 1 3.889 1.611l2.657 2.657a5.464 5.464 0 0 1 1.611 3.889zm-3 10.343v-9.5h-4a2 2 0 0 1 -2-2v-4h-5.5a2.5 2.5 0 0 0 -2.5 2.5v13a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5z" />
        </svg>
      </button>
      <button
        name="updateBtn"
        type="button"
        onClick={onUpdate}
        className="btn border-secondary-subtle btn-accions-blue shadow-sm me-md-2 col-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          height={"1.5rem"}
        >
          <path d="m13,9c-1.105,0-2-.895-2-2V3h-5.5c-1.378,0-2.5,1.122-2.5,2.5v13c0,1.378,1.122,2.5,2.5,2.5h3c.829,0,1.5.671,1.5,1.5s-.671,1.5-1.5,1.5h-3c-3.033,0-5.5-2.467-5.5-5.5V5.5C0,2.467,2.467,0,5.5,0h6.343c1.469,0,2.85.572,3.889,1.611l2.657,2.657c1.039,1.039,1.611,2.419,1.611,3.889v1.343c0,.829-.671,1.5-1.5,1.5s-1.5-.671-1.5-1.5v-.5h-4Zm10.512,3.849c-.875-1.07-2.456-1.129-3.409-.176l-6.808,6.808c-.813.813-1.269,1.915-1.269,3.064v.955c0,.276.224.5.5.5h.955c1.149,0,2.252-.457,3.064-1.269l6.715-6.715c.85-.85,1.013-2.236.252-3.167Z" />
        </svg>
      </button>
      <button
        name="activateBtn"
        type="button"
        onClick={onActivate}
        className="btn border-secondary-subtle btn-accions-blue shadow-sm me-md-2 col-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          height={"1.5rem"}
        >
          <path d="m20.389 4.268-2.657-2.657a5.462 5.462 0 0 0 -3.889-1.611h-6.343a5.506 5.506 0 0 0 -5.5 5.5v13a5.506 5.506 0 0 0 5.5 5.5h9a5.506 5.506 0 0 0 5.5-5.5v-10.343a5.464 5.464 0 0 0 -1.611-3.889zm-3.889 16.732h-9a2.5 2.5 0 0 1 -2.5-2.5v-13a2.5 2.5 0 0 1 2.5-2.5h5.5v4a2 2 0 0 0 2 2h4v9.5a2.5 2.5 0 0 1 -2.5 2.5zm.586-9.534a1.5 1.5 0 0 1 -.052 2.12l-3.586 3.414a3.5 3.5 0 0 1 -4.923-.025l-1.525-1.355a1.5 1.5 0 1 1 2-2.24l1.586 1.414a.584.584 0 0 0 .414.206.5.5 0 0 0 .353-.146l3.613-3.44a1.5 1.5 0 0 1 2.12.052z" />
        </svg>
      </button>
      <button
        name="deleteBtn"
        type="button"
        onClick={onDelete}
        className="btn border-secondary-subtle btn-accions-red shadow-sm me-md-2 col-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          height={"1.5rem"}
        >
          <path d="m15.561 13.561-1.44 1.439 1.44 1.439a1.5 1.5 0 0 1 -2.122 2.122l-1.439-1.44-1.439 1.44a1.5 1.5 0 0 1 -2.122-2.122l1.44-1.439-1.44-1.439a1.5 1.5 0 0 1 2.122-2.122l1.439 1.44 1.439-1.44a1.5 1.5 0 0 1 2.122 2.122zm6.439-5.404v10.343a5.506 5.506 0 0 1 -5.5 5.5h-9a5.506 5.506 0 0 1 -5.5-5.5v-13a5.506 5.506 0 0 1 5.5-5.5h6.343a5.464 5.464 0 0 1 3.889 1.611l2.657 2.657a5.464 5.464 0 0 1 1.611 3.889zm-3 10.343v-9.5h-4a2 2 0 0 1 -2-2v-4h-5.5a2.5 2.5 0 0 0 -2.5 2.5v13a2.5 2.5 0 0 0 2.5 2.5h9a2.5 2.5 0 0 0 2.5-2.5z" />
        </svg>
      </button>
      {watchButton && (
        <button
          name="watchBtn"
          type="button"
          onClick={onWatch}
          className="btn border-secondary-subtle btn-accions-blue shadow-sm me-md-2 col-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            height={"1.5rem"}
          >
            <path d="M23.8,11.478c-.13-.349-3.3-8.538-11.8-8.538S.326,11.129.2,11.478L0,12l.2.522c.13.349,3.3,8.538,11.8,8.538s11.674-8.189,11.8-8.538L24,12ZM12,18.085c-5.418,0-8.041-4.514-8.79-6.085C3.961,10.425,6.585,5.915,12,5.915S20.038,10.424,20.79,12C20.038,13.576,17.415,18.085,12,18.085Z" />
            <circle cx="12" cy="12" r="4" />
          </svg>
        </button>
      )}

      {/* Dropdown */}
      <div
        className={`btn-group dropdown-center px-0 ${
          watchButton ? "col-3 mt-2 mt-md-0" : "col-4"
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
            <a
              className={`dropdown-item rounded-1 ${isActive(pathAll)}`}
              href={pathAll}
            >
              Mostrar todos
              <Check2 className={`ms-3 ${isCheck(pathAll)}`} />
            </a>
          </li>
          <li>
            <a
              className={`dropdown-item rounded-1 mt-1 ${isActive(pathActive)}`}
              href={pathActive}
            >
              Mostrar activos
              <Check2 className={`ms-3 ${isCheck(pathActive)}`} />
            </a>
          </li>
          <li>
            <a
              className={`dropdown-item rounded-1 mt-1 ${isActive(
                pathInactive
              )}`}
              href={pathInactive}
            >
              Mostrar inactivos
              <Check2 className={`ms-3 ${isCheck(pathInactive)}`} />
            </a>
          </li>
        </ul>
      </div>
      <div
        className={`d-flex p-0 ms-sm-auto mt-2 mt-md-0 ${
          watchButton ? "col-8" : "col-12"
        }`}
      >
        <input
          className="form-control me-2"
          type="search"
          placeholder={searchMessage}
          aria-label="Search"
          value={searchTerm}
          onClick={handleClearSearch}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button
          className="btn btn-primary ms-auto"
          type="button"
          onClick={() => onSearch(searchTerm)}
        >
          Buscar
        </button>
      </div>
    </div>
  );
}

export default TopBar;
