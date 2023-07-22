import React, { useState, useEffect } from "react";
import Paths from "../routes/Paths";

function Sidebar() {
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
    return currentURL === path ? "active" : "link-body-emphasis";
  };

  return (
    <div
      className="offcanvas offcanvas-start"
      tabindex="-1"
      id="offcanvasExample"
      aria-labelledby="offcanvasExampleLabel"
    >
      <div className="offcanvas-header mx-2">
        <h5 className="offcanvas-title" id="offcanvasExampleLabel">
          Hechos Extraordinarios
        </h5>
        <button
          type="button"
          className="btn-close"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div className="offcanvas-body mx-2">
        <ul className="nav nav-pills flex-column mb-auto">
          <li>
            <a
              href={Paths.HOME}
              className={`nav-link ${isActiveLink(Paths.HOME)}`}
            >
              <svg
                className="me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="M22,5.644V2.5c0-.829-.672-1.5-1.5-1.5s-1.5,.671-1.5,1.5v1.089L15.076,.941c-1.869-1.262-4.283-1.262-6.152,0L2.424,5.327C.906,6.351,0,8.055,0,9.886v8.614c0,3.033,2.468,5.5,5.5,5.5h3c.828,0,1.5-.671,1.5-1.5V14.5c0-.276,.225-.5,.5-.5h3c.275,0,.5,.224,.5,.5v8c0,.829,.672,1.5,1.5,1.5h3c3.032,0,5.5-2.467,5.5-5.5V9.886c0-1.654-.739-3.204-2-4.242Zm-1,12.856c0,1.378-1.121,2.5-2.5,2.5h-1.5v-6.5c0-1.93-1.57-3.5-3.5-3.5h-3c-1.93,0-3.5,1.57-3.5,3.5v6.5h-1.5c-1.379,0-2.5-1.122-2.5-2.5V9.886c0-.833,.412-1.607,1.102-2.073L10.602,3.427c.85-.573,1.947-.573,2.797,0l6.5,4.387c.689,.465,1.102,1.24,1.102,2.072v8.614Z" />
              </svg>
              Panel de Control
            </a>
          </li>
          <li>
            <a
              href={Paths.EVENTS}
              className={`nav-link ${isActiveLink(Paths.EVENTS)}`}
            >
              <svg
                className="me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="m18.5,2h-.5v-.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5,1.5v.5h-6v-.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5,1.5v.5h-.5C2.468,2,0,4.467,0,7.5v11c0,3.033,2.468,5.5,5.5,5.5h13c3.032,0,5.5-2.467,5.5-5.5V7.5c0-3.033-2.468-5.5-5.5-5.5Zm0,19H5.5c-1.379,0-2.5-1.122-2.5-2.5v-9.5h18v9.5c0,1.378-1.121,2.5-2.5,2.5Zm-8.5-8.5v2c0,.828-.672,1.5-1.5,1.5h-2c-.828,0-1.5-.672-1.5-1.5v-2c0-.828.672-1.5,1.5-1.5h2c.828,0,1.5.672,1.5,1.5Z" />
              </svg>
              Hechos
            </a>
          </li>
          <li>
            <a
              href={Paths.ENTITIES}
              className={`nav-link ${isActiveLink(Paths.ENTITIES)}`}
            >
              <svg
                className="me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="M18.5,5H15.975A5.506,5.506,0,0,0,10.5,0h-5A5.506,5.506,0,0,0,0,5.5v13A5.506,5.506,0,0,0,5.5,24h13A5.506,5.506,0,0,0,24,18.5v-8A5.506,5.506,0,0,0,18.5,5ZM3,18.5V5.5A2.5,2.5,0,0,1,5.5,3h5A2.5,2.5,0,0,1,13,5.5V21H5.5A2.5,2.5,0,0,1,3,18.5Zm18,0A2.5,2.5,0,0,1,18.5,21H16V8h2.5A2.5,2.5,0,0,1,21,10.5Zm-1-7A1.5,1.5,0,1,1,18.5,10,1.5,1.5,0,0,1,20,11.5Zm0,5A1.5,1.5,0,1,1,18.5,15,1.5,1.5,0,0,1,20,16.5ZM7,6.5A1.5,1.5,0,1,1,5.5,5,1.5,1.5,0,0,1,7,6.5Zm0,5A1.5,1.5,0,1,1,5.5,10,1.5,1.5,0,0,1,7,11.5Zm5-5A1.5,1.5,0,1,1,10.5,5,1.5,1.5,0,0,1,12,6.5Zm0,5A1.5,1.5,0,1,1,10.5,10,1.5,1.5,0,0,1,12,11.5Zm-5,5A1.5,1.5,0,1,1,5.5,15,1.5,1.5,0,0,1,7,16.5Zm5,0A1.5,1.5,0,1,1,10.5,15,1.5,1.5,0,0,1,12,16.5Z" />
              </svg>
              Entidades
            </a>
          </li>
          <li>
            <a
              href={Paths.CLASSIFICATION}
              className={`nav-link ${isActiveLink(Paths.CLASSIFICATION)}`}
            >
              <svg
                className="me-3"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="m18.5,2h-.5v-.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5,1.5v.5h-6v-.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5,1.5v.5h-.5C2.468,2,0,4.467,0,7.5v11c0,3.033,2.468,5.5,5.5,5.5h13c3.032,0,5.5-2.467,5.5-5.5V7.5c0-3.033-2.468-5.5-5.5-5.5Zm0,19H5.5c-1.379,0-2.5-1.122-2.5-2.5v-9.5h18v9.5c0,1.378-1.121,2.5-2.5,2.5Zm-8.5-8.5v2c0,.828-.672,1.5-1.5,1.5h-2c-.828,0-1.5-.672-1.5-1.5v-2c0-.828.672-1.5,1.5-1.5h2c.828,0,1.5.672,1.5,1.5Z" />
              </svg>
              Clasificación
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
