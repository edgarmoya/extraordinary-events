import React, { useState, useEffect } from "react";
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
import TableLoader from "../../../ui/skeletons/TableLoader";
import { ActiveIcon, AddIcon, DeleteIcon, UpdateIcon } from "../../../ui/icons";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";

function SectorsPage() {
  const location = useLocation();
  const [sectors, setSectors] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalSectors, setTotalSectors] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  const isActive =
    location.pathname === Paths.ACTIVE_SECTORS
      ? "True"
      : location.pathname === Paths.INACTIVE_SECTORS
      ? "False"
      : undefined;

  //* Cargar todos los sectores
  const { data, loading, refetch } = useFetchData(
    SectorService.getSectors,
    [currentPage, searchTerm, isActive],
    [location.pathname, currentPage, searchTerm]
  );

  useEffect(() => {
    if (data) {
      setSectors(data.results || []);
      setTotalSectors(data.count || 0);
    }
  }, [data]);

  //* Función para eliminar un sector
  const { execute: deleteSector, loading: deleting } = useApiMutation(
    SectorService.deleteSector,
    {
      onSuccess: () => {
        showSuccessToast("Sector eliminado con éxito");
        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para activar/inactivar un sector
  const { execute: activateSector, loading: activating } = useApiMutation(
    SectorService.activateSector,
    {
      onSuccess: (response) => {
        const { data } = response; // Acceder al la respuesta

        if (data.is_active) {
          showSuccessToast("Sector activado con éxito");
        } else {
          showSuccessToast("Sector inactivado con éxito");
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

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  return (
    <Layout pageTitle="Sectores">
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
                showErrorToast("Seleccione el sector que desea modificar");
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
                showErrorToast("Seleccione el sector que desea eliminar");
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
                  "Seleccione el sector que desea activar o inactivar"
                );
              }
            }}
            icon={ActiveIcon}
          />
          <TopBar.Dropdown
            pathAll={Paths.SECTORS}
            pathActive={Paths.ACTIVE_SECTORS}
            pathInactive={Paths.INACTIVE_SECTORS}
          />
          <TopBar.Search
            searchMessage={"Buscar sector ..."}
            onSearch={(term) => {
              clearSelectedRow();
              setCurrentPage(1);
              setSearchTerm(term);
            }}
          />
        </TopBar>

        {/* Tabla con sectores */}
        <div
          className="card h-100 card-body table-container mt-2 py-2 px-0 border-secondary-subtle shadow-sm overflow-x-hidden justify-content-between"
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
          refetch();
          clearSelectedRow();
        }}
      />

      {/* Modal para modificar un sector */}
      <ModalSectors
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Modificar sector"}
        onRefresh={() => {
          refetch();
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
        onDelete={() => deleteSector(selectedRow?.id)}
        message={`Está a punto de eliminar el sector "${selectedRow?.description}".`}
        loading={deleting}
      />

      {/* Modal para activar/inactivar un sector */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={() =>
          activateSector({
            id: selectedRow?.id,
            activated: selectedRow?.is_active,
          })
        }
        message={`Está a punto de ${
          selectedRow?.is_active ? "inactivar" : "activar"
        } el sector "${selectedRow?.description}".`}
        activated={selectedRow?.is_active}
        loading={activating}
      />
    </Layout>
  );
}

export default SectorsPage;
