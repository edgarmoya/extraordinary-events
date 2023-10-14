import React, { useContext, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import Layout from "./Layout";
import Paths from "../routes/Paths";
import EventService from "../api/event.api";
import Pagination from "../components/Pagination";
import ModalConfirmDelete from "../components/ModalConfirmDelete";
import ModalConfirmClose from "../components/ModalConfirmClose";
import GridEvents from "../components/GridEvents";
import TopBar from "../components/TopBar";
import ModalEvents from "../components/ModalEvents";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import { HttpStatusCode } from "axios";

function EventsPage() {
  const { authTokens, user } = useContext(AuthContext);
  const location = useLocation();
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalCloseIsOpen, setModalCloseIsOpen] = useState(false);
  const [modalWatchIsOpen, setModalWatchIsOpen] = useState(false);

  //* Función para cargar todos los hechos
  const loadAllEvents = useCallback(async () => {
    try {
      const response = await EventService.getEvents(
        authTokens,
        currentPage,
        searchTerm
      );
      setEvents(response.data.results);
      setTotalEvents(response.data.count);
    } catch (error) {
      console.error("Error fetching events for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar los hechos abiertos
  const loadOpenEvents = useCallback(async () => {
    try {
      const response = await EventService.getOpenEvents(
        authTokens,
        currentPage,
        searchTerm
      );
      setEvents(response.data.results);
      setTotalEvents(response.data.count);
    } catch (error) {
      console.error("Error fetching events for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar los hechos cerrados
  const loadCloseEvents = useCallback(async () => {
    try {
      const response = await EventService.getCloseEvents(
        authTokens,
        currentPage,
        searchTerm
      );
      setEvents(response.data.results);
      setTotalEvents(response.data.count);
    } catch (error) {
      console.error("Error fetching events for page: ", error);
    }
  }, [authTokens, currentPage, searchTerm]);

  //* Función para cargar los hechos según la ubicación actual
  const loadEvents = useCallback(async () => {
    if (location.pathname === Paths.OPEN_EVENTS) {
      await loadOpenEvents();
    } else if (location.pathname === Paths.CLOSE_EVENTS) {
      loadCloseEvents();
    } else {
      loadAllEvents();
    }
  }, [location.pathname, loadAllEvents, loadOpenEvents, loadCloseEvents]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar un hecho
  const handleDeleteEvent = async () => {
    try {
      const response = await EventService.deleteEvent(
        authTokens,
        selectedRow.id
      );
      if (response.status === HttpStatusCode.NoContent) {
        showSuccessToast("Hecho eliminado");
        loadEvents();
        clearSelectedRow();
      } else {
        showErrorToast("Error al eliminar hecho");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else if (status === HttpStatusCode.InternalServerError) {
          showErrorToast(
            "No se puede eliminar un hecho cerrado anteriormente."
          );
        } else {
          showErrorToast("Error al eliminar hecho");
        }
      }
    }
  };

  //* Función para cerrar un hecho
  const handleCloseEvent = async () => {
    try {
      const response = await EventService.closeEvent(
        authTokens,
        selectedRow.id,
        user.user_id,
        new Date()
      );
      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Hecho cerrado");
        loadEvents();
        clearSelectedRow();
      } else {
        showErrorToast("Error al cerrar el hecho seleccionado");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
        } else {
          showErrorToast("Error al cerrar el hecho seleccionado");
        }
      }
    }
  };

  //* Función para limpiar la fila seleccionada
  const clearSelectedRow = () => {
    setSelectedRow(null);
  };

  useEffect(() => {
    loadEvents();
  }, [location.pathname, currentPage, loadEvents]);

  return (
    <Layout pageTitle="Hechos extraordinarios">
      <div className="container-fluid">
        {/* Actions */}
        <TopBar
          searchMessage={"Buscar hecho ..."}
          watchButton={true}
          pathAll={Paths.EVENTS}
          textPathAll={"Mostrar todos"}
          pathActive={Paths.OPEN_EVENTS}
          textPathActive={"Mostrar abiertos"}
          pathInactive={Paths.CLOSE_EVENTS}
          textPathInactive={"Mostrar cerrados"}
          onAdd={() => setModalAddIsOpen(true)}
          onUpdate={() => {
            if (selectedRow) {
              setModalUpdateIsOpen(true);
            } else {
              showErrorToast("Seleccione el hecho que desea modificar");
            }
          }}
          onDelete={() => {
            if (selectedRow) {
              setModalDeleteIsOpen(true);
            } else {
              showErrorToast("Seleccione el hecho que desea eliminar");
            }
          }}
          onActivate={() => {
            if (selectedRow) {
              setModalCloseIsOpen(true);
            } else {
              showErrorToast("Seleccione el hecho que desea cerrar");
            }
          }}
          onWatch={() => {
            if (selectedRow) {
              setModalWatchIsOpen(true);
            } else {
              showErrorToast("Seleccione el hecho que desea visualizar");
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
          <GridEvents
            data={events}
            onRowSelected={(row) => setSelectedRow(row)}
          />
          <div className="card card-footer bg-body border-0">
            <Pagination
              onPageChange={handlePageChange}
              currentPage={currentPage}
              totalRows={totalEvents}
            />
          </div>
        </div>
      </div>

      {/* Modal para agregar un nuevo hecho */}
      <ModalEvents
        isOpen={modalAddIsOpen}
        onClose={() => setModalAddIsOpen(false)}
        title={"Añadir hecho extraordinario"}
        size={"modal-lg"}
        onRefresh={() => {
          loadEvents();
          clearSelectedRow();
        }}
      />

      {/* Modal para modificar un hecho */}
      <ModalEvents
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Modificar hecho"}
        size={"modal-lg"}
        onRefresh={() => {
          loadEvents();
          clearSelectedRow();
        }}
        entityData={selectedRow}
      />

      {/* Modal para visualizar un hecho */}
      <ModalEvents
        isOpen={modalWatchIsOpen}
        onClose={() => setModalWatchIsOpen(false)}
        title={"Ver entidad"}
        size={"modal-lg"}
        onRefresh={() => clearSelectedRow()}
        readOnly={true}
        entityData={selectedRow}
      />

      {/* Modal para eliminar un hecho */}
      <ModalConfirmDelete
        isOpen={modalDeleteIsOpen}
        onClose={() => {
          setModalDeleteIsOpen(false);
        }}
        onDelete={handleDeleteEvent}
        message={`Está a punto de eliminar el hecho extraordinario con fecha "${
          selectedRow && selectedRow.occurrence_date
        }" perteneciente a la entidad "${
          selectedRow && selectedRow.entity_description
        }".`}
      />

      {/* Modal para cerrar un hecho */}
      <ModalConfirmClose
        isOpen={modalCloseIsOpen}
        onClose={() => {
          setModalCloseIsOpen(false);
        }}
        onAction={handleCloseEvent}
        message={`Está a punto de cerrar el hecho extraordinario con fecha "${
          selectedRow && selectedRow.occurrence_date
        }" perteneciente a la entidad "${
          selectedRow && selectedRow.entity_description
        }".`}
      />
    </Layout>
  );
}

export default EventsPage;
