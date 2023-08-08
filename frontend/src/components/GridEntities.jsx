import React, { useState } from "react";

function GridEntities({ data, onRowSelected }) {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    onRowSelected(row);
  };

  return (
    <section className="overflow-y-auto mt-1">
      <table className="table table-sm table-hover table-responsive">
        <thead className="sticky-top z-1">
          <tr>
            <th scope="col">Código</th>
            <th scope="col">Descripción</th>
            <th scope="col">Sector</th>
            <th scope="col">Municipio</th>
            <th scope="col">Correo electrónico</th>
            <th scope="col">Activo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entity) => (
            <tr
              key={entity.id_entity}
              className={selectedRow === entity ? "table-active" : ""}
              onClick={() => handleRowClick(entity)}
            >
              <td>{entity.id_entity}</td>
              <td>{entity.description}</td>
              <td>{entity.sector_description}</td>
              <td>{entity.municipality_description}</td>
              <td>{entity.email}</td>
              <td>{entity.is_active ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default GridEntities;
