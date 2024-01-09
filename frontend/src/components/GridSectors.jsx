import React, { useState } from "react";

function GridSectors({ data, onRowSelected }) {
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
            <th scope="col">Descripción</th>
            <th scope="col">Estado</th>
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
              <td>
                {sector.is_active ? (
                  <div className="d-inline px-2 bg-primary-light text-primary rounded-1">
                    activo
                  </div>
                ) : (
                  <div className="d-inline px-2 bg-danger-light text-danger rounded-1">
                    inactivo
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default GridSectors;
