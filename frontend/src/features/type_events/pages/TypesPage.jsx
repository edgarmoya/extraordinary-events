import React, { useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Layout from "../../../layout/Layout";
import GridTypes from "../components/GridTypes";
import TypeService from "../../../api/types.api";
import TopBar from "../../../layout/TopBar";
import Paths from "../../../routes/Paths";
import ModalTypes from "../components/ModalTypes";
import ModalConfirmDelete from "../../../ui/modals/ModalConfirmDelete";
import ModalConfirmActivate from "../../../ui/modals/ModalConfirmActivate";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { HttpStatusCode } from "axios";
import TableLoader from "../../../ui/skeletons/TableLoader";

function TypesPage() {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTypes, setTotalTypes] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  //* Función para cargar todos los tipos de hecho
  const loadTypes = useCallback(async () => {
    setLoading(true);
    try {
      let response;
      if (location.pathname === Paths.ACTIVE_TYPES) {
        response = await TypeService.getTypes(currentPage, searchTerm, "True");
      } else if (location.pathname === Paths.INACTIVE_TYPES) {
        response = await TypeService.getTypes(currentPage, searchTerm, "False");
      } else {
        response = await TypeService.getTypes(currentPage, searchTerm);
      }

      setTypes(response.data.results);
      setTotalTypes(response.data.count);
    } catch (error) {
      console.error("Error obteniendo los tipos de hechos: ", error);
    } finally {
      setLoading(false);
    }
  }, [location.pathname, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar un tipo de hecho
  const handleDeleteType = async () => {
    try {
      const response = await TypeService.deleteType(selectedRow.id);
      if (response.status === HttpStatusCode.NoContent) {
        showSuccessToast("Tipo de hecho eliminado con éxito");
        loadTypes();
        clearSelectedRow();
      } else {
        showErrorToast("Error al eliminar tipo de hecho");
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

  //* Función para activar/inactivar un tipo de hecho
  const handleActivateType = async () => {
    try {
      const response = await TypeService.activateType(
        selectedRow.id,
        selectedRow.is_active
      );
      if (response.status === HttpStatusCode.Ok) {
        if (selectedRow.is_active) {
          showSuccessToast("Tipo de hecho inactivado con éxito");
        } else {
          showSuccessToast("Tipo de hecho activado con éxito");
        }
        loadTypes();
        clearSelectedRow();
      } else {
        showErrorToast("Error al activar o inactivar tipo de hecho");
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
    loadTypes();
  }, [loadTypes]);

  return (
    <Layout pageTitle="Tipos">
      <div className="container-fluid">
        {/* Accions */}
        <TopBar
          searchMessage={"Buscar tipo ..."}
          watchButton={false}
          searchInput={true}
          pathAll={Paths.TYPES}
          pathActive={Paths.ACTIVE_TYPES}
          pathInactive={Paths.INACTIVE_TYPES}
          onAdd={() => setModalAddIsOpen(true)}
          onUpdate={() => {
            if (selectedRow) {
              setModalUpdateIsOpen(true);
            } else {
              showErrorToast("Seleccione el tipo de hecho que desea modificar");
            }
          }}
          onDelete={() => {
            if (selectedRow) {
              setModalDeleteIsOpen(true);
            } else {
              showErrorToast("Seleccione el tipo de hecho que desea eliminar");
            }
          }}
          onActivate={() => {
            if (selectedRow) {
              setModalActivateIsOpen(true);
            } else {
              showErrorToast(
                "Seleccione el tipo de hecho que desea activar o inactivar"
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
            <TableLoader columns={3} />
          ) : (
            <GridTypes
              data={types}
              onRowSelected={(row) => setSelectedRow(row)}
              onAdd={() => setModalAddIsOpen(true)}
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalTypes}
            />
          )}
        </div>
      </div>

      {/* Modal para agregar un nuevo tipo de hecho */}
      <ModalTypes
        isOpen={modalAddIsOpen}
        onClose={() => setModalAddIsOpen(false)}
        title={"Añadir tipo de hecho"}
        onRefresh={() => {
          loadTypes();
          clearSelectedRow();
        }}
      />

      {/* Modal para modificar un tipo de hecho */}
      <ModalTypes
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Modificar tipo de hecho"}
        onRefresh={() => {
          loadTypes();
          clearSelectedRow();
        }}
        typeData={selectedRow}
      />

      {/* Modal para eliminar un tipo de hecho */}
      <ModalConfirmDelete
        isOpen={modalDeleteIsOpen}
        onClose={() => {
          setModalDeleteIsOpen(false);
        }}
        onDelete={handleDeleteType}
        message={`Está a punto de eliminar el tipo de hecho "${
          selectedRow && selectedRow.description
        }".`}
      />

      {/* Modal para activar/inactivar un tipo de hecho */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={handleActivateType}
        message={`Está a punto de ${
          selectedRow && selectedRow.is_active ? "inactivar" : "activar"
        } el tipo de hecho "${selectedRow && selectedRow.description}".`}
        activated={selectedRow && selectedRow.is_active}
      />
    </Layout>
  );
}

export default TypesPage;
