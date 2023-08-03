import React, { useEffect, useState, useContext } from "react";
import AuthContext from "../contexts/AuthContext";
import ModalConfirmLogout from "./ModalConfirmLogout";
import ModalChangePassword from "./ModalChangePassword";
import ModalProfile from "./ModalProfile";
import ThemeToggle from "./ThemeToggle";

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
    <React.Fragment>
      <nav className="navbar bg-body-secondary">
        <div className="container-fluid">
          <div className="col-auto">
            {/* Toggle */}
            <button
              id="toggleSidebarBtn"
              type="button"
              onClick={onToggleSidebar}
              className="btn btn-home text-body-secondary bg-body-secondary px-2 ms-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                height={"1.5rem"}
              >
                <path d="M0,3.5c0-.83,.67-1.5,1.5-1.5H17.5c.83,0,1.5,.67,1.5,1.5s-.67,1.5-1.5,1.5H1.5c-.83,0-1.5-.67-1.5-1.5Zm17.5,14.5H1.5c-.83,0-1.5,.67-1.5,1.5s.67,1.5,1.5,1.5H17.5c.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5Zm5-8H6.5c-.83,0-1.5,.67-1.5,1.5s.67,1.5,1.5,1.5H22.5c.83,0,1.5-.67,1.5-1.5s-.67-1.5-1.5-1.5Z" />
              </svg>
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
          <div className="col-auto me-2">
            {/* User */}
            <div className="dropdown">
              <button
                className="dropdown-toggle border-0 bg-body-secondary"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <strong>{user.username}</strong>
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
                    className="dropdown-item rounded-1"
                    onClick={handleLogout}
                  >
                    Cerrar sesión
                  </button>
                </li>
              </ul>
            </div>
          </div>
          <ThemeToggle theme={theme} onSwitchTheme={onSwitchTheme} />
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
