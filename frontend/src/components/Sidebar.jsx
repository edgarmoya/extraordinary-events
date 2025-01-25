import React, { useEffect, useState } from "react";
import Paths from "../routes/Paths";
import { Link } from "react-router-dom";

function Sidebar({ isOpen }) {
  // Estado para almacenar la URL actual
  const [currentURL, setCurrentURL] = useState(window.location.pathname);

  // Efecto para actualizar el estado con la URL actual cuando cambie
  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentURL(window.location.pathname);
    };

    // Agregar el evento para escuchar cambios de ruta
    window.addEventListener("popstate", handleRouteChange);

    // Eliminar el evento al desmontar el componente
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  // Función para verificar si el enlace debe estar activo
  const isActiveLink = (path) => {
    return currentURL.startsWith(path) ? "active" : "inactive";
  };

  return (
    <nav className={`sidebar p-2 shadow-sm ${isOpen ? "is-open" : ""}`}>
      <div className="sidebar-body">
        <Link
          to={Paths.HOME}
          className="d-flex justify-content-center mb-1 mb-md-0 me-md-auto"
        >
          <img
            className=""
            src={"/images/logo_he_lg.png"}
            alt="logo"
            height={36}
            width={126}
          ></img>
        </Link>
        <hr className="text-body" />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item pb-1">
            <Link
              to={Paths.HOME}
              className={`nav-link ${isActiveLink(Paths.HOME)}`}
            >
              <svg
                className="nav-icon me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="M18.556,11.385H14.011a1.388,1.388,0,0,1-1.393-1.389V5.433a3.432,3.432,0,0,0-1.331-2.722A3.307,3.307,0,0,0,8.436,2.1,11.112,11.112,0,1,0,21.9,15.579a3.309,3.309,0,0,0-.61-2.858A3.49,3.49,0,0,0,18.556,11.385Zm.433,3.459A8.115,8.115,0,1,1,9.167,5.009.3.3,0,0,1,9.239,5a.331.331,0,0,1,.2.077.461.461,0,0,1,.176.356V9.994a4.389,4.389,0,0,0,4.393,4.39h4.545a.467.467,0,0,1,.365.18A.311.311,0,0,1,18.989,14.844Z" />
                <path d="M23.651,7.446A10.073,10.073,0,0,0,16.582.372,2.014,2.014,0,0,0,14.019,2.3V7a3,3,0,0,0,3,3h4.719A2.008,2.008,0,0,0,23.651,7.446Z" />
              </svg>
              Resumen
            </Link>
          </li>
          <li className="nav-item pb-1">
            <Link
              to={Paths.EVENTS}
              className={`nav-link ${isActiveLink(Paths.EVENTS)}`}
            >
              <svg
                className="nav-icon me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="m18.5,2h-.5v-.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5,1.5v.5h-6v-.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5,1.5v.5h-.5C2.468,2,0,4.467,0,7.5v11c0,3.033,2.468,5.5,5.5,5.5h13c3.032,0,5.5-2.467,5.5-5.5V7.5c0-3.033-2.468-5.5-5.5-5.5Zm0,19H5.5c-1.379,0-2.5-1.122-2.5-2.5v-9.5h18v9.5c0,1.378-1.121,2.5-2.5,2.5Zm-8.5-8.5v2c0,.828-.672,1.5-1.5,1.5h-2c-.828,0-1.5-.672-1.5-1.5v-2c0-.828.672-1.5,1.5-1.5h2c.828,0,1.5.672,1.5,1.5Z" />
              </svg>
              Hechos
            </Link>
          </li>
          <li className="nav-item pb-1">
            <Link
              to={Paths.ACTIVE_CLASSIFICATIONS}
              className={`nav-link ${isActiveLink(Paths.CLASSIFICATIONS)}`}
            >
              <svg
                className="nav-icon me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="M21.557,7.153L15.318,.964C14.547,.232,13.5-.105,12.447,.03L5.821,.905c-.821,.109-1.399,.862-1.291,1.684,.108,.822,.867,1.402,1.684,1.291l6.626-.875c.15-.02,.301,.028,.388,.112l6.201,6.152c.757,.773,.756,2.03,.007,2.793l-.512,.512c-.113-.145-.236-.285-.367-.419l-6.238-6.189c-.771-.732-1.819-1.07-2.871-.935l-6.626,.875c-.701,.093-1.242,.663-1.299,1.368l-.511,6.396c-.086,1.059,.307,2.086,1.054,2.795l6.086,6.035c.947,.967,2.214,1.5,3.567,1.501h.005c1.352,0,2.617-.53,3.564-1.494l3.278-3.333c.927-.944,1.401-2.178,1.421-3.421l1.579-1.579c1.896-1.929,1.898-5.072-.01-7.02Zm-5.13,9.917l-3.277,3.333c-.379,.386-.887,.598-1.428,.598-.542,0-1.049-.214-1.442-.616l-6.124-6.072c-.109-.104-.166-.25-.153-.402l.414-5.189,5.424-.716c.148-.024,.301,.028,.388,.112l6.201,6.152c.757,.773,.756,2.03-.002,2.802Zm-7.427-5.57c-.034,1.972-2.967,1.971-3,0,.034-1.972,2.967-1.971,3,0Z" />
              </svg>
              Clasificaciones
            </Link>
          </li>
          <li className="nav-item pb-1">
            <Link
              to={Paths.ACTIVE_ENTITIES}
              className={`nav-link ${isActiveLink(Paths.ENTITIES)}`}
            >
              <svg
                className="nav-icon me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="M18.5,5H15.975A5.506,5.506,0,0,0,10.5,0h-5A5.506,5.506,0,0,0,0,5.5v13A5.506,5.506,0,0,0,5.5,24h13A5.506,5.506,0,0,0,24,18.5v-8A5.506,5.506,0,0,0,18.5,5ZM3,18.5V5.5A2.5,2.5,0,0,1,5.5,3h5A2.5,2.5,0,0,1,13,5.5V21H5.5A2.5,2.5,0,0,1,3,18.5Zm18,0A2.5,2.5,0,0,1,18.5,21H16V8h2.5A2.5,2.5,0,0,1,21,10.5Zm-1-7A1.5,1.5,0,1,1,18.5,10,1.5,1.5,0,0,1,20,11.5Zm0,5A1.5,1.5,0,1,1,18.5,15,1.5,1.5,0,0,1,20,16.5ZM7,6.5A1.5,1.5,0,1,1,5.5,5,1.5,1.5,0,0,1,7,6.5Zm0,5A1.5,1.5,0,1,1,5.5,10,1.5,1.5,0,0,1,7,11.5Zm5-5A1.5,1.5,0,1,1,10.5,5,1.5,1.5,0,0,1,12,6.5Zm0,5A1.5,1.5,0,1,1,10.5,10,1.5,1.5,0,0,1,12,11.5Zm-5,5A1.5,1.5,0,1,1,5.5,15,1.5,1.5,0,0,1,7,16.5Zm5,0A1.5,1.5,0,1,1,10.5,15,1.5,1.5,0,0,1,12,16.5Z" />
              </svg>
              Entidades
            </Link>
          </li>
          <li className="nav-item pb-1">
            <Link
              to={Paths.ACTIVE_SECTORS}
              className={`nav-link ${isActiveLink(Paths.SECTORS)}`}
            >
              <svg
                className="nav-icon me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="M24,9.924V18.5A5.506,5.506,0,0,1,18.5,24a1.5,1.5,0,0,1,0-3A2.5,2.5,0,0,0,21,18.5V9.924a2.5,2.5,0,0,0-1.1-2.073L13.3,3.4a2.306,2.306,0,0,0-2.593,0L4.1,7.851A2.5,2.5,0,0,0,3,9.924V18.5A2.5,2.5,0,0,0,5.5,21a1.5,1.5,0,0,1,0,3A5.506,5.506,0,0,1,0,18.5V9.924a5.5,5.5,0,0,1,2.423-4.56L9.025.91a5.29,5.29,0,0,1,5.95,0l6.6,4.454A5.5,5.5,0,0,1,24,9.924ZM19,15a6.95,6.95,0,0,1-2.05,4.949l-3.593,3.515a1.932,1.932,0,0,1-2.712,0L7.062,19.961A7,7,0,1,1,19,15Zm-3,0a4,4,0,1,0-6.829,2.828L12,20.6l2.84-2.779A3.963,3.963,0,0,0,16,15Zm-4-2a2,2,0,1,0,2,2A2,2,0,0,0,12,13Z" />
              </svg>
              Sectores
            </Link>
          </li>
          <li className="nav-item pb-1">
            <Link
              to={Paths.ACTIVE_TYPES}
              className={`nav-link ${isActiveLink(Paths.TYPES)}`}
            >
              <svg
                className="nav-icon me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="m18.5 4h-3.5v-1a3.005 3.005 0 0 0 -3.6-2.942 3.081 3.081 0 0 0 -2.4 3.06v.882h-3.5a5.507 5.507 0 0 0 -5.5 5.5v9a5.507 5.507 0 0 0 5.5 5.5h13a5.507 5.507 0 0 0 5.5-5.5v-9a5.507 5.507 0 0 0 -5.5-5.5zm2.5 14.5a2.5 2.5 0 0 1 -2.5 2.5h-13a2.5 2.5 0 0 1 -2.5-2.5v-9a2.5 2.5 0 0 1 2.5-2.5h3.684a2.982 2.982 0 0 0 5.632 0h3.684a2.5 2.5 0 0 1 2.5 2.5zm-11-5.5v4a2 2 0 0 1 -2 2h-1a2 2 0 0 1 -2-2v-4a2 2 0 0 1 2-2h1a2 2 0 0 1 2 2zm8 4.5a1.5 1.5 0 0 1 -1.5 1.5h-3a1.5 1.5 0 0 1 0-3h3a1.5 1.5 0 0 1 1.5 1.5zm1-5a1.5 1.5 0 0 1 -1.5 1.5h-4a1.5 1.5 0 0 1 0-3h4a1.5 1.5 0 0 1 1.5 1.5z" />
              </svg>
              Tipos
            </Link>
          </li>
          <li className="nav-item pb-1">
            <Link
              to={Paths.ACTIVE_ADDFIELDS}
              className={`nav-link ${isActiveLink(Paths.ADDFIELDS)}`}
            >
              <svg
                className="nav-icon me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.4rem"}
              >
                <path d="m22.562 8.5a4.994 4.994 0 0 0 -3.562-8.5h-14a4.994 4.994 0 0 0 -3.562 8.5 4.978 4.978 0 0 0 0 7 4.994 4.994 0 0 0 3.562 8.5h14a4.994 4.994 0 0 0 3.562-8.5 4.978 4.978 0 0 0 0-7zm-17.562 5.5a2 2 0 0 1 0-4v.5a1.5 1.5 0 0 0 3 0v-.5h2v.5a1.5 1.5 0 0 0 3 0v-.5h6a2 2 0 0 1 0 4zm0-11v.5a1.5 1.5 0 0 0 3 0v-.5h2v.5a1.5 1.5 0 0 0 3 0v-.5h6a2 2 0 0 1 0 4h-14a2 2 0 0 1 0-4zm14 18h-14a2 2 0 0 1 0-4v.5a1.5 1.5 0 0 0 3 0v-.5h2v.5a1.5 1.5 0 0 0 3 0v-.5h6a2 2 0 0 1 0 4z" />
              </svg>
              Campos adicionales
            </Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-footer text-center pt-0">
        <hr className="text-body" />
        <a
          className="fs-small text-body text-decoration-none fw-bold"
          href="https://www.datazucar.cu/"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src={"/images/datazucar.png"}
            className="mb-1 me-1"
            alt="DATAZUCAR"
            width="15"
            height="15"
          />
          DATAZUCAR © 2025
          <br />
          <span className="fw-light">Todos los derechos reservados.</span>
        </a>
      </div>
    </nav>
  );
}

export default Sidebar;
