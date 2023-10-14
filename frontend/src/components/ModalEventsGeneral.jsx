import { React, useContext, useState, useEffect, useCallback } from "react";
import AuthContext from "../contexts/AuthContext";
import EntityService from "../api/entities.api";
import TypeService from "../api/types.api";
import ClassificationService from "../api/classifications.api";
import FormSelect from "./FormSelect";
import "react-datepicker/dist/react-datepicker.css";
import DatePicker from "react-datepicker";
import { registerLocale } from "react-datepicker";
import es from "date-fns/locale/es";
import { format } from "date-fns";

function ModalEventsGeneral({
  register,
  errors,
  setValue,
  occurrenceDate,
  setOccurrenceDate,
  scope,
  setScope,
  entity,
  setEntity,
  type,
  setType,
  classification,
  setClassification,
  synthesis,
  setSynthesis,
  cause,
  setCause,
  eventData,
  readOnly,
}) {
  const { authTokens } = useContext(AuthContext);
  const [classifications, setClassifications] = useState([]);
  const [entities, setEntities] = useState([]);
  const [types, setTypes] = useState([]);
  const [scopeChoices, setScopeChoices] = useState([
    {
      id: "relevant",
      description: "Relevante",
    },
    {
      id: "corruption",
      description: "Corrupción",
    },
  ]);
  const [isOpenDatePicker, setIsOpenDatePicker] = useState(false);

  registerLocale("es", es);

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
          const newEntities = response.data.results.map((entity) => ({
            id: entity.id_entity,
            description: entity.description,
          }));
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

  useEffect(() => {
    loadActiveClassifications(1);
    loadActiveEntities(1);
    loadActiveTypes(1);
  }, [loadActiveClassifications, loadActiveEntities, loadActiveTypes]);

  return (
    <div>
      <div className="mt-3">
        <form>
          <div className="row g-2">
            <div className="col-md">
              <div className="form-floating me-0 me-md-2">
                <input
                  type="text"
                  name="occurrence_date"
                  className="form-control"
                  {...register("occurrence_date", { required: true })}
                  id="floatingInput"
                  value={format(occurrenceDate, "yyyy-MM-dd")}
                  onClick={handleDatePicker}
                />
                <label htmlFor="floatingInput">Fecha de ocurrencia*</label>
              </div>
            </div>

            <div className="col-md">
              <FormSelect
                data={scopeChoices}
                name={"Alcance*"}
                message={"Seleccione un alcance"}
                onChange={(value) => setScope(value)}
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
                onChange={(value) => setEntity(value)}
                errors={errors}
                register={register}
                setValue={setValue}
                registerName={"entity"}
                defaultValue={eventData ? eventData.entity : ""}
                disabled={readOnly}
              />
            </div>
            <div className="col-md">
              <FormSelect
                data={types}
                name={"Tipo de hecho*"}
                message={"Seleccione un tipo de hecho"}
                onChange={(value) => setType(value)}
                errors={errors}
                register={register}
                setValue={setValue}
                registerName={"event_type"}
                defaultValue={eventData ? eventData.event_type : ""}
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
                onChange={(value) => setClassification(value)}
                errors={errors}
                register={register}
                setValue={setValue}
                registerName={"classification"}
                defaultValue={eventData ? eventData.classification : ""}
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="row mt-2 g-1">
            <div className="form-floating z-0 me-2">
              <textarea
                type="text"
                name="synthesis"
                className={`form-control ${
                  errors.synthesis ? "is-invalid" : ""
                }`}
                defaultValue={eventData ? eventData.synthesis : ""}
                {...register("synthesis", { required: true })}
                onChange={(e) => setSynthesis(e.target.value)}
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
                className={`form-control ${errors.cause ? "is-invalid" : ""}`}
                defaultValue={eventData ? eventData.cause : ""}
                {...register("cause", { required: false })}
                onChange={(e) => setCause(e.target.value)}
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

export default ModalEventsGeneral;
