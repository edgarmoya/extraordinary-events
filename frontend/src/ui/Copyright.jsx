import React from "react";

const Copyright = ({ className, topHr = true }) => {
  function getCurrentYear() {
    const date = new Date();
    return date.getFullYear();
  }

  return (
    <div className={`text-center mt-auto ${className}`}>
      {topHr && <hr className="text-body" />}
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
        {`DATAZUCAR © ${getCurrentYear()}`}
        <br />
        <span className="fw-light">Todos los derechos reservados.</span>
      </a>
    </div>
  );
};

export default Copyright;
