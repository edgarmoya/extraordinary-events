import React, { useState } from "react";
import TableEmptyMessage from "../TableEmptyMessage";

function GridClassifications({ data, onRowSelected, onAdd }) {
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
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center">
                <TableEmptyMessage onAdd={onAdd} />
              </td>
            </tr>
          ) : (
            data.map((classification) => (
              <tr
                key={classification.id}
                className={selectedRow === classification ? "table-active" : ""}
                onClick={() => handleRowClick(classification)}
              >
                <td className="w-75">{classification.description}</td>
                <td>{classification.grade_description}</td>
                <td>
                  {classification.is_active ? (
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
            ))
          )}
        </tbody>
      </table>
    </section>
  );
}

export default GridClassifications;
