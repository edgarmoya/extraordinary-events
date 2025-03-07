import React, { useState } from "react";
import TableEmptyMessage from "../../../ui/tables/TableEmptyMessage";
import Grid from "../../../ui/tables/Grid";
import Pagination from "../../../ui/tables/Pagination";

function GridTypes({
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
              <Grid.Header className="text-center">Catastrófico</Grid.Header>
              <Grid.Header>Estado</Grid.Header>
            </Grid.Head>
            <Grid.Body>
              {data.map((types) => (
                <Grid.Row
                  key={types.id}
                  className={selectedRow === types ? "table-active" : ""}
                  onClick={() => handleRowClick(types)}
                >
                  <Grid.Cell>{types.description}</Grid.Cell>
                  <Grid.Cell>
                    <div className="d-flex form-check justify-content-center">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        value={types.is_catastrophic || false}
                        checked={types.is_catastrophic || false}
                        onChange={() => console.log("")}
                      />
                    </div>
                  </Grid.Cell>
                  <Grid.Cell>
                    {types.is_active ? (
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

export default GridTypes;
