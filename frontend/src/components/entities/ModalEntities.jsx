import { React, useState, useEffect, useCallback } from "react";
import Modal from "../Modal";
import { showSuccessToast, showErrorToast } from "../../utils/toastUtils";
import { useForm } from "react-hook-form";
import EntityService from "../../api/entities.api";
import SectorService from "../../api/sectors.api";
import LocationService from "../../api/locations.api";
import FormSelect from "../FormSelect";
import { HttpStatusCode } from "axios";

function ModalEntities({
  isOpen,
  onClose,
  onRefresh,
  title,
  size,
  entityData,
  readOnly,
}) {
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
  const loadActiveSectors = useCallback(async () => {
    try {
      const response = await SectorService.getSectors(
        undefined,
        undefined,
        "True"
      );

      setSectors(response.data);
    } catch (error) {
      console.error("Error obteniendo sectores: ", error);
    }
  }, []);

  //* Función para cargar las provincias
  const loadProvinces = useCallback(async () => {
    try {
      const response = await LocationService.getProvinces();
      setProvinces(response.data.results);
    } catch (error) {
      console.error("Error obteniendo provincias: ", error);
    }
  }, []);

  //* Función para cargar los municipios
  const loadMunicipalities = useCallback(async () => {
    try {
      const response = await LocationService.getMunicipalities(
        selectedProvince
      );
      setMunicipalities(response.data.results);
    } catch (error) {
      console.error("Error obteniendo los municipios: ", error);
    }
  }, [selectedProvince]);

  const handleProvinceChange = (selectedValue) => {
    setSelectedProvince(selectedValue);
    handleSelectChange(selectedValue);
  };

  const handleAddEntity = async (data) => {
    try {
      const response = await EntityService.addEntity(data);
      if (response.status === HttpStatusCode.Created) {
        showSuccessToast("Entidad agregada con éxito");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al agregar, código existente");
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

  const handleUpdateEntity = async (entityId, data) => {
    try {
      const response = await EntityService.updateEntity(entityId, data);

      if (response.status === HttpStatusCode.Ok) {
        showSuccessToast("Entidad actualizada con éxito");
        onRefresh();
        handleCloseModal();
      } else {
        showErrorToast("Error al actualizar entidad");
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

  const handleSaveEntity = async (data) => {
    setIsLoading(true);
    if (entityData?.id_entity) {
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
    if (entityData?.province) {
      handleSelectChange(entityData?.province);
    }
  }, [isOpen, entityData]);

  useEffect(() => {
    if (selectedProvince) {
      loadMunicipalities();
    }
  }, [selectedProvince, loadMunicipalities]);

  useEffect(() => {
    if (isOpen) {
      loadActiveSectors();
    }
  }, [isOpen, loadActiveSectors]);

  useEffect(() => {
    if (isOpen) {
      loadProvinces();
    }
  }, [isOpen, loadProvinces]);

  return (
    <div>
      <Modal
        isOpen={isOpen}
        title={title}
        size={size}
        onClose={handleCloseModal}
      >
        <div className="modal-body">
          <form>
            <div className="row g-2">
              <div className="col-md">
                <div className="form-floating me-0 me-md-2">
                  <input
                    type="text"
                    name="id_entity"
                    className={`form-control ${
                      formSubmitted && errors.id_entity ? "is-invalid" : ""
                    }`}
                    defaultValue={entityData ? entityData.id_entity : ""}
                    {...register("id_entity", {
                      required: "Por favor, ingrese el código de la entidad",
                      pattern: {
                        value: /^[0-9]{1,6}$/, // Expresión regular para validar 6 dígitos numéricos
                        message:
                          "El código debe ser numérico y contener hasta 6 dígitos",
                      },
                    })}
                    disabled={readOnly}
                    autoFocus={true}
                    maxLength={6}
                  />
                  <label htmlFor="floatingInput">Código*</label>
                  {errors.id_entity && (
                    <div className="invalid-feedback">
                      {errors.id_entity.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md">
                <div className="form-floating">
                  <input
                    type="text"
                    name="description"
                    className={`form-control ${
                      formSubmitted && errors.description ? "is-invalid" : ""
                    }`}
                    defaultValue={entityData ? entityData.description : ""}
                    {...register("description", { required: true })}
                    disabled={readOnly}
                  ></input>
                  <label htmlFor="floatingInput">Descripción*</label>
                  {errors.description && (
                    <div className="invalid-feedback">
                      Por favor, ingrese la descripción de la entidad
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="row g-2 mt-2">
              <div className="col-md">
                <FormSelect
                  className={"me-0 me-md-2"}
                  data={provinces}
                  name={"Provincia*"}
                  message={"Seleccione una provincia"}
                  onChange={handleProvinceChange}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  registerName={"province"}
                  defaultValue={entityData ? entityData.province : ""}
                  disabled={readOnly}
                />
              </div>
              <div className="col-md">
                <FormSelect
                  data={municipalities}
                  name={"Municipio*"}
                  message={"Seleccione un municipio"}
                  onChange={() => console.log("municipio cambiado")}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  registerName={"municipality"}
                  defaultValue={entityData ? entityData.municipality : ""}
                  disabled={disabledMun || readOnly}
                />
              </div>
            </div>

            <div className="row g-2 mt-2">
              <div className="col-md">
                <div className="form-floating me-0 me-md-2">
                  <input
                    type="email"
                    name="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    defaultValue={entityData ? entityData.email : ""}
                    {...register("email", {
                      required: false,
                      pattern: {
                        value:
                          /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/i,
                        message:
                          "Por favor, ingrese un correo electrónico válido",
                      },
                    })}
                    disabled={readOnly}
                  />
                  <label htmlFor="floatingInput">Correo electrónico</label>
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>
              </div>
              <div className="col-md">
                <FormSelect
                  data={sectors}
                  name={"Sector*"}
                  message={"Seleccione un sector"}
                  onChange={() => console.log("sector cambiado")}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  registerName={"sector"}
                  defaultValue={entityData ? entityData.sector : ""}
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="row mt-2 g-1">
              <div className="form-floating me-2">
                <textarea
                  type="text"
                  name="address"
                  className="form-control"
                  defaultValue={entityData ? entityData.address : ""}
                  {...register("address", { required: false })}
                  disabled={readOnly}
                />
                <label htmlFor="floatingInput">Dirección</label>
              </div>
            </div>
          </form>
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

export default ModalEntities;
