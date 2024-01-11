import React, { useState } from "react";

function GridTypes({ data, onRowSelected }) {
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
            <th className="text-center" scope="col">
              Catastrófico
            </th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.map((types) => (
            <tr
              key={types.id}
              className={selectedRow === types ? "table-active" : ""}
              onClick={() => handleRowClick(types)}
            >
              <td>{types.description}</td>
              <td>
                <div className="d-flex form-check justify-content-center">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    value={types.is_catastrophic || false}
                    checked={types.is_catastrophic || false}
                    onChange={() => console.log("")}
                  />
                </div>
              </td>
              <td>
                {types.is_active ? (
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

export default GridTypes;
