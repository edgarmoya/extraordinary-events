import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";

import Layout from "./Layout";
import Paths from "../routes/Paths";
import EntityService from "../api/entities.api";
import Pagination from "../components/Pagination";
import ModalConfirmDelete from "../components/ModalConfirmDelete";
import ModalConfirmActivate from "../components/ModalConfirmActivate";
import GridEntities from "../components/GridEntities";
import TopBar from "../components/TopBar";
import ModalEntities from "../components/ModalEntities";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { HttpStatusCode } from "axios";

function EntitiesPage() {
  const location = useLocation();
  const [entities, setEntities] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEntities, setTotalEntities] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);
  const [modalWatchIsOpen, setModalWatchIsOpen] = useState(false);

  //* Función para cargar todos las entidades
  const loadAllEntities = useCallback(async () => {
    try {
      const response = await EntityService.getEntities(currentPage, searchTerm);
      setEntities(response.data.results);
      setTotalEntities(response.data.count);
    } catch (error) {
      console.error("Error fetching entities for page: ", error);
    }
  }, [currentPage, searchTerm]);

  //* Función para cargar las entidades activas
  const loadActiveEntities = useCallback(async () => {
    try {
      const response = await EntityService.getActiveEntities(
        currentPage,
        searchTerm
      );
      setEntities(response.data.results);
      setTotalEntities(response.data.count);
    } catch (error) {
      console.error("Error fetching entities for page: ", error);
    }
  }, [currentPage, searchTerm]);

  //* Función para cargar las entidades inactivas
  const loadInactiveEntities = useCallback(async () => {
    try {
      const response = await EntityService.getInactiveEntities(
        currentPage,
        searchTerm
      );
      setEntities(response.data.results);
      setTotalEntities(response.data.count);
    } catch (error) {
      console.error("Error fetching entities for page: ", error);
    }
  }, [currentPage, searchTerm]);

  //* Función para cargar las entidades según la ubicación actual
  const loadEntities = useCallback(async () => {
    if (location.pathname === Paths.ACTIVE_ENTITIES) {
      await loadActiveEntities();
    } else if (location.pathname === Paths.INACTIVE_ENTITIES) {
      loadInactiveEntities();
    } else {
      loadAllEntities();
    }
  }, [
    location.pathname,
    loadAllEntities,
    loadActiveEntities,
    loadInactiveEntities,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar una entidad
  const handleDeleteEntity = async () => {
    try {
      const response = await EntityService.deleteEntity(selectedRow.id_entity);
      if (response.status === HttpStatusCode.NoContent) {
        showSuccessToast("Entidad eliminada");
        loadEntities();
        clearSelectedRow();
      } else {
        showErrorToast("Error al eliminar entidad");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else if (status === HttpStatusCode.InternalServerError) {
          showErrorToast(
            "El elemento no puede ser eliminado, se encuentra en uso"
          );
        } else {
          showErrorToast("Error al eliminar entidad");
        }
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
          showSuccessToast("Entidad inactivada");
        } else {
          showSuccessToast("Entidad activada");
        }
        loadEntities();
        clearSelectedRow();
      } else {
        showErrorToast("Error al activar o inactivar entidad");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else {
          if (selectedRow.is_active) {
            showErrorToast("Error al inactivar entidad");
          } else {
            showErrorToast("Error al activar entidad");
          }
        }
      }
    }
  };

  //* Función para limpiar la fila seleccionada
  const clearSelectedRow = () => {
    setSelectedRow(null);
  };

  useEffect(() => {
    loadEntities();
  }, [location.pathname, currentPage, loadEntities]);

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
          <GridEntities
            data={entities}
            onRowSelected={(row) => setSelectedRow(row)}
          />
          <div className="card card-footer bg-body border-0">
            <Pagination
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalEntities}
            />
          </div>
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
