import React, { useState } from "react";
import Grid from "../../../ui/tables/Grid";
import TableEmptyMessage from "../../../ui/tables/TableEmptyMessage";
import Pagination from "../../../ui/tables/Pagination";

function GridUsers({
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
              <Grid.Header>Usuario</Grid.Header>
              <Grid.Header>Nombre</Grid.Header>
              <Grid.Header>Fecha de creación</Grid.Header>
              <Grid.Header>Último login</Grid.Header>
              <Grid.Header>Estado</Grid.Header>
            </Grid.Head>
            <Grid.Body>
              {data.map((user) => (
                <Grid.Row
                  key={user.id}
                  className={selectedRow === user ? "table-active" : ""}
                  onClick={() => handleRowClick(user)}
                >
                  <Grid.Cell>{user.user_name}</Grid.Cell>
                  <Grid.Cell>{`${user.first_name} ${user.last_name}`}</Grid.Cell>
                  <Grid.Cell>
                    {user.start_date ? user.start_date : "-"}
                  </Grid.Cell>
                  <Grid.Cell>
                    {user.last_login ? user.last_login : "-"}
                  </Grid.Cell>
                  <Grid.Cell>
                    {user.is_active ? (
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

export default GridUsers;
