import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../../layout/Layout";
import GridTypes from "../components/GridTypes";
import TypeService from "../../../api/types.api";
import TopBar from "../../../layout/TopBar";
import Paths from "../../../routes/Paths";
import ModalTypes from "../components/ModalTypes";
import ModalConfirmDelete from "../../../ui/modals/ModalConfirmDelete";
import ModalConfirmActivate from "../../../ui/modals/ModalConfirmActivate";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import TableLoader from "../../../ui/skeletons/TableLoader";
import { ActiveIcon, AddIcon, DeleteIcon, UpdateIcon } from "../../../ui/icons";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";

function TypesPage() {
  const location = useLocation();
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTypes, setTotalTypes] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  const isActive =
    location.pathname === Paths.ACTIVE_TYPES
      ? "True"
      : location.pathname === Paths.INACTIVE_TYPES
      ? "False"
      : undefined;

  //* Cargar todos los los tipos de hecho
  const { data, loading, refetch } = useFetchData(
    TypeService.getTypes,
    [currentPage, searchTerm, isActive],
    [location.pathname, currentPage, searchTerm]
  );

  useEffect(() => {
    if (data) {
      setTypes(data.results || []);
      setTotalTypes(data.count || 0);
    }
  }, [data]);

  //* Función para eliminar un tipo de hecho
  const { execute: deleteType, loading: deleting } = useApiMutation(
    TypeService.deleteType,
    {
      onSuccess: () => {
        showSuccessToast("Tipo de hecho eliminado con éxito");
        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para activar/inactivar un tipo de hecho
  const { execute: activateType, loading: activating } = useApiMutation(
    TypeService.activateType,
    {
      onSuccess: (response) => {
        const { data } = response; // Acceder a la respuesta

        if (data.is_active) {
          showSuccessToast("Tipo de hecho activado con éxito");
        } else {
          showSuccessToast("Tipo de hecho inactivado con éxito");
        }

        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para limpiar la fila seleccionada
  const clearSelectedRow = () => {
    setSelectedRow(null);
  };

  return (
    <Layout pageTitle="Tipos">
      <div className="container-fluid h-100">
        {/* Acciones */}
        <TopBar>
          <TopBar.Button
            label="Nuevo"
            onClick={() => setModalAddIsOpen(true)}
            icon={AddIcon}
          />
          <TopBar.Button
            label="Editar"
            onClick={() => {
              if (selectedRow) {
                setModalUpdateIsOpen(true);
              } else {
                showErrorToast("Seleccione el tipo de hecho que desea editar");
              }
            }}
            icon={UpdateIcon}
          />
          <TopBar.Button
            label="Eliminar"
            onClick={() => {
              if (selectedRow) {
                setModalDeleteIsOpen(true);
              } else {
                showErrorToast(
                  "Seleccione el tipo de hecho que desea eliminar"
                );
              }
            }}
            icon={DeleteIcon}
          />
          <TopBar.Button
            label="Activar/Inactivar"
            onClick={() => {
              if (selectedRow) {
                setModalActivateIsOpen(true);
              } else {
                showErrorToast(
                  "Seleccione el tipo de hecho que desea activar o inactivar"
                );
              }
            }}
            icon={ActiveIcon}
          />
          <TopBar.Dropdown
            pathAll={Paths.TYPES}
            pathActive={Paths.ACTIVE_TYPES}
            pathInactive={Paths.INACTIVE_TYPES}
          />
          <TopBar.Search
            searchMessage={"Buscar tipo ..."}
            onSearch={(term) => {
              clearSelectedRow();
              setCurrentPage(1);
              setSearchTerm(term);
            }}
          />
        </TopBar>

        {/* Tabla de contenido */}
        <div className="card h-100 card-body table-container mt-2 py-2 px-0 border-secondary-subtle shadow-sm overflow-x-hidden justify-content-between">
          {loading ? (
            <TableLoader columns={3} />
          ) : (
            <GridTypes
              data={types}
              onRowSelected={(row) => setSelectedRow(row)}
              onAdd={() => setModalAddIsOpen(true)}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalTypes}
            />
          )}
        </div>
      </div>

      {/* Modal para agregar un nuevo tipo de hecho */}
      <ModalTypes
        isOpen={modalAddIsOpen}
        onClose={() => setModalAddIsOpen(false)}
        title={"Nuevo tipo de hecho"}
        onRefresh={() => {
          refetch();
          clearSelectedRow();
        }}
      />

      {/* Modal para modificar un tipo de hecho */}
      <ModalTypes
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Editar tipo de hecho"}
        onRefresh={() => {
          refetch();
          clearSelectedRow();
        }}
        typeData={selectedRow}
      />

      {/* Modal para eliminar un tipo de hecho */}
      <ModalConfirmDelete
        isOpen={modalDeleteIsOpen}
        onClose={() => {
          setModalDeleteIsOpen(false);
        }}
        onDelete={() => deleteType(selectedRow?.id)}
        message={`Está a punto de eliminar el tipo de hecho "${selectedRow?.description}". ¿Desea continuar?`}
        loading={deleting}
      />

      {/* Modal para activar/inactivar un tipo de hecho */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={() =>
          activateType({
            id: selectedRow?.id,
            activated: selectedRow?.is_active,
          })
        }
        message={`Está a punto de ${
          selectedRow?.is_active ? "inactivar" : "activar"
        } el tipo de hecho "${selectedRow?.description}". ¿Desea continuar?`}
        loading={activating}
      />
    </Layout>
  );
}

export default TypesPage;
