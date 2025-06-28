import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../../layout/Layout";
import Paths from "../../../routes/Paths";
import EntityService from "../../../api/entities.api";
import ModalConfirmDelete from "../../../ui/modals/ModalConfirmDelete";
import ModalConfirmActivate from "../../../ui/modals/ModalConfirmActivate";
import GridEntities from "../components/GridEntities";
import TopBar from "../../../layout/TopBar";
import ModalEntities from "../components/ModalEntities";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import TableLoader from "../../../ui/skeletons/TableLoader";
import {
  ActiveIcon,
  AddIcon,
  DeleteIcon,
  EyeIcon,
  UpdateIcon,
} from "../../../ui/icons";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";

function EntitiesPage() {
  const location = useLocation();
  const [entities, setEntities] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntities, setTotalEntities] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);
  const [modalWatchIsOpen, setModalWatchIsOpen] = useState(false);

  const isActive =
    location.pathname === Paths.ACTIVE_ENTITIES
      ? "True"
      : location.pathname === Paths.INACTIVE_ENTITIES
      ? "False"
      : undefined;

  //* Cargar todas las entidades
  const { data, loading, refetch } = useFetchData(
    EntityService.getEntities,
    [currentPage, searchTerm, isActive, "administrador"],
    [location.pathname, currentPage, searchTerm]
  );

  useEffect(() => {
    if (data) {
      setEntities(data.results || []);
      setTotalEntities(data.count || 0);
    }
  }, [data]);

  //* Función para eliminar una entidad
  const { execute: deleteEntity, loading: deleting } = useApiMutation(
    EntityService.deleteEntity,
    {
      onSuccess: () => {
        showSuccessToast("Entidad eliminada con éxito");
        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para activar/inactivar una entidad
  const { execute: activateEntity, loading: activating } = useApiMutation(
    EntityService.activateEntity,
    {
      onSuccess: (response) => {
        const { data } = response; // Acceder a la respuesta

        if (data.is_active) {
          showSuccessToast("Entidad activada con éxito");
        } else {
          showSuccessToast("Entidad inactivada con éxito");
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
    <Layout pageTitle="Entidades">
      <div className="container-fluid h-100">
        {/* Acciones */}
        <TopBar>
          <TopBar.Button
            label="Agregar"
            onClick={() => setModalAddIsOpen(true)}
            icon={AddIcon}
          />
          <TopBar.Button
            label="Modificar"
            onClick={() => {
              if (selectedRow) {
                setModalUpdateIsOpen(true);
              } else {
                showErrorToast("Seleccione la entidad que desea modificar");
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
                showErrorToast("Seleccione la entidad que desea eliminar");
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
                  "Seleccione la entidad que desea activar o inactivar"
                );
              }
            }}
            icon={ActiveIcon}
          />
          <TopBar.Button
            label="Ver"
            onClick={() => {
              if (selectedRow) {
                setModalWatchIsOpen(true);
              } else {
                showErrorToast("Seleccione la entidad que desea visualizar");
              }
            }}
            icon={EyeIcon}
          />
          <TopBar.Dropdown
            pathAll={Paths.ENTITIES}
            pathActive={Paths.ACTIVE_ENTITIES}
            pathInactive={Paths.INACTIVE_ENTITIES}
          />
          <TopBar.Search
            searchMessage={"Buscar entidad ..."}
            onSearch={(term) => {
              clearSelectedRow();
              setSearchTerm(term);
              setCurrentPage(1);
            }}
          />
        </TopBar>

        {/* Tabla de entidades */}
        <div className="card h-100 card-body table-container mt-2 py-2 px-0 border-secondary-subtle shadow-sm overflow-x-hidden justify-content-between">
          {loading ? (
            <TableLoader columns={6} />
          ) : (
            <GridEntities
              data={entities}
              onRowSelected={(row) => setSelectedRow(row)}
              onAdd={() => setModalAddIsOpen(true)}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalEntities}
            />
          )}
        </div>
      </div>

      {/* Modal para agregar una nueva entidad */}
      <ModalEntities
        isOpen={modalAddIsOpen}
        onClose={() => setModalAddIsOpen(false)}
        title={"Añadir entidad"}
        size={"modal-lg"}
        onRefresh={() => {
          refetch();
          clearSelectedRow();
        }}
      />

      {/* Modal para modificar una entidad */}
      <ModalEntities
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Modificar entidad"}
        size={"modal-lg"}
        onRefresh={() => {
          refetch();
          clearSelectedRow();
        }}
        entityData={selectedRow}
      />

      {/* Modal para visualizar una entidad */}
      <ModalEntities
        isOpen={modalWatchIsOpen}
        onClose={() => setModalWatchIsOpen(false)}
        title={"Ver entidad"}
        size={"modal-lg"}
        onRefresh={() => clearSelectedRow()}
        readOnly={true}
        entityData={selectedRow}
      />

      {/* Modal para eliminar una entidad */}
      <ModalConfirmDelete
        isOpen={modalDeleteIsOpen}
        onClose={() => {
          setModalDeleteIsOpen(false);
        }}
        onDelete={() => deleteEntity(selectedRow?.id)}
        message={`Está a punto de eliminar la entidad "${selectedRow?.description}".`}
        loading={deleting}
      />

      {/* Modal para activar/inactivar una entidad */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={() =>
          activateEntity({
            id: selectedRow?.id,
            activated: selectedRow?.is_active,
          })
        }
        message={`Está a punto de ${
          selectedRow?.is_active ? "inactivar" : "activar"
        } la entidad "${selectedRow?.description}".`}
        activated={selectedRow?.is_active}
        loading={activating}
      />
    </Layout>
  );
}

export default EntitiesPage;
