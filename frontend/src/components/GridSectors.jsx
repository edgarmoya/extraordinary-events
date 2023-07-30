import React from "react";

function GridSectors({ data }) {
  return (
    <section>
      <table className="table table-hover table-responsive">
        <thead>
          <tr>
            <th scope="col">Id</th>
            <th scope="col">Descripción</th>
            <th scope="col">Activo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sector) => (
            <tr key={sector.id}>
              <th scope="row">{sector.id}</th>
              <td>{sector.description}</td>
              <td>{sector.is_active ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default GridSectors;
