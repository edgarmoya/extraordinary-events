import React from "react";
import logo from "../images/logo_he.png";
import Paths from "../routes/Paths";

function Navbar() {
  return (
    <nav className="navbar bg-body-tertiary fixed-top z-3">
      <div className="container-fluid">
        <div className="justify-content-start">
          {/* Toggle */}
          <button
            className="navbar-toggler me-2"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasExample"
            aria-controls="offcanvasExample"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Title */}
          <a className="navbar-brand mx-2" href={Paths.EVENTS}>
            <img
              className="d-inline-block"
              src={logo}
              alt="logo"
              width={30}
              height={30}
            ></img>
            Hechos Extraordinarios
          </a>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
