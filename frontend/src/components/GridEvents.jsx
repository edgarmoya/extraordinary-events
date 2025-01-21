import React, { useState } from "react";
import TableEmptyMessage from "./TableEmptyMessage";

function GridEvents({ data, onRowSelected, onAdd }) {
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
            <th scope="col">Entidad afectada</th>
            <th scope="col">Fecha ocurrencia</th>
            <th scope="col">Fecha informado</th>
            <th scope="col">Tipo de hecho</th>
            <th scope="col">Estado</th>
            <th scope="col">Creado por</th>
            <th scope="col">Cerrado por</th>
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
            data.map((event) => (
              <tr
                key={event.id}
                className={selectedRow === event ? "table-active" : ""}
                onClick={() => handleRowClick(event)}
              >
                <td>{event.entity_description}</td>
                <td>{event.occurrence_date_f}</td>
                <td>{event.created_date_f}</td>
                <td>{event.event_type_description}</td>
                <td>
                  {event.status === "open" ? (
                    <div className="d-inline px-2 bg-primary-light text-primary rounded-1">
                      abierto
                    </div>
                  ) : (
                    <div className="d-inline px-2 bg-success-light text-success rounded-1">
                      cerrado
                    </div>
                  )}
                </td>
                <td>{event.created_by_username}</td>
                <td>
                  {event.closed_by === null ? (
                    <div className="d-flex justify-content-start">-</div>
                  ) : (
                    <div className="d-flex justify-content-start">
                      {event.closed_by_username}
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

export default GridEvents;
