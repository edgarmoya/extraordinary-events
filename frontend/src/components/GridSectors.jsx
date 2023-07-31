import React, { useState } from "react";

function GridSectors({ data }) {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row) => {
    setSelectedRow(row);
  };

  return (
    <section className="overflow-y-auto">
      <table className="table table-sm table-hover table-responsive">
        <thead className="sticky-top z-1">
          <tr>
            <th scope="col">Descripción</th>
            <th scope="col">Activo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sector) => (
            <tr
              key={sector.id}
              className={selectedRow === sector ? "table-active" : ""}
              onClick={() => handleRowClick(sector)}
            >
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
