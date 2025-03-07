import React, { useState } from "react";
import TableEmptyMessage from "../../../ui/tables/TableEmptyMessage";
import Pagination from "../../../ui/tables/Pagination";
import Grid from "../../../ui/tables/Grid";

function GridFields({
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

  // Tipos de campo
  const fieldType = {
    text: "Texto",
    number: "Número",
    date: "Fecha",
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
              <Grid.Header>Tipo de campo</Grid.Header>
              <Grid.Header>Estado</Grid.Header>
            </Grid.Head>
            <Grid.Body>
              {data.map((field) => (
                <Grid.Row
                  key={field.id}
                  className={selectedRow === field ? "table-active" : ""}
                  onClick={() => handleRowClick(field)}
                >
                  <Grid.Cell className="w-75">{field.description}</Grid.Cell>
                  <Grid.Cell>
                    {fieldType[field.field_type] || "Desconocido"}
                  </Grid.Cell>
                  <Grid.Cell>
                    {field.is_active ? (
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

export default GridFields;
