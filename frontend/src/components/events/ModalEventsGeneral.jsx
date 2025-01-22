import { React, useState, useEffect } from "react";
import EntityService from "../../api/entities.api";
import TypeService from "../../api/types.api";
import ClassificationService from "../../api/classifications.api";
import FormSelect from "../FormSelect";
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
  eventData,
  readOnly,
}) {
  const [classifications, setClassifications] = useState([]);
  const [entities, setEntities] = useState([]);
  const [types, setTypes] = useState([]);
  const [scopeChoices] = useState([
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
  const loadActiveClassifications = async () => {
    try {
      const response = await ClassificationService.getClassifications(
        undefined,
        undefined,
        "True"
      );

      setClassifications(response.data);
    } catch (error) {
      console.error("Error obteniendo clasificaciones: ", error);
    }
  };

  //* Función para cargar las entidades activas que se mostrarán para seleccionar
  const loadActiveEntities = async () => {
    try {
      const response = await EntityService.getEntities(
        undefined,
        undefined,
        "True"
      );

      const transform = response.data.map((entity) => ({
        id: entity.id_entity,
        description: entity.description,
      }));

      setEntities(transform);
    } catch (error) {
      console.error("Error obteniendo entidades: ", error);
    }
  };

  //* Función para cargar los tipos de hechos activos que se mostrarán para seleccionar
  const loadActiveTypes = async () => {
    try {
      const response = await TypeService.getTypes(undefined, undefined, "True");

      setTypes(response.data);
    } catch (error) {
      console.error("Error obteniendo tipos: ", error);
    }
  };

  useEffect(() => {
    loadActiveClassifications();
    loadActiveEntities();
    loadActiveTypes();
  }, []);

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
                  disabled={readOnly}
                />
                <label htmlFor="floatingInput">Fecha de ocurrencia*</label>
              </div>
            </div>

            <div className="col-md">
              <FormSelect
                data={scopeChoices}
                name={"Alcance*"}
                message={"Seleccione un alcance"}
                onChange={(value) => console.log(value)}
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
                onChange={(value) => console.log(value)}
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
                onChange={(value) => console.log(value)}
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
                onChange={(value) => console.log(value)}
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
