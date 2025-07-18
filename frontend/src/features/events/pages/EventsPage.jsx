import { useContext, useState, useEffect, Suspense } from "react";
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
import {
  ActiveIcon,
  AddIcon,
  DeleteIcon,
  EyeIcon,
  LetterIcon,
  UpdateIcon,
  PdfIcon,
} from "../../../ui/icons";
import useRolesInfo from "../../../hooks/useRolesInfo";
import ModalLetter from "../components/ModalLetter";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";

function EventsPage() {
  const { user } = useContext(AuthContext);
  const location = useLocation();
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
  const [modalLetterIsOpen, setModalLetterIsOpen] = useState(false);
  const rolesInfo = useRolesInfo();

  const isOpen =
    location.pathname === Paths.OPEN_EVENTS
      ? "open"
      : location.pathname === Paths.CLOSE_EVENTS
      ? "closed"
      : undefined;

  //* Cargar todos los hechos
  const { data, loading, refetch } = useFetchData(
    EventService.getEvents,
    [currentPage, searchTerm, isOpen],
    [location.pathname, currentPage, searchTerm]
  );

  useEffect(() => {
    if (data) {
      setEvents(data.results || []);
      setTotalEvents(data.count || 0);
    }
  }, [data]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para eliminar un hecho
  const { execute: deleteEvent, loading: deleting } = useApiMutation(
    EventService.deleteEvent,
    {
      onSuccess: () => {
        showSuccessToast("Hecho eliminado con éxito");
        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para cerrar un hecho
  const { execute: closeEvent, loading: closing } = useApiMutation(
    EventService.closeEvent,
    {
      onSuccess: () => {
        showSuccessToast("Hecho cerrado con éxito");
        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const handleDownload = async (id) => {
    try {
      const response = await EventService.downloadEvent(id);

      // Crear un blob y un enlace temporal
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: "application/pdf" })
      );
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `reporte_de_hecho.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error descargando el PDF:", error);
    }
  };

  //* Función para limpiar la fila seleccionada
  const clearSelectedRow = () => {
    setSelectedRow(null);
  };

  return (
    <Layout pageTitle="Hechos">
      <div className="container-fluid h-100">
        {/* Acciones */}
        <TopBar>
          <TopBar.Button
            label="Nuevo"
            onClick={() => setModalAddIsOpen(true)}
            icon={AddIcon}
            disabled={!rolesInfo.isOperador}
          />
          <TopBar.Button
            label="Editar"
            onClick={() => {
              if (selectedRow) {
                if (selectedRow.status === "closed") {
                  showErrorToast(
                    "No puede ser editado un hecho cerrado anteriormente"
                  );
                } else {
                  setModalUpdateIsOpen(true);
                }
              } else {
                showErrorToast("Seleccione el hecho que desea editar");
              }
            }}
            icon={UpdateIcon}
            disabled={
              !rolesInfo.isOperador ||
              !rolesInfo.operador.some(
                (entity) => entity.id === selectedRow?.entity
              ) ||
              selectedRow?.status === "closed"
            }
          />
          <TopBar.Button
            label="Eliminar"
            onClick={() => {
              if (selectedRow) {
                setModalDeleteIsOpen(true);
              } else {
                showErrorToast("Seleccione el hecho que desea eliminar");
              }
            }}
            icon={DeleteIcon}
            disabled={
              !rolesInfo.isOperador ||
              !rolesInfo.operador.some(
                (entity) => entity.id === selectedRow?.entity
              ) ||
              selectedRow?.status === "closed"
            }
          />
          <TopBar.Button
            label="Cerrar"
            onClick={() => {
              if (selectedRow) {
                if (selectedRow.status === "closed") {
                  showErrorToast(
                    "El hecho seleccionado ya se encuentra cerrado"
                  );
                } else {
                  setModalCloseIsOpen(true);
                }
              } else {
                showErrorToast("Seleccione el hecho que desea cerrar");
              }
            }}
            icon={ActiveIcon}
            disabled={
              !rolesInfo.isOperador ||
              !rolesInfo.operador.some(
                (entity) => entity.id === selectedRow?.entity
              ) ||
              selectedRow?.status === "closed"
            }
          />
          <TopBar.Button
            label="Ver"
            onClick={() => {
              if (selectedRow) {
                setModalWatchIsOpen(true);
              } else {
                showErrorToast("Seleccione el hecho que desea visualizar");
              }
            }}
            icon={EyeIcon}
            disabled={!selectedRow}
          />
          <TopBar.Button
            label="Reporte"
            onClick={() => {
              if (selectedRow) {
                handleDownload(selectedRow.id);
              } else {
                showErrorToast(
                  "Seleccione el hecho que desea descargar el reporte"
                );
              }
            }}
            icon={PdfIcon}
            disabled={!selectedRow}
          />
          <TopBar.Button
            label="Generar carta"
            onClick={() => {
              if (selectedRow) {
                setModalLetterIsOpen(true);
              } else {
                showErrorToast("Seleccione el hecho deseado");
              }
            }}
            icon={LetterIcon}
            disabled={!selectedRow}
          />

          <TopBar.Dropdown
            pathAll={Paths.EVENTS}
            textPathAll={"Mostrar todos"}
            pathActive={Paths.OPEN_EVENTS}
            textPathActive={"Mostrar abiertos"}
            pathInactive={Paths.CLOSE_EVENTS}
            textPathInactive={"Mostrar cerrados"}
          />
          <TopBar.Search
            searchMessage={"Buscar hecho ..."}
            onSearch={(term) => {
              clearSelectedRow();
              setSearchTerm(term);
              setCurrentPage(1);
            }}
          />
        </TopBar>

        {/* Tabla de hechos */}
        <div className="card h-100 card-body table-container my-2 py-1 px-0 border-secondary-subtle shadow-sm overflow-x-hidden justify-content-between">
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
        title={"Nuevo hecho extraordinario"}
        size={"modal-lg"}
        onRefresh={() => {
          refetch();
          clearSelectedRow();
        }}
      />

      {/* Modal para editar un hecho */}
      <ModalEvents
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Editar hecho extraordinario"}
        size={"modal-lg"}
        onRefresh={() => {
          refetch();
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
        onDelete={() => deleteEvent(selectedRow?.id)}
        message={`Está a punto de eliminar el hecho extraordinario con fecha "${
          selectedRow && selectedRow.occurrence_date
        }" perteneciente a la entidad "${
          selectedRow && selectedRow.entity_description
        }". ¿Desea continuar?`}
        loading={deleting}
      />

      {/* Modal para cerrar un hecho */}
      <ModalConfirmClose
        isOpen={modalCloseIsOpen}
        onClose={() => {
          setModalCloseIsOpen(false);
        }}
        onAction={() => closeEvent(selectedRow?.id, user.user_id, new Date())}
        message={`Está a punto de cerrar el hecho extraordinario con fecha "${
          selectedRow && selectedRow.occurrence_date
        }" perteneciente a la entidad "${
          selectedRow && selectedRow.entity_description
        }". ¿Desea continuar?`}
        loading={closing}
      />

      {/* Modal para generar carta */}
      <ModalLetter
        isOpen={modalLetterIsOpen}
        onClose={() => {
          setModalLetterIsOpen(false);
        }}
        title="Carta informativa"
        size="modal-lg"
        eventId={selectedRow?.id}
      />
    </Layout>
  );
}

export default EventsPage;
