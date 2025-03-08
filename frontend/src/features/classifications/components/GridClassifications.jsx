import React, { useState } from "react";
import TableEmptyMessage from "../../../ui/tables/TableEmptyMessage";
import Grid from "../../../ui/tables/Grid";
import Pagination from "../../../ui/tables/Pagination";

function GridClassifications({
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
              <Grid.Header>Grado</Grid.Header>
              <Grid.Header>Estado</Grid.Header>
            </Grid.Head>
            <Grid.Body>
              {data.map((classification) => (
                <tr
                  key={classification.id}
                  className={
                    selectedRow === classification ? "table-active" : ""
                  }
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

export default GridClassifications;
