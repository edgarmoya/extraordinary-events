import React, { useEffect, useState } from "react";
import {
  UsersIcon,
  HomeIcon,
  TagIcon,
  BuildIcon,
  CalendarIcon,
} from "../ui/icons";
import Paths from "../routes/Paths";
import { Link } from "react-router-dom";
import SectorIcon from "../ui/icons/SectorIcon";
import DataIcon from "../ui/icons/DataIcon";
import TypeIcon from "../ui/icons/TypeIcon";

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
    <nav className={`sidebar p-2 shadow-sm ${isOpen ? "open" : ""}`}>
      <div className="sidebar-body">
        <Link
          to={Paths.HOME}
          className="d-flex justify-content-center mb-md-0 me-md-auto"
        >
          <img
            className=""
            src={"/images/logo_he.png"}
            alt="logo"
            height={40}
            width={40}
          ></img>
        </Link>
        <hr className="text-body" />
        <ul className="nav nav-pills flex-column mb-auto">
          <SidebarItem
            label="Resumen"
            path={Paths.HOME}
            icon={() => <HomeIcon className="nav-icon me-3" />}
            isActive={isActiveLink(Paths.HOME)}
          />
          <SidebarItem
            label="Hechos"
            path={Paths.EVENTS}
            icon={() => <CalendarIcon className="nav-icon me-3" />}
            isActive={isActiveLink(Paths.EVENTS)}
          />
          <SidebarItem
            label="Clasificaciones"
            path={Paths.ACTIVE_CLASSIFICATIONS}
            icon={() => <TagIcon className="nav-icon me-3" />}
            isActive={isActiveLink(Paths.CLASSIFICATIONS)}
          />
          <SidebarItem
            label="Entidades"
            path={Paths.ACTIVE_ENTITIES}
            icon={() => <BuildIcon className="nav-icon me-3" />}
            isActive={isActiveLink(Paths.ENTITIES)}
          />
          <SidebarItem
            label="Sectores"
            path={Paths.ACTIVE_SECTORS}
            icon={() => <SectorIcon className="nav-icon me-3" />}
            isActive={isActiveLink(Paths.SECTORS)}
          />
          <SidebarItem
            label="Tipos"
            path={Paths.ACTIVE_TYPES}
            icon={() => <TypeIcon className="nav-icon me-3" />}
            isActive={isActiveLink(Paths.TYPES)}
          />
          <SidebarItem
            label="Campos adicionales"
            path={Paths.ACTIVE_ADDFIELDS}
            icon={() => <DataIcon className="nav-icon me-3" size="1.4rem" />}
            isActive={isActiveLink(Paths.ADDFIELDS)}
          />
          <SidebarItem
            label="Usuarios"
            path={Paths.ACTIVE_USERS}
            icon={() => <UsersIcon className="nav-icon me-3" size="1.4rem" />}
            isActive={isActiveLink(Paths.USERS)}
          />
        </ul>
      </div>
      <div className="text-center mt-auto">
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

function SidebarItem({ label, icon: Icon, path, isActive }) {
  return (
    <li className="nav-item pb-1">
      <Link to={path} className={`nav-link ${isActive}`}>
        <Icon />
        {label}
      </Link>
    </li>
  );
}

export default Sidebar;
