import React, { useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import AuthContext from "../contexts/AuthContext";
import GridClassifications from "../components/GridClassifications";
import ClassificationService from "../api/classifications.api";
import Pagination from "../components/Pagination";
import TopBar from "../components/TopBar";
import Paths from "../routes/Paths";
import ModalClassifications from "../components/ModalClassifications";
import ModalConfirmDelete from "../components/ModalConfirmDelete";
import ModalConfirmActivate from "../components/ModalConfirmActivate";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { HttpStatusCode } from "axios";

function ClassificationsPage() {
  const { authTokens } = useContext(AuthContext);
  const location = useLocation();
  const [classifications, setClassifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClassifications, setTotalClassifications] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  //* Función para cargar todos las clasificaciones
  const loadAllClassifications = useCallback(async () => {
    try {
      const response = await ClassificationService.getClassifications(
        authTokens,
        currentPage,
        searchTerm
      );
      setClassifications(response.data.results);
      setTotalClassifications(response.data.count);
    } catch (error) {
      console.error("Error fetching classifications for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar las clasificaciones activas
  const loadActiveClassifications = useCallback(async () => {
    try {
      const response = await ClassificationService.getActiveClassifications(
        authTokens,
        currentPage,
        searchTerm
      );
      setClassifications(response.data.results);
      setTotalClassifications(response.data.count);
    } catch (error) {
      console.error("Error fetching classifications for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar las clasificaciones inactivas
  const loadInactiveClassifications = useCallback(async () => {
    try {
      const response = await ClassificationService.getInactiveClassifications(
        authTokens,
        currentPage,
        searchTerm
      );
      setClassifications(response.data.results);
      setTotalClassifications(response.data.count);
    } catch (error) {
      console.error("Error fetching classifications for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar las clasificaciones según la ubicación actual
  const loadClassifications = useCallback(() => {
    if (location.pathname === Paths.ACTIVE_CLASSIFICATIONS) {
      loadActiveClassifications();
    } else if (location.pathname === Paths.INACTIVE_CLASSIFICATIONS) {
      loadInactiveClassifications();
    } else {
      loadAllClassifications();
    }
  }, [
    location.pathname,
    loadAllClassifications,
    loadActiveClassifications,
    loadInactiveClassifications,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar una clasificación
  const handleDeleteClassification = async () => {
    try {
      const response = await ClassificationService.deleteClassification(
        authTokens,
        selectedRow.id
      );
      if (response.status === HttpStatusCode.NoContent) {
        showSuccessToast("Clasificación eliminada");
        loadClassifications();
        clearSelectedRow();
      } else {
        showErrorToast("Error al eliminar clasificación");
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
          showErrorToast("Error al eliminar clasificación");
        }
      }
    }
  };

  //* Función para activar/inactivar una clasificación
  const handleActivateClassification = async () => {
    try {
      const response = await ClassificationService.activateClassification(
        authTokens,
        selectedRow.id,
        selectedRow.is_active
      );
      if (response.status === HttpStatusCode.Ok) {
        if (selectedRow.is_active) {
          showSuccessToast("Clasificación inactivada");
        } else {
          showSuccessToast("Clasificación activada");
        }
        loadClassifications();
        clearSelectedRow();
      } else {
        showErrorToast("Error al activar o inactivar clasificación");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else {
          if (selectedRow.is_active) {
            showErrorToast("Error al inactivar clasificación");
          } else {
            showErrorToast("Error al activar clasificación");
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
    loadClassifications();
  }, [location.pathname, currentPage, loadClassifications]);

  return (
    <Layout pageTitle="Clasificaciones">
      <div className="container-fluid">
        {/* Accions */}
        <TopBar
          searchMessage={"Buscar clasificación ..."}
          watchButton={false}
          searchInput={true}
          pathAll={Paths.CLASSIFICATIONS}
          pathActive={Paths.ACTIVE_CLASSIFICATIONS}
          pathInactive={Paths.INACTIVE_CLASSIFICATIONS}
          onAdd={() => setModalAddIsOpen(true)}
          onUpdate={() => {
            if (selectedRow) {
              setModalUpdateIsOpen(true);
            } else {
              showErrorToast("Seleccione la clasificación que desea modificar");
            }
          }}
          onDelete={() => {
            if (selectedRow) {
              setModalDeleteIsOpen(true);
            } else {
              showErrorToast("Seleccione la clasificación que desea eliminar");
            }
          }}
          onActivate={() => {
            if (selectedRow) {
              setModalActivateIsOpen(true);
            } else {
              showErrorToast(
                "Seleccione la clasificación que desea activar o inactivar"
              );
            }
          }}
          onSearch={(term) => {
            clearSelectedRow();
            setCurrentPage(1);
            setSearchTerm(term);
          }}
        />
        {/* Grid */}
        <div
          className="card card-body mt-2 py-2 px-3 border-secondary-subtle shadow-sm mx-1 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 115px)" }}
        >
          <GridClassifications
            data={classifications}
            onRowSelected={(row) => setSelectedRow(row)}
          />
          <div className="card card-footer bg-body border-0">
            <Pagination
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalClassifications}
            />
          </div>
        </div>
      </div>

      {/* Modal para agregar una nueva clasificación */}
      <ModalClassifications
        isOpen={modalAddIsOpen}
        onClose={() => setModalAddIsOpen(false)}
        title={"Añadir clasificación"}
        onRefresh={() => {
          loadClassifications();
          clearSelectedRow();
        }}
      />

      {/* Modal para modificar una clasificación */}
      <ModalClassifications
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Modificar clasificación"}
        onRefresh={() => {
          loadClassifications();
          clearSelectedRow();
        }}
        classificationData={selectedRow}
      />

      {/* Modal para eliminar una clasificación */}
      <ModalConfirmDelete
        isOpen={modalDeleteIsOpen}
        onClose={() => {
          setModalDeleteIsOpen(false);
        }}
        onDelete={handleDeleteClassification}
        message={`Está a punto de eliminar la clasificación "${
          selectedRow && selectedRow.description
        }".`}
      />

      {/* Modal para activar/inactivar una clasificación  */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={handleActivateClassification}
        message={`Está a punto de ${
          selectedRow && selectedRow.is_active ? "inactivar" : "activar"
        } la clasificación  "${selectedRow && selectedRow.description}".`}
        activated={selectedRow && selectedRow.is_active}
      />
    </Layout>
  );
}

export default ClassificationsPage;
