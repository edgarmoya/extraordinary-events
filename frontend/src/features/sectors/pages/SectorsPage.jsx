import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../../layout/Layout";
import GridSectors from "../components/GridSectors";
import SectorService from "../../../api/sectors.api";
import TopBar from "../../../layout/TopBar";
import Paths from "../../../routes/Paths";
import ModalSectors from "../components/ModalSectors";
import ModalConfirmDelete from "../../../ui/modals/ModalConfirmDelete";
import ModalConfirmActivate from "../../../ui/modals/ModalConfirmActivate";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { HttpStatusCode } from "axios";
import TableLoader from "../../../ui/skeletons/TableLoader";

function SectorsPage() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [sectors, setSectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSectors, setTotalSectors] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  //* Función para cargar todos los sectores
  const loadSectors = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (location.pathname === Paths.ACTIVE_SECTORS) {
        response = await SectorService.getSectors(
          currentPage,
          searchTerm,
          "True"
        );
      } else if (location.pathname === Paths.INACTIVE_SECTORS) {
        response = await SectorService.getSectors(
          currentPage,
          searchTerm,
          "False"
        );
      } else {
        response = await SectorService.getSectors(currentPage, searchTerm);
      }

      setSectors(response.data.results);
      setTotalSectors(response.data.count);
    } catch (error) {
      console.error("Error obteniendo los sectores: ", error);
    } finally {
      setLoading(false);
    }
  }, [location.pathname, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar un sector
  const handleDeleteSector = async () => {
    try {
      const response = await SectorService.deleteSector(selectedRow.id);
      if (response.status === HttpStatusCode.NoContent) {
        showSuccessToast("Sector eliminado con éxito");
        loadSectors();
        clearSelectedRow();
      } else {
        showErrorToast("Error al eliminar sector");
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

  //* Función para activar/inactivar un sector
  const handleActivateSector = async () => {
    try {
      const response = await SectorService.activateSector(
        selectedRow.id,
        selectedRow.is_active
      );
      if (response.status === HttpStatusCode.Ok) {
        if (selectedRow.is_active) {
          showSuccessToast("Sector inactivado con éxito");
        } else {
          showSuccessToast("Sector activado con éxito");
        }
        loadSectors();
        clearSelectedRow();
      } else {
        showErrorToast("Error al activar o inactivar sector");
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
    loadSectors();
  }, [loadSectors]);

  return (
    <Layout pageTitle="Sectores">
      <div className="container-fluid">
        {/* Accions */}
        <TopBar
          searchMessage={"Buscar sector ..."}
          watchButton={false}
          searchInput={true}
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
          {loading ? (
            <TableLoader columns={2} />
          ) : (
            <GridSectors
              data={sectors}
              onRowSelected={(row) => setSelectedRow(row)}
              onAdd={() => setModalAddIsOpen(true)}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalSectors}
            />
          )}
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
