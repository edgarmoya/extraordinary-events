import React, { useState } from "react";

function GridClassifications({ data, onRowSelected }) {
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
            <th scope="col">Grado</th>
            <th scope="col">Activo</th>
          </tr>
        </thead>
        <tbody>
          {data.map((classification) => (
            <tr
              key={classification.id}
              className={selectedRow === classification ? "table-active" : ""}
              onClick={() => handleRowClick(classification)}
            >
              <td>{classification.description}</td>
              <td>{classification.grade_description}</td>
              <td>{classification.is_active ? "Sí" : "No"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}

export default GridClassifications;