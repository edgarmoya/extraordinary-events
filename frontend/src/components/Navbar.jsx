import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import ModalConfirmLogout from "./ModalConfirmLogout";
import ModalChangePassword from "./ModalChangePassword";
import ModalProfile from "./ModalProfile";

function Navbar({ onToggleSidebar, pageTitle }) {
  const { user, logoutUser } = useContext(AuthContext);
  const [currentURL, setCurrentURL] = useState(window.location.pathname);
  const [modalLogoutIsOpen, setModalLogoutIsOpen] = useState(false);
  const [modalChangeIsOpen, setModalChangeIsOpen] = useState(false);
  const [modalProfileIsOpen, setModalProfileIsOpen] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setCurrentURL(window.location.pathname);
    };
    window.addEventListener("popstate", handleRouteChange);
    return () => {
      window.removeEventListener("popstate", handleRouteChange);
    };
  }, []);

  const handleChangePassword = (event) => {
    event.preventDefault();
    setModalChangeIsOpen(true);
  };

  const handleProfile = async (event) => {
    event.preventDefault();
    setModalProfileIsOpen(true);
  };

  const handleLogout = (event) => {
    event.preventDefault();
    setModalLogoutIsOpen(true);
  };

  return (
    <React.Fragment>
      <nav className="navbar bg-body-tertiary">
        <div className="container-fluid">
          <div className="col">
            {/* Toggle */}
            <button
              className="navbar-toggler me-2"
              id="toggleSidebarBtn"
              type="button"
              onClick={onToggleSidebar}
            >
              <span className="navbar-toggler-icon"></span>
            </button>

            {/* Title */}
            <a className="navbar-brand mx-3" href={currentURL}>
              {pageTitle}
            </a>
          </div>
          <div className="col-auto me-4">
            {/* User */}
            <div className="dropdown">
              <button
                className="dropdown-toggle border-0 bg-body-tertiary"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <strong>{user.username}</strong>
              </button>
              <ul className="dropdown-menu dropdown-menu-end text-small shadow">
                <li>
                  <button className="dropdown-item" onClick={handleProfile}>
                    Perfil
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item"
                    onClick={handleChangePassword}
                  >
                    Cambiar contraseña
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Modal para confirmar si desea cerrar sesión */}
      <ModalConfirmLogout
        isOpen={modalLogoutIsOpen}
        onClose={() => setModalLogoutIsOpen(false)}
        onLogout={logoutUser}
      />

      {/* Modal para cambiar contraseña */}
      <ModalChangePassword
        isOpen={modalChangeIsOpen}
        onClose={() => setModalChangeIsOpen(false)}
        onChangePassword={onToggleSidebar}
      />

      {/* Modal para ver perfil */}
      <ModalProfile
        isOpen={modalProfileIsOpen}
        onClose={() => setModalProfileIsOpen(false)}
      />
    </React.Fragment>
  );
}

export default Navbar;
