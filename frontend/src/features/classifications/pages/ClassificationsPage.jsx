import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../../layout/Layout";
import GridClassifications from "../components/GridClassifications";
import TableLoader from "../../../ui/skeletons/TableLoader";
import ClassificationService from "../../../api/classifications.api";
import TopBar from "../../../layout/TopBar";
import Paths from "../../../routes/Paths";
import ModalClassifications from "../components/ModalClassifications";
import ModalConfirmDelete from "../../../ui/modals/ModalConfirmDelete";
import ModalConfirmActivate from "../../../ui/modals/ModalConfirmActivate";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { HttpStatusCode } from "axios";
import { ActiveIcon, AddIcon, DeleteIcon, UpdateIcon } from "../../../ui/icons";

function ClassificationsPage() {
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Estado para el loader
  const [classifications, setClassifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClassifications, setTotalClassifications] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  //* Función para cargar todos las clasificaciones
  const loadClassifications = useCallback(async () => {
    setLoading(true); // Activa el loader
    try {
      let response;
      if (location.pathname === Paths.ACTIVE_CLASSIFICATIONS) {
        response = await ClassificationService.getClassifications(
          currentPage,
          searchTerm,
          "True"
        );
      } else if (location.pathname === Paths.INACTIVE_CLASSIFICATIONS) {
        response = await ClassificationService.getClassifications(
          currentPage,
          searchTerm,
          "False"
        );
      } else {
        response = await ClassificationService.getClassifications(
          currentPage,
          searchTerm
        );
      }

      setClassifications(response.data.results);
      setTotalClassifications(response.data.count);
    } catch (error) {
      console.error("Error obteniendo las clasificaciones: ", error);
    } finally {
      setLoading(false); // Desactiva el loader
    }
  }, [location.pathname, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar una clasificación
  const handleDeleteClassification = async () => {
    try {
      const response = await ClassificationService.deleteClassification(
        selectedRow.id
      );
      if (response.status === HttpStatusCode.NoContent) {
        showSuccessToast("Clasificación eliminada con éxito");
        loadClassifications();
        clearSelectedRow();
      } else {
        showErrorToast("Error al eliminar clasificación");
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

  //* Función para activar/inactivar una clasificación
  const handleActivateClassification = async () => {
    try {
      const response = await ClassificationService.activateClassification(
        selectedRow.id,
        selectedRow.is_active
      );
      if (response.status === HttpStatusCode.Ok) {
        if (selectedRow.is_active) {
          showSuccessToast("Clasificación inactivada con éxito");
        } else {
          showSuccessToast("Clasificación activada con éxito");
        }
        loadClassifications();
        clearSelectedRow();
      } else {
        showErrorToast("Error al activar o inactivar clasificación");
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
    loadClassifications();
  }, [loadClassifications]);

  return (
    <Layout pageTitle="Clasificaciones">
      <div className="container-fluid">
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
                showErrorToast(
                  "Seleccione la clasificación que desea modificar"
                );
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
                  "Seleccione la clasificación que desea eliminar"
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
                  "Seleccione la clasificación que desea activar o inactivar"
                );
              }
            }}
            icon={ActiveIcon}
          />
          <TopBar.Dropdown
            pathAll={Paths.CLASSIFICATIONS}
            pathActive={Paths.ACTIVE_CLASSIFICATIONS}
            pathInactive={Paths.INACTIVE_CLASSIFICATIONS}
          />
          <TopBar.Search
            searchMessage={"Buscar clasificación ..."}
            onSearch={(term) => {
              clearSelectedRow();
              setCurrentPage(1);
              setSearchTerm(term);
            }}
          />
        </TopBar>

        {/* Tabla de clasificaciones */}
        <div className="card card-body table-container mt-2 py-2 px-0 border-secondary-subtle shadow-sm">
          {loading ? (
            <TableLoader columns={3} />
          ) : (
            <GridClassifications
              data={classifications}
              onRowSelected={(row) => setSelectedRow(row)}
              onAdd={() => setModalAddIsOpen(true)}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalClassifications}
            />
          )}
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
