import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../../contexts/AuthContext";
import ModalConfirmLogout from "./ModalConfirmLogout";
import ModalChangePassword from "./ModalChangePassword";
import ModalProfile from "./ModalProfile";
import ThemeToggle from "./ThemeToggle";
import { MenuIcon } from "../../ui/icons";

function Navbar({ onToggleSidebar, onSwitchTheme, pageTitle, theme }) {
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
    <>
      <header className="navbar bg-body-secondary">
        <div className="container-fluid mx-3 px-0">
          <div className="col-auto">
            {/* Sidebar Toggle */}
            <button
              id="toggleSidebarBtn"
              type="button"
              onClick={onToggleSidebar}
              className="btn btn-home text-body-secondary bg-body-secondary px-1 px-md-2"
            >
              <MenuIcon />
            </button>
          </div>
          {/* Title */}
          <div className="col-auto me-auto">
            <a
              className="d-flex navbar-brand mx-2 align-items-center"
              href={currentURL}
            >
              {pageTitle}
            </a>
          </div>

          {/* Theme Toggle */}
          <ThemeToggle theme={theme} onSwitchTheme={onSwitchTheme} />

          {/* Vertical Separator */}
          <div className="d-none d-sm-flex justify-content-center align-items-center mx-2">
            <div className="vr text-body"></div>
          </div>

          {/* User */}
          <div className="col-auto">
            <div className="dropdown">
              <button
                className="dropdown-toggle border-0 bg-body-secondary ms-1 d-flex align-items-center"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <div
                  className="bg-profile-icon me-md-2 rounded-circle"
                  style={{ width: 24, height: 24 }}
                >
                  <span>E</span>
                </div>
                <strong className="d-none d-sm-inline">{user.username}</strong>
              </button>
              <ul className="dropdown-menu dropdown-menu-end text-small p-1 shadow">
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={handleProfile}
                  >
                    Perfil
                  </button>
                </li>
                <li>
                  <button
                    className="dropdown-item rounded-1"
                    onClick={handleChangePassword}
                  >
                    Cambiar contraseña
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="w-100 border-0 py-1 px-3 text-start rounded-1 dropdown-item-danger"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* Modal para confirmar si desea cerrar sesión */}
      <ModalConfirmLogout
        isOpen={modalLogoutIsOpen}
        onClose={() => setModalLogoutIsOpen(false)}
        onLogout={logoutUser}
      />

      {/* Modal para cambiar contraseña */}
      <ModalChangePassword
        title="Cambiar contraseña"
        isOpen={modalChangeIsOpen}
        userId={user.user_id}
        onClose={() => setModalChangeIsOpen(false)}
      />

      {/* Modal para ver perfil */}
      <ModalProfile
        isOpen={modalProfileIsOpen}
        onClose={() => setModalProfileIsOpen(false)}
      />
    </>
  );
}

export default Navbar;
