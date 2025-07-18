import { useState, useEffect } from "react";
import Modal from "../../../ui/modals/Modal";
import { showSuccessToast, showErrorToast } from "../../../utils/toastUtils";
import { useForm } from "react-hook-form";
import EntityService from "../../../api/entities.api";
import SectorService from "../../../api/sectors.api";
import LocationService from "../../../api/locations.api";
import FormSelect from "../../../ui/FormSelect";
import useFetchData from "../../../hooks/useFetchData";
import useApiMutation from "../../../hooks/useApiMutation";
import Spinner from "../../../ui/Spinner";

function ModalEntities({
  isOpen,
  onClose,
  onRefresh,
  title,
  size,
  entityData,
  readOnly,
}) {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [disabledMun, setDisabledMun] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    setError,
  } = useForm();

  const handleCloseModal = () => {
    reset();
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
  const { data: activeSectors } = useFetchData(
    isOpen ? SectorService.getSectors : null,
    [undefined, undefined, "True"],
    []
  );

  //* Función para cargar las provincias
  const { data: provinces } = useFetchData(
    isOpen ? LocationService.getProvinces : null,
    [],
    []
  );

  //* Función para cargar los municipios
  const { data: municipalities } = useFetchData(
    isOpen ? LocationService.getMunicipalities : null,
    [selectedProvince],
    [selectedProvince]
  );

  const handleProvinceChange = (selectedValue) => {
    setSelectedProvince(selectedValue);
    handleSelectChange(selectedValue);
  };

  const { execute: createEntity, loading: creating } = useApiMutation(
    EntityService.addEntity,
    {
      onSuccess: () => {
        showSuccessToast("Entidad agregada con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const { execute: updateEntity, loading: updating } = useApiMutation(
    EntityService.updateEntity,
    {
      onSuccess: () => {
        showSuccessToast("Entidad editada con éxito");
        handleCloseModal();
        onRefresh();
      },
      onError: (message) => {
        showErrorToast(message);
      },
    }
  );

  const onSubmit = (data) => {
    Object.keys(data).forEach((key) => {
      if (data[key] === "") {
        data[key] = null;
      }
    });

    if (entityData?.id_entity) {
      // Si hay una entidad, estamos editando
      updateEntity({ id: entityData.id, ...data }, setError);
    } else {
      // Si no hay entidad, estamos creando uno nuevo
      createEntity(data, setError);
    }
  };

  useEffect(() => {
    if (entityData?.province) {
      handleSelectChange(entityData?.province);
    }
  }, [isOpen, entityData]);

  return (
    <>
      <Modal
        isOpen={isOpen}
        title={title}
        size={size}
        onClose={handleCloseModal}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="modal-body">
            <div className="row g-2">
              <div className="col-md">
                <div className="form-floating me-0 me-md-2">
                  <input
                    type="text"
                    name="id_entity"
                    className={`form-control ${
                      errors.id_entity ? "is-invalid" : ""
                    }`}
                    defaultValue={entityData?.id_entity}
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
                      errors.description ? "is-invalid" : ""
                    }`}
                    defaultValue={entityData?.description}
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
                  data={provinces?.results || []}
                  name={"Provincia*"}
                  message={"Seleccione una provincia"}
                  onChange={handleProvinceChange}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  registerName={"province"}
                  defaultValue={entityData?.province}
                  disabled={readOnly}
                />
              </div>
              <div className="col-md">
                <FormSelect
                  data={municipalities?.results || []}
                  name={"Municipio*"}
                  message={"Seleccione un municipio"}
                  onChange={() => console.log("municipio cambiado")}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  registerName={"municipality"}
                  defaultValue={entityData?.municipality}
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
                  data={activeSectors || []}
                  name={"Sector*"}
                  message={"Seleccione un sector"}
                  onChange={() => console.log("sector cambiado")}
                  errors={errors}
                  register={register}
                  setValue={setValue}
                  registerName={"sector"}
                  defaultValue={entityData?.sector}
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
                  defaultValue={entityData?.address}
                  {...register("address", { required: false })}
                  disabled={readOnly}
                />
                <label htmlFor="floatingInput">Dirección</label>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            {!readOnly && (
              <button
                type="submit"
                className="btn btn-primary text-white"
                disabled={creating || updating}
              >
                {updating || creating ? (
                  <>
                    <Spinner />
                    Guardando...
                  </>
                ) : (
                  "Aceptar"
                )}
              </button>
            )}
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCloseModal}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </>
  );
}

export default ModalEntities;
