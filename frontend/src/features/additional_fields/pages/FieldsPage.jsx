import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../../layout/Layout";
import Paths from "../../../routes/Paths";
import FieldService from "../../../api/fields.api";
import ModalConfirmDelete from "../../../ui/modals/ModalConfirmDelete";
import ModalConfirmActivate from "../../../ui/modals/ModalConfirmActivate";
import GridFields from "../components/GridFields";
import TopBar from "../../../layout/TopBar";
import ModalFields from "../components/ModalFields";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { HttpStatusCode } from "axios";
import TableLoader from "../../../ui/skeletons/TableLoader";

function FieldsPage() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFields, setTotalFields] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  //* Función para cargar todos los campos adicionales
  const loadFields = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (location.pathname === Paths.ACTIVE_ADDFIELDS) {
        response = await FieldService.getFields(
          currentPage,
          searchTerm,
          "True"
        );
      } else if (location.pathname === Paths.INACTIVE_ADDFIELDS) {
        response = await FieldService.getFields(
          currentPage,
          searchTerm,
          "False"
        );
      } else {
        response = await FieldService.getFields(currentPage, searchTerm);
      }

      setFields(response.data.results);
      setTotalFields(response.data.count);
    } catch (error) {
      console.error("Error obteniendo los campos: ", error);
    } finally {
      setLoading(false);
    }
  }, [location.pathname, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar un campo adicional
  const handleDeleteField = async () => {
    try {
      const response = await FieldService.deleteField(selectedRow.id);
      if (response.status === HttpStatusCode.NoContent) {
        showSuccessToast("Campo adicional eliminado con éxito");
        loadFields();
        clearSelectedRow();
      } else {
        showErrorToast("Error al eliminar campo");
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

  //* Función para activar/inactivar un campo
  const handleActivateField = async () => {
    try {
      const response = await FieldService.activateField(
        selectedRow.id,
        selectedRow.is_active
      );
      if (response.status === HttpStatusCode.Ok) {
        if (selectedRow.is_active) {
          showSuccessToast("Campo adicional inactivado con éxito");
        } else {
          showSuccessToast("Campo adicional activado con éxito");
        }
        loadFields();
        clearSelectedRow();
      } else {
        showErrorToast("Error al activar o inactivar campo");
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
    loadFields();
  }, [loadFields]);

  return (
    <Layout pageTitle="Campos adicionales">
      <div className="container-fluid">
        {/* Accions */}
        <TopBar
          searchMessage={"Buscar campos ..."}
          watchButton={false}
          searchInput={true}
          pathAll={Paths.ADDFIELDS}
          pathActive={Paths.ACTIVE_ADDFIELDS}
          pathInactive={Paths.INACTIVE_ADDFIELDS}
          onAdd={() => setModalAddIsOpen(true)}
          onUpdate={() => {
            if (selectedRow) {
              setModalUpdateIsOpen(true);
            } else {
              showErrorToast("Seleccione el campo que desea modificar");
            }
          }}
          onDelete={() => {
            if (selectedRow) {
              setModalDeleteIsOpen(true);
            } else {
              showErrorToast("Seleccione el campo que desea eliminar");
            }
          }}
          onActivate={() => {
            if (selectedRow) {
              setModalActivateIsOpen(true);
            } else {
              showErrorToast(
                "Seleccione el campo que desea activar o inactivar"
              );
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
            <TableLoader columns={3} />
          ) : (
            <GridFields
              data={fields}
              onRowSelected={(row) => setSelectedRow(row)}
              onAdd={() => setModalAddIsOpen(true)}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalFields}
            />
          )}
        </div>
      </div>

      {/* Modal para agregar un nuevo campo */}
      <ModalFields
        isOpen={modalAddIsOpen}
        onClose={() => setModalAddIsOpen(false)}
        title={"Añadir campo adicional"}
        size={"modal-lg"}
        onRefresh={() => {
          loadFields();
          clearSelectedRow();
        }}
      />

      {/* Modal para modificar un campo */}
      <ModalFields
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Modificar campo adicional"}
        size={"modal-lg"}
        onRefresh={() => {
          loadFields();
          clearSelectedRow();
        }}
        fieldData={selectedRow}
      />

      {/* Modal para eliminar un campo */}
      <ModalConfirmDelete
        isOpen={modalDeleteIsOpen}
        onClose={() => {
          setModalDeleteIsOpen(false);
        }}
        onDelete={handleDeleteField}
        message={`Está a punto de eliminar el campo adicional "${
          selectedRow && selectedRow.description
        }".`}
      />

      {/* Modal para activar/inactivar un campo */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={handleActivateField}
        message={`Está a punto de ${
          selectedRow && selectedRow.is_active ? "inactivar" : "activar"
        } el campo adicional "${selectedRow && selectedRow.description}".`}
        activated={selectedRow && selectedRow.is_active}
      />
    </Layout>
  );
}

export default FieldsPage;
