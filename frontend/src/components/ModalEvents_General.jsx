import {
  React,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { showSuccessToast, showErrorToast } from "../utils/toastUtils";
import AuthContext from "../contexts/AuthContext";
import { useForm } from "react-hook-form";
import EntityService from "../api/entities.api";
import TypeService from "../api/types.api";
import ClassificationService from "../api/classifications.api";
import LocationService from "../api/locations.api";
import FormSelect from "./FormSelect";
import { HttpStatusCode } from "axios";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { format } from "date-fns";

function ModalEvents_General({ eventData, readOnly }) {
  const { authTokens } = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [classifications, setClassifications] = useState([]);
  const [entities, setEntities] = useState([]);
  const [types, setTypes] = useState([]);
  const [occurrenceDate, setOccurrenceDate] = useState(new Date());
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

  registerLocale("es", es);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  const scope_choices = [
    {
      id: "relevant",
      description: "Relevante",
    },
    {
      id: "corruption",
      description: "Corrupción",
    },
  ];

  const handleDatePicker = (e) => {
    e.preventDefault();
    setIsOpenDatePicker(!isOpenDatePicker);
  };

  //* Función para cargar las clasificaciones activas que se mostrarán para seleccionar
  const loadActiveClassifications = useCallback(
    async (currentPage) => {
      try {
        let allClassifications = [];
        let nextPage = currentPage;
        while (true) {
          const response = await ClassificationService.getActiveClassifications(
            authTokens,
            nextPage
          );
          const newClassifications = response.data.results;
          allClassifications = [...allClassifications, ...newClassifications];

          if (response.data.next) {
            nextPage += 1;
          } else {
            break;
          }
        }
        setClassifications(allClassifications);
      } catch (error) {
        console.error("Error fetching classifications: ", error);
      }
    },
    [authTokens]
  );

  //* Función para cargar las entidades activas que se mostrarán para seleccionar
  const loadActiveEntities = useCallback(
    async (currentPage) => {
      try {
        let allEntities = [];
        let nextPage = currentPage;
        while (true) {
          const response = await EntityService.getActiveEntities(
            authTokens,
            nextPage
          );
          const newEntities = response.data.results;
          allEntities = [...allEntities, ...newEntities];

          if (response.data.next) {
            nextPage += 1;
          } else {
            break;
          }
        }
        setEntities(allEntities);
      } catch (error) {
        console.error("Error fetching entities: ", error);
      }
    },
    [authTokens]
  );

  //* Función para cargar los tipos de hechos activos que se mostrarán para seleccionar
  const loadActiveTypes = useCallback(
    async (currentPage) => {
      try {
        let allTypes = [];
        let nextPage = currentPage;
        while (true) {
          const response = await TypeService.getActiveTypes(
            authTokens,
            nextPage
          );
          const newTypes = response.data.results;
          allTypes = [...allTypes, ...newTypes];

          if (response.data.next) {
            nextPage += 1;
          } else {
            break;
          }
        }
        setTypes(allTypes);
      } catch (error) {
        console.error("Error fetching types: ", error);
      }
    },
    [authTokens]
  );

  /*const handleAddEntity = async (data) => {
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
  };*/

  /*const handleUpdateEntity = async (entityId, data) => {
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
  };*/

  /*const handleSaveEntity = async (data) => {
    setIsLoading(true);
    if (eventData && eventData.id_entity) {
      await handleUpdateEntity(eventData.id_entity, data);
    } else {
      await handleAddEntity(data);
    }
    setIsLoading(false);
  };*/

  /*const handleFormSubmit = (data) => {
    setFormSubmitted(true);
    handleSubmit(handleSaveEntity)(data);
  };*/

  useEffect(() => {
    loadActiveClassifications(1);
    loadActiveEntities(1);
    loadActiveTypes(1);
  }, [
    loadActiveClassifications,
    loadActiveEntities,
    loadActiveTypes,
    eventData,
  ]);

  return (
    <div>
      <div className="mt-3">
        <form>
          <div className="row g-2">
            <div className="col-md">
              <div className="form-floating me-0 me-md-2">
                <input
                  type="text"
                  className="form-control"
                  id="floatingInput"
                  value={format(occurrenceDate, "dd-MM-yyyy")}
                  onClick={handleDatePicker}
                />
                <label htmlFor="floatingInput">Fecha de ocurrencia*</label>
              </div>
            </div>

            <div className="col-md">
              <FormSelect
                data={scope_choices}
                name={"Alcance*"}
                message={"Seleccione un alcance"}
                onChange={() => console.log("alcance cambiado")}
                errors={errors}
                register={register}
                setValue={setValue}
                registerName={"scope"}
                defaultValue={eventData ? eventData.scope : ""}
                disabled={readOnly}
              />
            </div>

            {isOpenDatePicker && (
              <div className="date-picker-container">
                <DatePicker
                  selected={occurrenceDate}
                  onChange={(date) => {
                    setOccurrenceDate(date);
                    setIsOpenDatePicker(!isOpenDatePicker);
                  }}
                  maxDate={new Date()}
                  locale={"es"}
                  inline
                />
              </div>
            )}
          </div>

          <div className="row g-2 mt-2">
            <div className="col-md">
              <FormSelect
                className={"me-0 me-md-2"}
                data={entities}
                name={"Entidad*"}
                message={"Seleccione una entidad"}
                onChange={() => console.log("entidad cambiada")}
                errors={errors}
                register={register}
                setValue={setValue}
                registerName={"entities"}
                defaultValue={eventData ? eventData.entities : ""}
                disabled={readOnly}
              />
            </div>
            <div className="col-md">
              <FormSelect
                data={types}
                name={"Tipo de hecho*"}
                message={"Seleccione un tipo de hecho"}
                onChange={() => console.log("tipo cambiado")}
                errors={errors}
                register={register}
                setValue={setValue}
                registerName={"types"}
                defaultValue={eventData ? eventData.types : ""}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="row g-1 mt-2">
            <div className="col-md">
              <FormSelect
                data={classifications}
                name={"Clasificación*"}
                message={"Seleccione una clasificación"}
                onChange={() => console.log("clasificación cambiada")}
                errors={errors}
                register={register}
                setValue={setValue}
                registerName={"classifications"}
                defaultValue={eventData ? eventData.classifications : ""}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="row mt-2 g-1">
            <div className="form-floating z-0 me-2">
              <textarea
                type="text"
                name="synthesis"
                className="form-control"
                defaultValue={eventData ? eventData.synthesis : ""}
                {...register("synthesis", { required: false })}
                disabled={readOnly}
              />
              <label htmlFor="floatingInput">Síntesis*</label>
            </div>
          </div>

          <div className="row mt-2 g-1">
            <div className="form-floating z-0 me-2">
              <textarea
                type="text"
                name="cause"
                className="form-control"
                defaultValue={eventData ? eventData.cause : ""}
                {...register("cause", { required: false })}
                disabled={readOnly}
              />
              <label htmlFor="floatingInput">Causa</label>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ModalEvents_General;
