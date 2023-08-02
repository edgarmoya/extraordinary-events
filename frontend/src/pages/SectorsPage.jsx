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
import SectorsService from "../api/sectors.api";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

function SectorsPage() {
  const { authTokens } = useContext(AuthContext);
  const location = useLocation();
  const [sectors, setSectors] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSectors, setTotalSectors] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);

  //* Función para cargar todos los sectores
  const loadAllSectors = useCallback(async () => {
    try {
      const response = await SectorService.getSectors(authTokens, currentPage);
      setSectors(response.data.results);
      setTotalSectors(response.data.count);
    } catch (error) {
      console.error("Error fetching sectors for page: ", error);
    }
  }, [authTokens, currentPage]);

  //* Función para cargar los sectores activos
  const loadActiveSectors = useCallback(async () => {
    try {
      const response = await SectorService.getActiveSectors(
        authTokens,
        currentPage
      );
      setSectors(response.data.results);
      setTotalSectors(response.data.count);
    } catch (error) {
      console.error("Error fetching sectors for page: ", error);
    }
  }, [authTokens, currentPage]);

  //* Función para cargar los sectores inactivos
  const loadInactiveSectors = useCallback(async () => {
    try {
      const response = await SectorService.getInactiveSectors(
        authTokens,
        currentPage
      );
      setSectors(response.data.results);
      setTotalSectors(response.data.count);
    } catch (error) {
      console.error("Error fetching sectors for page: ", error);
    }
  }, [authTokens, currentPage]);

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
  };

  const handleDeleteSector = async () => {
    await SectorsService.deleteSector(authTokens, selectedRow.id)
      .then((data) => {
        showSuccessToast("Sector eliminado");
        loadSectors();
        setSelectedRow(null);
      })
      .catch((error) => {
        showErrorToast("Error al eliminar sector");
      });
  };

  useEffect(() => {
    loadSectors();
  }, [location.pathname, currentPage, loadSectors]);

  return (
    <Layout pageTitle="Sectores">
      <div className="container-fluid">
        {/* Accions */}
        <TopBar
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
        onRefresh={loadSectors}
      />

      {/* Modal para modificar un sector */}
      <ModalSectors
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Modificar sector"}
        onRefresh={loadSectors}
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
        }". ¿Desea eliminarlo?`}
      />
    </Layout>
  );
}

export default SectorsPage;
