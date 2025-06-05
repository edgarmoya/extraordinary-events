import React, { useState, useEffect } from "react";
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
import TableLoader from "../../../ui/skeletons/TableLoader";
import { AddIcon, UpdateIcon, DeleteIcon, ActiveIcon } from "../../../ui/icons";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";

function FieldsPage() {
  const location = useLocation();
  const [fields, setFields] = useState([]);
  const [searchTerm, setSearchTerm] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalFields, setTotalFields] = useState(1);
  const [modalAddIsOpen, setModalAddIsOpen] = useState(false);
  const [modalUpdateIsOpen, setModalUpdateIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const [modalActivateIsOpen, setModalActivateIsOpen] = useState(false);

  const isActive =
    location.pathname === Paths.ACTIVE_ADDFIELDS
      ? "True"
      : location.pathname === Paths.INACTIVE_ADDFIELDS
      ? "False"
      : undefined;

  //* Cargar todos los campos
  const { data, loading, refetch } = useFetchData(
    FieldService.getFields,
    [currentPage, searchTerm, isActive],
    [location.pathname, currentPage, searchTerm]
  );

  useEffect(() => {
    if (data) {
      setFields(data.results || []);
      setTotalFields(data.count || 0);
    }
  }, [data]);

  //* Función para eliminar un campo adicional
  const { execute: deleteField, loading: deleting } = useApiMutation(
    FieldService.deleteField,
    {
      onSuccess: () => {
        showSuccessToast("Campo adicional eliminado con éxito");
        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  //* Función para activar/inactivar un campo adicional
  const { execute: activateField, loading: activating } = useApiMutation(
    FieldService.activateField,
    {
      onSuccess: (response) => {
        const { data } = response; // Acceder al la respuesta

        if (data.is_active) {
          showSuccessToast("Campo adicional activado con éxito");
        } else {
          showSuccessToast("Campo adicional inactivado con éxito");
        }

        refetch();
        clearSelectedRow();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    clearSelectedRow();
  };

  //* Función para limpiar la fila seleccionada
  const clearSelectedRow = () => {
    setSelectedRow(null);
  };

  return (
    <Layout pageTitle="Campos adicionales">
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
                showErrorToast("Seleccione el campo que desea modificar");
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
                showErrorToast("Seleccione el campo que desea eliminar");
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
                  "Seleccione el campo que desea activar o inactivar"
                );
              }
            }}
            icon={ActiveIcon}
          />
          <TopBar.Dropdown
            pathAll={Paths.ADDFIELDS}
            pathActive={Paths.ACTIVE_ADDFIELDS}
            pathInactive={Paths.INACTIVE_ADDFIELDS}
          />
          <TopBar.Search
            searchMessage={"Buscar campos ..."}
            onSearch={(term) => {
              clearSelectedRow();
              setSearchTerm(term);
              setCurrentPage(1);
            }}
          />
        </TopBar>

        {/* Tabla de los campos adicionales */}
        <div className="card h-100 card-body table-container mt-2 py-2 px-0 border-secondary-subtle shadow-sm overflow-x-hidden justify-content-between">
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
          refetch();
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
          refetch();
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
        onDelete={() => deleteField(selectedRow?.id)}
        message={`Está a punto de eliminar el campo adicional "${selectedRow?.description}".`}
        loading={deleting}
      />

      {/* Modal para activar/inactivar un campo */}
      <ModalConfirmActivate
        isOpen={modalActivateIsOpen}
        onClose={() => {
          setModalActivateIsOpen(false);
        }}
        onActivate={() =>
          activateField({
            id: selectedRow?.id,
            activated: selectedRow?.is_active,
          })
        }
        message={`Está a punto de ${
          selectedRow?.is_active ? "inactivar" : "activar"
        } el campo adicional "${selectedRow?.description}".`}
        activated={selectedRow && selectedRow.is_active}
        loading={activating}
      />
    </Layout>
  );
}

export default FieldsPage;
