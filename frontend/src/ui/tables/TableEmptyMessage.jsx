import React from "react";

function TableEmptyMessage({ onAdd }) {
  return (
    <div className="alert alert-info mt-3">
      <div className="d-flex justify-content-center align-content-center">
        <svg
          className="me-2"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          height={"1.3rem"}
        >
          <path d="M23.813,11.511l-1.643-7.23c-.573-2.521-2.779-4.281-5.364-4.281H7.193C4.608,0,2.402,1.76,1.83,4.281L.187,11.51c-.124,.543-.187,1.103-.187,1.664v5.327c0,3.033,2.467,5.5,5.5,5.5h13c3.032,0,5.5-2.467,5.5-5.5v-5.327c0-.561-.062-1.12-.187-1.662ZM16.807,3c.431,0,.837,.11,1.193,.303v1.697H6v-1.697c.356-.193,.762-.303,1.193-.303h9.614ZM5.578,8h12.844l.692,3H4.885l.692-3Zm15.422,10.5c0,1.378-1.121,2.5-2.5,2.5H5.5c-1.378,0-2.5-1.122-2.5-2.5v-4.5s0,0,.001,0c0,0,.002,0,.003,0H20.996s.002,0,.003,0c0,0,0,0,0,0v4.5Zm-6-1c0,.829-.672,1.5-1.5,1.5h-3c-.829,0-1.5-.671-1.5-1.5s.671-1.5,1.5-1.5h3c.828,0,1.5,.671,1.5,1.5Z" />
        </svg>
        No se encontraron datos disponibles
      </div>
      <span>
        Puede comenzar{" "}
        <button
          className="btn btn-link align-baseline text-decoration-underline text-info p-0"
          onClick={onAdd}
        >
          añadiendo
        </button>{" "}
        nuevos registros
      </span>
    </div>
  );
}

export default TableEmptyMessage;
