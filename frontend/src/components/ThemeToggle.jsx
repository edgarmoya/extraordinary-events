import React from "react";
import { SunFill, MoonStarsFill, Check2 } from "react-bootstrap-icons";

const ThemeToggle = ({ onSwitchTheme, theme }) => {
  const handleThemeSwitch = (selectedTheme) => {
    onSwitchTheme(selectedTheme);
  };

  return (
    <div className="dropdown me-1">
      <button
        className="btn btn-link nav-link text-body-emphasis py-2 px-0 px-lg-2 dropdown-toggle d-flex align-items-center"
        type="button"
        aria-expanded="true"
        data-bs-toggle="dropdown"
        data-bs-display="static"
        aria-label="Toggle theme (light)"
      >
        {theme === "light" ? (
          <SunFill className="my-1" />
        ) : (
          <MoonStarsFill className="my-1" />
        )}
      </button>
      <ul className="dropdown-menu dropdown-menu-end shadow-sm p-1">
        <li>
          <button
            type="button"
            className={`dropdown-item rounded-1 d-flex align-items-center ${
              theme === "light" ? "active" : ""
            }`}
            aria-pressed="true"
            onClick={() => handleThemeSwitch("light")}
          >
            <SunFill className="me-2 opacity-50" />
            Claro
            <Check2
              className={`ms-auto ${theme === "light" ? "" : "d-none"}`}
            />
          </button>
        </li>
        <li>
          <button
            type="button"
            className={`dropdown-item rounded-1 mt-1 d-flex align-items-center ${
              theme === "dark" ? "active" : ""
            }`}
            aria-pressed="true"
            onClick={() => handleThemeSwitch("dark")}
          >
            <MoonStarsFill className="me-2 opacity-50" />
            Oscuro
            <Check2 className={`ms-auto ${theme === "dark" ? "" : "d-none"}`} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default ThemeToggle;
