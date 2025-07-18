import { useState, useEffect } from "react";
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
import { ActiveIcon, AddIcon, DeleteIcon, UpdateIcon } from "../../../ui/icons";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";

function ClassificationsPage() {
  const location = useLocation();
  const [classifications, setClassifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClassifications, setTotalClassifications] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  const isActive =
    location.pathname === Paths.ACTIVE_CLASSIFICATIONS
      ? "True"
      : location.pathname === Paths.INACTIVE_CLASSIFICATIONS
      ? "False"
      : undefined;

  //* Cargar todas las clasificaciones
  const { data, loading, refetch } = useFetchData(
    ClassificationService.getClassifications,
    [currentPage, searchTerm, isActive],
    [location.pathname, currentPage, searchTerm]
  );

  useEffect(() => {
    if (data) {
      setClassifications(data.results || []);
      setTotalClassifications(data.count || 0);
    }
  }, [data]);

  //* Función para eliminar una clasificación
  const { execute: deleteClassification, loading: deleting } = useApiMutation(
    ClassificationService.deleteClassification,
    {
      onSuccess: () => {
        showSuccessToast("Clasificación eliminada con éxito");
        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para activar/inactivar una clasificación
  const { execute: activateClassification, loading: activating } =
    useApiMutation(ClassificationService.activateClassification, {
      onSuccess: (response) => {
        const { data } = response; // Acceder al la respuesta

        if (data.is_active) {
          showSuccessToast("Clasificación activada con éxito");
        } else {
          showSuccessToast("Clasificación inactivada con éxito");
        }

        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    });

  //* Función para limpiar la fila seleccionada
  const clearSelectedRow = () => {
    setSelectedRow(null);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  return (
    <Layout pageTitle="Clasificaciones">
      <div className="container-fluid h-100">
        {/* Acciones */}
        <TopBar>
          <TopBar.Button
            label="Nueva"
            onClick={() => setModalAddIsOpen(true)}
            icon={AddIcon}
          />
          <TopBar.Button
            label="Editar"
            onClick={() => {
              if (selectedRow) {
                setModalUpdateIsOpen(true);
              } else {
                showErrorToast("Seleccione la clasificación que desea editar");
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
        <div className="card h-100 card-body table-container mt-2 py-2 px-0 border-secondary-subtle shadow-sm overflow-x-hidden justify-content-between">
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
        title={"Nueva clasificación"}
        onRefresh={() => {
          refetch();
          clearSelectedRow();
        }}
      />

      {/* Modal para modificar una clasificación */}
      <ModalClassifications
        isOpen={modalUpdateIsOpen}
        onClose={() => setModalUpdateIsOpen(false)}
        title={"Editar clasificación"}
        onRefresh={() => {
          refetch();
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
        onDelete={() => deleteClassification(selectedRow?.id)}
        message={`Está a punto de eliminar la clasificación "${selectedRow?.description}". ¿Desea continuar?`}
        loading={deleting}
      />

      {/* Modal para activar/inactivar una clasificación  */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={() =>
          activateClassification({
            id: selectedRow?.id,
            activated: selectedRow?.is_active,
          })
        }
        message={`Está a punto de ${
          selectedRow?.is_active ? "inactivar" : "activar"
        } la clasificación  "${
          selectedRow && selectedRow.description
        }". ¿Desea continuar?`}
        loading={activating}
      />
    </Layout>
  );
}

export default ClassificationsPage;
