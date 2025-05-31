import React, { useEffect, useState } from "react";
import packageJson from "../../package.json";
import {
  UsersIcon,
  HomeIcon,
  TagIcon,
  BuildIcon,
  CalendarIcon,
  SectorIcon,
  DataIcon,
  TypeIcon,
} from "../ui/icons";
import Paths from "../routes/Paths";
import { Link } from "react-router-dom";
import Copyright from "../ui/Copyright";
import useRolesInfo from "../hooks/useRolesInfo";

function Sidebar({ isOpen }) {
  // Obtener roles del usuario
  const rolesInfo = useRolesInfo();

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
        <div className="d-flex position-relative flex-row justify-content-center align-items-start">
          <Link to={Paths.HOME}>
            <img
              src={"/images/logo_he.png"}
              alt="logo"
              height={40}
              width={40}
            />
          </Link>
          <span className="version version-center">{`v${packageJson.version}`}</span>
        </div>
        <hr className="text-body" />
        <ul className="nav nav-pills flex-column mb-auto">
          <SidebarItem
            label="Resumen"
            path={Paths.HOME}
            icon={() => <HomeIcon className="nav-icon me-3" />}
            isActive={isActiveLink(Paths.HOME)}
          />
          {(rolesInfo.isOperador || rolesInfo.isConsultor) && (
            <SidebarItem
              label="Hechos"
              path={Paths.EVENTS}
              icon={() => <CalendarIcon className="nav-icon me-3" />}
              isActive={isActiveLink(Paths.EVENTS)}
            />
          )}
          {rolesInfo.isAdministrador && (
            <SidebarItem
              label="Clasificaciones"
              path={Paths.ACTIVE_CLASSIFICATIONS}
              icon={() => <TagIcon className="nav-icon me-3" />}
              isActive={isActiveLink(Paths.CLASSIFICATIONS)}
            />
          )}
          {(rolesInfo.isAdministrador || rolesInfo.isSuperuser) && (
            <SidebarItem
              label="Entidades"
              path={Paths.ACTIVE_ENTITIES}
              icon={() => <BuildIcon className="nav-icon me-3" />}
              isActive={isActiveLink(Paths.ENTITIES)}
            />
          )}
          {(rolesInfo.isAdministrador || rolesInfo.isSuperuser) && (
            <SidebarItem
              label="Sectores"
              path={Paths.ACTIVE_SECTORS}
              icon={() => <SectorIcon className="nav-icon me-3" />}
              isActive={isActiveLink(Paths.SECTORS)}
            />
          )}
          {rolesInfo.isAdministrador && (
            <SidebarItem
              label="Tipos"
              path={Paths.ACTIVE_TYPES}
              icon={() => <TypeIcon className="nav-icon me-3" />}
              isActive={isActiveLink(Paths.TYPES)}
            />
          )}
          {rolesInfo.isAdministrador && (
            <SidebarItem
              label="Campos adicionales"
              path={Paths.ACTIVE_ADDFIELDS}
              icon={() => <DataIcon className="nav-icon me-3" size="1.4rem" />}
              isActive={isActiveLink(Paths.ADDFIELDS)}
            />
          )}
          {(rolesInfo.isAdministrador || rolesInfo.isSuperuser) && (
            <SidebarItem
              label="Usuarios"
              path={Paths.ACTIVE_USERS}
              icon={() => <UsersIcon className="nav-icon me-3" size="1.4rem" />}
              isActive={isActiveLink(Paths.USERS)}
            />
          )}
        </ul>
      </div>
      <Copyright />
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
