import React, { useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import AuthContext from "../contexts/AuthContext";
import GridSectors from "../components/GridSectors";
import SectorService from "../api/sectors.api";
import Pagination from "../components/Pagination";
import TopBar from "../components/TopBar";
import Paths from "../routes/Paths";
import ModalSectors from "../components/ModalSectors";
import ModalConfirmDelete from "../components/ModalConfirmDelete";
import ModalConfirmActivate from "../components/ModalConfirmActivate";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { HttpStatusCode } from "axios";

function SectorsPage() {
  const { authTokens } = useContext(AuthContext);
  const location = useLocation();
  const [sectors, setSectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSectors, setTotalSectors] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  //* Función para cargar todos los sectores
  const loadAllSectors = useCallback(async () => {
    try {
      const response = await SectorService.getSectors(
        authTokens,
        currentPage,
        searchTerm
      );
      setSectors(response.data.results);
      setTotalSectors(response.data.count);
    } catch (error) {
      console.error("Error fetching sectors for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar los sectores activos
  const loadActiveSectors = useCallback(async () => {
    try {
      const response = await SectorService.getActiveSectors(
        authTokens,
        currentPage,
        searchTerm
      );
      setSectors(response.data.results);
      setTotalSectors(response.data.count);
    } catch (error) {
      console.error("Error fetching sectors for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar los sectores inactivos
  const loadInactiveSectors = useCallback(async () => {
    try {
      const response = await SectorService.getInactiveSectors(
        authTokens,
        currentPage,
        searchTerm
      );
      setSectors(response.data.results);
      setTotalSectors(response.data.count);
    } catch (error) {
      console.error("Error fetching sectors for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar los sectores según la ubicación actual
  const loadSectors = useCallback(() => {
    if (location.pathname === Paths.ACTIVE_SECTORS) {
      loadActiveSectors();
    } else if (location.pathname === Paths.INACTIVE_SECTORS) {
      loadInactiveSectors();
    } else {
      loadAllSectors();
    }
  }, [
    location.pathname,
    loadAllSectors,
    loadActiveSectors,
    loadInactiveSectors,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar un sector
  const handleDeleteSector = async () => {
    try {
      const response = await SectorService.deleteSector(
        authTokens,
        selectedRow.id
      );
      if (response.status === HttpStatusCode.NoContent) {
        showSuccessToast("Sector eliminado");
        loadSectors();
        clearSelectedRow();
      } else {
        showErrorToast("Error al eliminar sector");
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
          showErrorToast("Error al eliminar sector");
        }
      }
    }
  };

  //* Función para activar/inactivar un sector
  const handleActivateSector = async () => {
    try {
      const response = await SectorService.activateSector(
        authTokens,
        selectedRow.id,
        selectedRow.is_active
      );
      if (response.status === HttpStatusCode.Ok) {
        if (selectedRow.is_active) {
          showSuccessToast("Sector inactivado");
        } else {
          showSuccessToast("Sector activado");
        }
        loadSectors();
        clearSelectedRow();
      } else {
        showErrorToast("Error al activar o inactivar sector");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else {
          if (selectedRow.is_active) {
            showErrorToast("Error al inactivar sector");
          } else {
            showErrorToast("Error al activar sector");
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
    loadSectors();
  }, [location.pathname, currentPage, loadSectors]);

  return (
    <Layout pageTitle="Sectores">
      <div className="container-fluid">
        {/* Accions */}
        <TopBar
          searchMessage={"Buscar sector ..."}
          watchButton={false}
          pathAll={Paths.SECTORS}
          pathActive={Paths.ACTIVE_SECTORS}
          pathInactive={Paths.INACTIVE_SECTORS}
          onAdd={() => setModalAddIsOpen(true)}
          onUpdate={() => {
            if (selectedRow) {
              setModalUpdateIsOpen(true);
            } else {
              showErrorToast("Seleccione el sector que desea modificar");
            }
          }}
          onDelete={() => {
            if (selectedRow) {
              setModalDeleteIsOpen(true);
            } else {
              showErrorToast("Seleccione el sector que desea eliminar");
            }
          }}
          onActivate={() => {
            if (selectedRow) {
              setModalActivateIsOpen(true);
            } else {
              showErrorToast(
                "Seleccione el sector que desea activar o inactivar"
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
          <GridSectors
            data={sectors}
            onRowSelected={(row) => setSelectedRow(row)}
          />
          <div className="card card-footer bg-body border-0">
            <Pagination
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalSectors}
            />
          </div>
        </div>
      </div>

      {/* Modal para agregar un nuevo sector */}
      <ModalSectors
        isOpen={modalAddIsOpen}
        onClose={() => setModalAddIsOpen(false)}
        title={"Añadir sector"}
        onRefresh={() => {
          loadSectors();
          clearSelectedRow();
        }}
      />

      {/* Modal para modificar un sector */}
      <ModalSectors
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Modificar sector"}
        onRefresh={() => {
          loadSectors();
          clearSelectedRow();
        }}
        sectorData={selectedRow}
      />

      {/* Modal para eliminar un sector */}
      <ModalConfirmDelete
        isOpen={modalDeleteIsOpen}
        onClose={() => {
          setModalDeleteIsOpen(false);
        }}
        onDelete={handleDeleteSector}
        message={`Está a punto de eliminar el sector "${
          selectedRow && selectedRow.description
        }".`}
      />

      {/* Modal para activar/inactivar un sector */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={handleActivateSector}
        message={`Está a punto de ${
          selectedRow && selectedRow.is_active ? "inactivar" : "activar"
        } el sector "${selectedRow && selectedRow.description}".`}
        activated={selectedRow && selectedRow.is_active}
      />
    </Layout>
  );
}

export default SectorsPage;
