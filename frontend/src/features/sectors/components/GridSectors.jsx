import React, { useState } from "react";
import Grid from "../../../ui/tables/Grid";
import TableEmptyMessage from "../../../ui/tables/TableEmptyMessage";
import Pagination from "../../../ui/tables/Pagination";

function GridSectors({
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
              <Grid.Header>Descripción</Grid.Header>
              <Grid.Header>Estado</Grid.Header>
            </Grid.Head>
            <Grid.Body>
              {data.map((sector) => (
                <Grid.Row
                  key={sector.id}
                  className={selectedRow === sector ? "table-active" : ""}
                  onClick={() => handleRowClick(sector)}
                >
                  <Grid.Cell>{sector.description}</Grid.Cell>
                  <Grid.Cell>
                    {sector.is_active ? (
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

export default GridSectors;
