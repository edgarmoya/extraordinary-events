import React, {
  useContext,
  useState,
  useEffect,
  useCallback,
  Suspense,
} from "react";
import { useLocation } from "react-router-dom";
import TableLoader from "../../../ui/skeletons/TableLoader";
import AuthContext from "../../../contexts/AuthContext";
import Layout from "../../../layout/Layout";
import Paths from "../../../routes/Paths";
import EventService from "../../../api/event.api";
import ModalConfirmDelete from "../../../ui/modals/ModalConfirmDelete";
import ModalConfirmClose from "../../../ui/modals/ModalConfirmClose";
import GridEvents from "../components/GridEvents";
import TopBar from "../../../layout/TopBar";
import ModalEvents from "../components/ModalEvents";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { HttpStatusCode } from "axios";

function EventsPage() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [loading, setLoading] = useState(true); // Estado para el loader
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalCloseIsOpen, setModalCloseIsOpen] = useState(false);
  const [modalWatchIsOpen, setModalWatchIsOpen] = useState(false);

  //* Función para cargar los hechos según la ubicación actual
  const loadEvents = useCallback(async () => {
    setLoading(true); // Activa el loader
    try {
      let response;
      if (location.pathname === Paths.OPEN_EVENTS) {
        response = await EventService.getEvents(
          currentPage,
          searchTerm,
          "open"
        );
      } else if (location.pathname === Paths.CLOSE_EVENTS) {
        response = await EventService.getEvents(
          currentPage,
          searchTerm,
          "closed"
        );
      } else {
        response = await EventService.getEvents(currentPage, searchTerm);
      }

      setEvents(response.data.results);
      setTotalEvents(response.data.count);
    } catch (error) {
      console.error("Error obteniendo los hechos: ", error);
    } finally {
      setLoading(false); // Desactiva el loader
    }
  }, [location.pathname, currentPage, searchTerm]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar un hecho
  const handleDeleteEvent = async () => {
    try {
      const response = await EventService.deleteEvent(selectedRow.id);
      if (response.status === HttpStatusCode.NoContent) {
        showSuccessToast("Hecho eliminado con éxito");
        loadEvents();
        clearSelectedRow();
      } else {
        showErrorToast("Error al eliminar hecho");
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

  //* Función para cerrar un hecho
  const handleCloseEvent = async () => {
    try {
      const response = await EventService.closeEvent(
        selectedRow.id,
        user.user_id,
        new Date()
      );
      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Hecho cerrado con éxito");
        loadEvents();
        clearSelectedRow();
      } else {
        showErrorToast("Error al cerrar el hecho seleccionado");
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
    loadEvents();
  }, [loadEvents]);

  return (
    <Layout pageTitle="Hechos extraordinarios">
      <div className="container-fluid">
        {/* Actions */}
        <TopBar
          searchMessage={"Buscar hecho ..."}
          closeBtn={true}
          watchButton={true}
          searchInput={true}
          pathAll={Paths.EVENTS}
          textPathAll={"Mostrar todos"}
          pathActive={Paths.OPEN_EVENTS}
          textPathActive={"Mostrar abiertos"}
          pathInactive={Paths.CLOSE_EVENTS}
          textPathInactive={"Mostrar cerrados"}
          onAdd={() => setModalAddIsOpen(true)}
          onUpdate={() => {
            if (selectedRow) {
              if (selectedRow.status === "closed") {
                showErrorToast(
                  "No puede ser modificado un hecho cerrado anteriormente"
                );
              } else {
                setModalUpdateIsOpen(true);
              }
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
              if (selectedRow.status === "closed") {
                showErrorToast("El hecho seleccionado ya se encuentra cerrado");
              } else {
                setModalCloseIsOpen(true);
              }
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
          {/* Renderizar el loader o el GridEvents */}
          <Suspense fallback={<TableLoader />}>
            {loading ? (
              <TableLoader columns={7} />
            ) : (
              <GridEvents
                data={events}
                onRowSelected={(row) => setSelectedRow(row)}
                onAdd={() => setModalAddIsOpen(true)}
                onPageChange={handlePageChange}
                currentPage={currentPage}
                totalRows={totalEvents}
              />
            )}
          </Suspense>
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
        title={"Modificar hecho extraordinario"}
        size={"modal-lg"}
        onRefresh={() => {
          loadEvents();
          clearSelectedRow();
        }}
        eventData={selectedRow}
      />

      {/* Modal para visualizar un hecho */}
      <ModalEvents
        isOpen={modalWatchIsOpen}
        onClose={() => setModalWatchIsOpen(false)}
        title={"Ver hecho extraordinario"}
        size={"modal-lg"}
        onRefresh={() => clearSelectedRow()}
        readOnly={true}
        eventData={selectedRow}
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
