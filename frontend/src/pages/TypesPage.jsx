import React, { useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Layout from "./Layout";
import AuthContext from "../contexts/AuthContext";
import GridTypes from "../components/GridTypes";
import TypeService from "../api/types.api";
import Pagination from "../components/Pagination";
import TopBar from "../components/TopBar";
import Paths from "../routes/Paths";
import ModalTypes from "../components/ModalTypes";
import ModalConfirmDelete from "../components/ModalConfirmDelete";
import ModalConfirmActivate from "../components/ModalConfirmActivate";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";

function TypesPage() {
  const { authTokens } = useContext(AuthContext);
  const location = useLocation();
  const [types, setTypes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTypes, setTotalTypes] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  //* Función para cargar todos los tipos de hecho
  const loadAllTypes = useCallback(async () => {
    try {
      const response = await TypeService.getTypes(
        authTokens,
        currentPage,
        searchTerm
      );
      setTypes(response.data.results);
      setTotalTypes(response.data.count);
    } catch (error) {
      console.error("Error fetching types for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar los tipos de hecho activos
  const loadActiveTypes = useCallback(async () => {
    try {
      const response = await TypeService.getActiveTypes(
        authTokens,
        currentPage,
        searchTerm
      );
      setTypes(response.data.results);
      setTotalTypes(response.data.count);
    } catch (error) {
      console.error("Error fetching types for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar los tipos de hecho inactivos
  const loadInactiveTypes = useCallback(async () => {
    try {
      const response = await TypeService.getInactiveTypes(
        authTokens,
        currentPage,
        searchTerm
      );
      setTypes(response.data.results);
      setTotalTypes(response.data.count);
    } catch (error) {
      console.error("Error fetching types for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar los tipos de hecho según la ubicación actual
  const loadTypes = useCallback(() => {
    if (location.pathname === Paths.ACTIVE_TYPES) {
      loadActiveTypes();
    } else if (location.pathname === Paths.INACTIVE_TYPES) {
      loadInactiveTypes();
    } else {
      loadAllTypes();
    }
  }, [location.pathname, loadAllTypes, loadActiveTypes, loadInactiveTypes]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar un tipo de hecho
  const handleDeleteType = async () => {
    await TypeService.deleteType(authTokens, selectedRow.id)
      .then((data) => {
        showSuccessToast("Tipo de hecho eliminado");
        loadTypes();
        clearSelectedRow();
      })
      .catch((error) => {
        showErrorToast("Error al eliminar tipo de hecho");
      });
  };

  //* Función para activar/inactivar un tipo de hecho
  const handleActivateType = async () => {
    await TypeService.activateType(
      authTokens,
      selectedRow.id,
      selectedRow.is_active
    )
      .then((data) => {
        if (selectedRow.is_active) {
          showSuccessToast("Tipo de hecho inactivado");
        } else {
          showSuccessToast("Tipo de hecho activado");
        }
        loadTypes();
        clearSelectedRow();
      })
      .catch((error) => {
        if (selectedRow.is_active) {
          showErrorToast("Error al inactivar tipo de hecho");
        } else {
          showErrorToast("Error al activar tipo de hecho");
        }
      });
  };

  //* Función para limpiar la fila seleccionada
  const clearSelectedRow = () => {
    setSelectedRow(null);
  };

  useEffect(() => {
    loadTypes();
  }, [location.pathname, currentPage, loadTypes]);

  return (
    <Layout pageTitle="Tipos">
      <div className="container-fluid">
        {/* Accions */}
        <TopBar
          searchMessage={"Buscar tipo ..."}
          watchButton={false}
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
          <GridTypes
            data={types}
            onRowSelected={(row) => setSelectedRow(row)}
          />
          <div className="card card-footer bg-body border-0">
            <Pagination
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalTypes}
            />
          </div>
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
