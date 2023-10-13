import { React, useContext, useState, useEffect, useCallback } from "react";
import Modal from "./Modal";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import AuthContext from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import EntityService from "../api/entities.api";
import SectorService from "../api/sectors.api";
import LocationService from "../api/locations.api";
import ModalEvents_General from "./ModalEvents_General";
import ModalEvents_Measure from "./ModalEvents_Measure";
import ModalEvents_Attachment from "./ModalEvents_Attachment";
import { HttpStatusCode } from "axios";

function ModalEvents({
  isOpen,
  onClose,
  onRefresh,
  title,
  size,
  entityData,
  readOnly,
}) {
  const { authTokens } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [sectors, setSectors] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [municipalities, setMunicipalities] = useState([]);
  const [disabledMun, setDisabledMun] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const handleCloseModal = () => {
    reset();
    setFormSubmitted(false);
    setDisabledMun(true);
    onClose();
  };

  const handleSelectChange = (selectedValue) => {
    if (selectedValue) {
      setDisabledMun(false);
    } else {
      setDisabledMun(true);
    }
  };

  //* Función para cargar los sectores activos que se mostrarán para seleccionar
  const loadActiveSectors = useCallback(
    async (currentPage) => {
      try {
        let allSectors = [];
        let nextPage = currentPage;
        while (true) {
          const response = await SectorService.getActiveSectors(
            authTokens,
            nextPage
          );
          const newSectors = response.data.results;
          allSectors = [...allSectors, ...newSectors];

          if (response.data.next) {
            nextPage += 1;
          } else {
            break;
          }
        }
        setSectors(allSectors);
      } catch (error) {
        console.error("Error fetching sectors: ", error);
      }
    },
    [authTokens]
  );

  //* Función para cargar las provincias
  const loadProvinces = useCallback(async () => {
    try {
      const response = await LocationService.getProvinces(authTokens);
      setProvinces(response.data.results);
    } catch (error) {
      console.error("Error fetching provinces: ", error);
    }
  }, [authTokens]);

  //* Función para cargar los municipios
  const loadMunicipalities = useCallback(async () => {
    try {
      const response = await LocationService.getMunicipalities(
        authTokens,
        selectedProvince
      );
      setMunicipalities(response.data.results);
    } catch (error) {
      console.error("Error fetching municipalities: ", error);
    }
  }, [authTokens, selectedProvince]);

  const handleProvinceChange = (selectedValue) => {
    setSelectedProvince(selectedValue);
    handleSelectChange(selectedValue);
  };

  const handleAddEntity = async (data) => {
    try {
      const response = await EntityService.addEntity(authTokens, data);
      if (response.status === HttpStatusCode.Created) {
        showSuccessToast("Entidad agregada");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al agregar, código existente");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
          handleCloseModal();
        } else if (status === HttpStatusCode.BadRequest) {
          showErrorToast("Error al agregar, código existente");
        } else {
          showErrorToast("Error al agregar entidad");
        }
      }
    }
  };

  const handleUpdateEntity = async (entityId, data) => {
    try {
      const response = await EntityService.updateEntity(
        authTokens,
        entityId,
        data
      );

      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Entidad actualizada");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al actualizar entidad");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        if (status === HttpStatusCode.Forbidden) {
          showErrorToast("No tiene permiso para realizar esta acción");
          handleCloseModal();
        } else if (status === HttpStatusCode.BadRequest) {
          showErrorToast("Error al actualizar, código existente");
        } else {
          showErrorToast("Error al actualizar entidad");
        }
      }
    }
  };

  const handleSaveEntity = async (data) => {
    setIsLoading(true);
    if (entityData && entityData.id_entity) {
      await handleUpdateEntity(entityData.id_entity, data);
    } else {
      await handleAddEntity(data);
    }
    setIsLoading(false);
  };

  const handleFormSubmit = (data) => {
    setFormSubmitted(true);
    handleSubmit(handleSaveEntity)(data);
  };

  useEffect(() => {
    loadActiveSectors(1);
    loadProvinces();
    if (entityData && entityData.province) {
      handleSelectChange(selectedProvince);
    }
    loadMunicipalities();
  }, [
    loadActiveSectors,
    loadProvinces,
    selectedProvince,
    entityData,
    loadMunicipalities,
  ]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        title={title}
        size={size}
        onClose={handleCloseModal}
      >
        <div className="modal-body">
          <div className="tabs">
            <ul className="nav nav-tabs nav-fill justify-content-center">
              <li className="nav-item">
                <button
                  class="nav-link active"
                  id="general-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#general-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="general-tab-pane"
                  aria-selected="true"
                >
                  General
                </button>
              </li>
              <li className="nav-item">
                <button
                  class="nav-link"
                  id="measure-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#measure-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="measure-tab-pane"
                  aria-selected="false"
                >
                  Medidas
                </button>
              </li>
              <li className="nav-item">
                <button
                  class="nav-link"
                  id="attachment-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#attachment-tab-pane"
                  type="button"
                  role="tab"
                  aria-controls="attachment-tab-pane"
                  aria-selected="false"
                >
                  Anexos
                </button>
              </li>
            </ul>
            <div className="tab-content" id="myTabContent">
              <div
                className="tab-pane fade show active"
                id="general-tab-pane"
                role="tabpanel"
                aria-labelledby="general-tab"
                tabIndex="0"
              >
                <ModalEvents_General />
              </div>
              <div
                className="tab-pane fade"
                id="measure-tab-pane"
                role="tabpanel"
                aria-labelledby="measure-tab"
                tabIndex="0"
              >
                <ModalEvents_Measure />
              </div>
              <div
                className="tab-pane fade"
                id="attachment-tab-pane"
                role="tabpanel"
                aria-labelledby="attachment-tab"
                tabIndex="0"
              >
                <ModalEvents_Attachment />
              </div>
            </div>
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCloseModal}
          >
            Cancelar
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={handleFormSubmit}
              className="btn btn-primary"
              disabled={isLoading}
            >
              {isLoading ? "Guardando..." : entityData ? "Modificar" : "Añadir"}
            </button>
          )}
        </div>
      </Modal>
    </div>
  );
}

export default ModalEvents;
