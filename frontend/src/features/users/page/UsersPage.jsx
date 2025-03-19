import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../../layout/Layout";
import GridUsers from "../components/GridUsers";
import UserService from "../../../api/users.api";
import TopBar from "../../../layout/TopBar";
import Paths from "../../../routes/Paths";
import ModalUsers from "../components/ModalUsers";
import ModalConfirmDelete from "../../../ui/modals/ModalConfirmDelete";
import ModalConfirmActivate from "../../../ui/modals/ModalConfirmActivate";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import TableLoader from "../../../ui/skeletons/TableLoader";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";
import {
  AddIcon,
  UpdateIcon,
  DeleteIcon,
  ActiveIcon,
  LockIcon,
} from "../../../ui/icons";
import ModalChangePassword from "../../../layout/navbar/ModalChangePassword";

function UsersPage() {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState(1);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);
  const [modalPassIsOpen, setModalPassIsOpen] = useState(false);

  const isActive =
    location.pathname === Paths.ACTIVE_USERS
      ? "True"
      : location.pathname === Paths.INACTIVE_USERS
      ? "False"
      : undefined;

  //* Cargar todos los usuarios
  const { data, loading, refetch } = useFetchData(
    UserService.getUsers,
    [currentPage, searchTerm, isActive],
    [location.pathname, currentPage, searchTerm]
  );

  useEffect(() => {
    if (data) {
      setUsers(data.results || []);
      setTotalUsers(data.count || 0);
    }
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar un usuario
  const { execute: deleteUser, loading: deleting } = useApiMutation(
    UserService.deleteUser,
    {
      onSuccess: () => {
        showSuccessToast("Usuario eliminado con éxito");
        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para activar/inactivar un usuario
  const { execute: activateUser, loading: activating } = useApiMutation(
    UserService.activateUser,
    {
      onSuccess: (response) => {
        const { data } = response; // Acceder al la respuesta

        if (data.is_active) {
          showSuccessToast("Usuario activado con éxito");
        } else {
          showSuccessToast("Usuario inactivado con éxito");
        }

        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para limpiar la fila seleccionada
  const clearSelectedRow = () => {
    setSelectedRow(null);
  };

  return (
    <Layout pageTitle="Usuarios">
      <div className="container-fluid">
        {/* Barra superior */}
        <TopBar>
          <TopBar.Button
            label={"Agregar"}
            icon={AddIcon}
            onClick={() => setModalAddIsOpen(true)}
          />
          <TopBar.Button
            label={"Modificar"}
            icon={UpdateIcon}
            onClick={() => {
              if (selectedRow) {
                setModalUpdateIsOpen(true);
              } else {
                showErrorToast("Seleccione el usuario que desea modificar");
              }
            }}
          />
          <TopBar.Button
            label={"Eliminar"}
            icon={DeleteIcon}
            onClick={() => {
              if (selectedRow) {
                setModalDeleteIsOpen(true);
              } else {
                showErrorToast("Seleccione el usuario que desea eliminar");
              }
            }}
          />
          <TopBar.Button
            label={"Activar/Inactivar"}
            icon={ActiveIcon}
            onClick={() => {
              if (selectedRow) {
                setModalActivateIsOpen(true);
              } else {
                showErrorToast(
                  "Seleccione el usuario que desea activar o inactivar"
                );
              }
            }}
          />
          <TopBar.Button
            label={"Restablecer contraseña"}
            icon={LockIcon}
            onClick={() => {
              if (selectedRow) {
                setModalPassIsOpen(true);
              } else {
                showErrorToast(
                  "Seleccione el usuario que desea cambiarle la contraseña"
                );
              }
            }}
          />
          <TopBar.Dropdown
            pathAll={Paths.USERS}
            pathActive={Paths.ACTIVE_USERS}
            pathInactive={Paths.INACTIVE_USERS}
          />
          <TopBar.Search
            searchMessage={"Buscar usuario ..."}
            onSearch={(term) => {
              clearSelectedRow();
              setCurrentPage(1);
              setSearchTerm(term);
            }}
          />
        </TopBar>

        {/* Tabla con los usuarios */}
        <div className="card card-body table-container mt-2 py-2 px-0 border-secondary-subtle shadow-sm">
          {loading ? (
            <TableLoader columns={4} />
          ) : (
            <GridUsers
              data={users}
              onRowSelected={(row) => setSelectedRow(row)}
              onAdd={() => setModalAddIsOpen(true)}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalUsers}
            />
          )}
        </div>
      </div>

      {/* Modal para agregar un nuevo usuario */}
      <ModalUsers
        isOpen={modalAddIsOpen}
        onClose={() => setModalAddIsOpen(false)}
        title={"Añadir usuario"}
        onRefresh={() => {
          refetch();
          clearSelectedRow();
        }}
      />

      {/* Modal para modificar un usuario */}
      <ModalUsers
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Modificar usuario"}
        onRefresh={() => {
          refetch();
          clearSelectedRow();
        }}
        userData={selectedRow}
      />

      {/* Modal para eliminar un usuario */}
      <ModalConfirmDelete
        isOpen={modalDeleteIsOpen}
        onClose={() => {
          setModalDeleteIsOpen(false);
        }}
        onDelete={() => deleteUser(selectedRow?.id)}
        message={`Está a punto de eliminar el usuario "${selectedRow?.user_name}"`}
        loading={deleting}
      />

      {/* Modal para activar/inactivar un usuario */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={() =>
          activateUser({
            id: selectedRow?.id,
            activated: selectedRow?.is_active,
          })
        }
        message={`Está a punto de ${
          selectedRow?.is_active ? "inactivar" : "activar"
        } el usuario "${selectedRow?.user_name}"`}
        activated={selectedRow?.is_active}
        loading={activating}
      />

      {/* Modal para restablecer contraseña de un usuario */}
      <ModalChangePassword
        isOpen={modalPassIsOpen}
        title="Restablecer contraseña"
        userId={selectedRow?.id}
        onClose={() => {
          setModalPassIsOpen(false);
        }}
        showOldPassword={false}
      />
    </Layout>
  );
}

export default UsersPage;
