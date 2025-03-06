import React, { useState } from "react";
import TableEmptyMessage from "../TableEmptyMessage";

function GridFields({ data, onRowSelected, onAdd }) {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    onRowSelected(row);
  };

  // Mapeo de tipos de campo
  const fieldType = {
    text: "Texto",
    number: "Número",
    date: "Fecha",
  };

  return (
    <section className="overflow-y-auto mt-1">
      <table className="table table-sm table-hover table-responsive">
        <thead className="sticky-top z-1">
          <tr>
            <th scope="col">Descripción</th>
            <th scope="col">Tipo de campo</th>
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="3" className="text-center">
                <TableEmptyMessage onAdd={onAdd} />
              </td>
            </tr>
          ) : (
            data.map((field) => (
              <tr
                key={field.id}
                className={selectedRow === field ? "table-active" : ""}
                onClick={() => handleRowClick(field)}
              >
                <td className="w-75">{field.description}</td>
                <td>{fieldType[field.field_type] || "Desconocido"}</td>
                <td>
                  {field.is_active ? (
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

export default GridFields;
