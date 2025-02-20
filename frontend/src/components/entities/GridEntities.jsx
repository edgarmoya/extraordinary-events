import React, { useState } from "react";
import TableEmptyMessage from "../TableEmptyMessage";

function GridEntities({ data, onRowSelected, onAdd }) {
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
            <th scope="col">Estado</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center">
                <TableEmptyMessage onAdd={onAdd} />
              </td>
            </tr>
          ) : (
            data.map((entity) => (
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
                <td>
                  {entity.is_active ? (
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

export default GridEntities;
