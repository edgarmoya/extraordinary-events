import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/navbar/Navbar";
import useLocalStorage from "use-local-storage";

function Layout({ children, pageTitle }) {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);

  const [theme, setTheme] = useLocalStorage("theme", "light");

  useEffect(() => {
    const handleResize = () => {
      // Verificar el ancho de la pantalla y cambiar el estado de isOpen en consecuencia
      if (window.innerWidth > 965) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    // Agregar el evento resize
    window.addEventListener("resize", handleResize);
    // Llamar al evento resize una vez para inicializar el estado correctamente
    handleResize();
    // Limpiar el evento cuando el componente se desmonte
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="App" data-bs-theme={theme}>
      <Sidebar isOpen={sidebarIsOpen} />
      <div
        className={`container-fluid content bg-body-secondary ${
          sidebarIsOpen ? "is-open" : ""
        }`}
      >
        <Navbar
          onToggleSidebar={toggleSidebar}
          pageTitle={pageTitle}
          onSwitchTheme={(newTheme) => setTheme(newTheme)}
          theme={theme}
        />
        {children}
      </div>
    </div>
  );
}

export default Layout;
