import React, { useState } from "react";
import TableEmptyMessage from "../TableEmptyMessage";
import Pagination from "../ui/Pagination";
import Grid from "../ui/Grid";

function GridEvents({
  data,
  onRowSelected,
  onAdd,
  onPageChange,
  currentPage,
  totalRows,
}) {
  const [selectedRow, setSelectedRow] = useState(null);

  const handleRowClick = (row) => {
    setSelectedRow(row);
    onRowSelected(row);
  };

  return (
    <>
      {data.length === 0 ? (
        <div className="text-center">
          <TableEmptyMessage onAdd={onAdd} />
        </div>
      ) : (
        <>
          <Grid>
            <Grid.Head>
              <Grid.Header>Entidad afectada</Grid.Header>
              <Grid.Header>Fecha ocurrencia</Grid.Header>
              <Grid.Header>Fecha informado</Grid.Header>
              <Grid.Header>Tipo de hecho</Grid.Header>
              <Grid.Header>Estado</Grid.Header>
              <Grid.Header>Creado por</Grid.Header>
              <Grid.Header>Cerrado por</Grid.Header>
            </Grid.Head>
            <Grid.Body>
              {data.map((event) => (
                <Grid.Row
                  key={event.id}
                  className={selectedRow === event ? "table-active" : ""}
                  onClick={() => handleRowClick(event)}
                >
                  <Grid.Cell>{event.entity_description}</Grid.Cell>
                  <Grid.Cell>{event.occurrence_date_f}</Grid.Cell>
                  <Grid.Cell>{event.created_date_f}</Grid.Cell>
                  <Grid.Cell>{event.event_type_description}</Grid.Cell>
                  <Grid.Cell>
                    {event.status === "open" ? (
                      <div className="d-inline px-2 bg-primary-light text-primary rounded-1">
                        abierto
                      </div>
                    ) : (
                      <div className="d-inline px-2 bg-success-light text-success rounded-1">
                        cerrado
                      </div>
                    )}
                  </Grid.Cell>
                  <Grid.Cell>{event.created_by_username}</Grid.Cell>
                  <Grid.Cell>
                    {event.closed_by === null ? (
                      <div className="d-flex justify-content-start">-</div>
                    ) : (
                      <div className="d-flex justify-content-start">
                        {event.closed_by_username}
                      </div>
                    )}
                  </Grid.Cell>
                </Grid.Row>
              ))}
            </Grid.Body>
          </Grid>
          <div className="card card-footer bg-body pt-2 border-0">
            <Pagination
              onPageChange={onPageChange}
              currentPage={currentPage}
              totalRows={totalRows}
            />
          </div>
        </>
      )}
    </>
  );
}

export default GridEvents;
