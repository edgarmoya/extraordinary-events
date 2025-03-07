import React, { useState } from "react";
import TableEmptyMessage from "../../../ui/tables/TableEmptyMessage";
import Pagination from "../../../ui/tables/Pagination";
import Grid from "../../../ui/tables/Grid";

function GridEntities({
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
              <Grid.Header>Código</Grid.Header>
              <Grid.Header>Descripción</Grid.Header>
              <Grid.Header>Sector</Grid.Header>
              <Grid.Header>Municipio</Grid.Header>
              <Grid.Header>Correo electrónico</Grid.Header>
              <Grid.Header>Estado</Grid.Header>
            </Grid.Head>
            <Grid.Body>
              {data.map((entity) => (
                <Grid.Row
                  key={entity.id_entity}
                  className={selectedRow === entity ? "table-active" : ""}
                  onClick={() => handleRowClick(entity)}
                >
                  <Grid.Cell>{entity.id_entity}</Grid.Cell>
                  <Grid.Cell>{entity.description}</Grid.Cell>
                  <Grid.Cell>{entity.sector_description}</Grid.Cell>
                  <Grid.Cell>{entity.municipality_description}</Grid.Cell>
                  <Grid.Cell>{entity.email}</Grid.Cell>
                  <Grid.Cell>
                    {entity.is_active ? (
                      <div className="d-inline px-2 bg-primary-light text-primary rounded-1">
                        activo
                      </div>
                    ) : (
                      <div className="d-inline px-2 bg-danger-light text-danger rounded-1">
                        inactivo
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

export default GridEntities;
