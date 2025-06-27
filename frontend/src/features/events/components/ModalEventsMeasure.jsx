import { useState, useCallback, useEffect } from "react";
import CardMeasure from "./CardMeasure";
import EventService from "../../../api/event.api";
import { useForm } from "react-hook-form";

function ModalEventsMeasure({ measures, setMeasures, eventData, readOnly }) {
  const [lastId, setLastId] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleSaveMeasure = (data) => {
    const newMeasure = {
      id: null,
      tempId: lastId + 1,
      description: data.measure,
    };
    setMeasures([...measures, newMeasure]);
    setLastId(lastId + 1);
    reset();
  };

  //* Función para cargar las medidas
  const loadMeasures = useCallback(async () => {
    try {
      const response = await EventService.getMeasures(eventData?.id);

      const enrichedMeasures = response?.data?.map((measure, index) => ({
        ...measure,
        tempId: index + 1,
      }));

      setLastId((prevId) => prevId + response?.data?.length);
      setMeasures(enrichedMeasures);
    } catch (error) {
      console.error("Error obteniendo medidas: ", error);
    }
  }, [eventData, setMeasures]);

  const handleFormSubmit = (data) => {
    handleSaveMeasure(data);
  };

  const handleDeleteMeasure = (tempId) => {
    const updatedMeasures = measures.filter(
      (measure) => measure.tempId !== tempId
    );
    setMeasures(updatedMeasures);
  };

  useEffect(() => {
    if (eventData?.id) {
      loadMeasures();
    }
  }, [eventData, loadMeasures]);

  return (
    <section>
      {/* New measure */}
      <form className="mt-3">
        <div className="input-group">
          <input
            type="text"
            name="measure"
            placeholder="Descripción"
            className={`form-control mb-0 ${
              errors.measure ? "is-invalid" : ""
            }`}
            {...register("measure", { required: true })}
            autoFocus={true}
            disabled={readOnly}
          />
          <button
            className="input-group-text"
            type="button"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={readOnly}
          >
            Agregar
          </button>
        </div>
      </form>

      {/* Measures */}
      <div className="overflow-y-auto mt-1" style={{ height: 300 }}>
        {measures.length === 0 ? (
          <div className="d-flex h-75 justify-content-center align-items-center mt-3">
            <p>No se han registrado medidas para este hecho</p>
          </div>
        ) : (
          measures.map((measure, index) => (
            <CardMeasure
              key={index}
              id={measure.tempId}
              number={index + 1}
              description={measure.description}
              onDelete={handleDeleteMeasure}
              readOnly={readOnly}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ModalEventsMeasure;
