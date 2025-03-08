import React, { useState, useEffect, useCallback } from "react";
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
import { HttpStatusCode } from "axios";
import TableLoader from "../../../ui/skeletons/TableLoader";

function EntitiesPage() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
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

  //* Función para cargar todos las entidades
  const loadEntities = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (location.pathname === Paths.ACTIVE_ENTITIES) {
        response = await EntityService.getEntities(
          currentPage,
          searchTerm,
          "True"
        );
      } else if (location.pathname === Paths.INACTIVE_ENTITIES) {
        response = await EntityService.getEntities(
          currentPage,
          searchTerm,
          "False"
        );
      } else {
        response = await EntityService.getEntities(currentPage, searchTerm);
      }

      setEntities(response.data.results);
      setTotalEntities(response.data.count);
    } catch (error) {
      console.error("Error obteniendo las entidades: ", error);
    } finally {
      setLoading(false);
    }
  }, [location.pathname, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar una entidad
  const handleDeleteEntity = async () => {
    try {
      const response = await EntityService.deleteEntity(selectedRow.id_entity);
      if (response.status === HttpStatusCode.NoContent) {
        showSuccessToast("Entidad eliminada con éxito");
        loadEntities();
        clearSelectedRow();
      } else {
        showErrorToast("Error al eliminar entidad");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    }
  };

  //* Función para activar/inactivar una entidad
  const handleActivateEntity = async () => {
    try {
      const response = await EntityService.activateEntity(
        selectedRow.id_entity,
        selectedRow.is_active
      );
      if (response.status === HttpStatusCode.Ok) {
        if (selectedRow.is_active) {
          showSuccessToast("Entidad inactivada con éxito");
        } else {
          showSuccessToast("Entidad activada con éxito");
        }
        loadEntities();
        clearSelectedRow();
      } else {
        showErrorToast("Error al activar o inactivar entidad");
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        const errorMessage = data?.detail || "Error desconocido";
        showErrorToast(errorMessage);
        console.error(`Error ${status}: ${errorMessage}`);
      }
    }
  };

  //* Función para limpiar la fila seleccionada
  const clearSelectedRow = () => {
    setSelectedRow(null);
  };

  useEffect(() => {
    loadEntities();
  }, [loadEntities]);

  return (
    <Layout pageTitle="Entidades">
      <div className="container-fluid">
        {/* Accions */}
        <TopBar
          searchMessage={"Buscar entidad ..."}
          watchButton={true}
          searchInput={true}
          pathAll={Paths.ENTITIES}
          pathActive={Paths.ACTIVE_ENTITIES}
          pathInactive={Paths.INACTIVE_ENTITIES}
          onAdd={() => setModalAddIsOpen(true)}
          onUpdate={() => {
            if (selectedRow) {
              setModalUpdateIsOpen(true);
            } else {
              showErrorToast("Seleccione la entidad que desea modificar");
            }
          }}
          onDelete={() => {
            if (selectedRow) {
              setModalDeleteIsOpen(true);
            } else {
              showErrorToast("Seleccione la entidad que desea eliminar");
            }
          }}
          onActivate={() => {
            if (selectedRow) {
              setModalActivateIsOpen(true);
            } else {
              showErrorToast(
                "Seleccione la entidad que desea activar o inactivar"
              );
            }
          }}
          onWatch={() => {
            if (selectedRow) {
              setModalWatchIsOpen(true);
            } else {
              showErrorToast("Seleccione la entidad que desea visualizar");
            }
          }}
          onSearch={(term) => {
            clearSelectedRow();
            setSearchTerm(term);
            setCurrentPage(1);
          }}
        />
        {/* Grid */}
        <div
          className="card card-body mt-2 py-2 px-3 border-secondary-subtle shadow-sm mx-1 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 115px)" }}
        >
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
          loadEntities();
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
          loadEntities();
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
        onDelete={handleDeleteEntity}
        message={`Está a punto de eliminar la entidad "${
          selectedRow && selectedRow.description
        }".`}
      />

      {/* Modal para activar/inactivar una entidad */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={handleActivateEntity}
        message={`Está a punto de ${
          selectedRow && selectedRow.is_active ? "inactivar" : "activar"
        } la entidad "${selectedRow && selectedRow.description}".`}
        activated={selectedRow && selectedRow.is_active}
      />
    </Layout>
  );
}

export default EntitiesPage;
