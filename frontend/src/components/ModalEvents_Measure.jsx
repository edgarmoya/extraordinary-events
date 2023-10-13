import React, { useState } from "react";
import CardMeasure from "./CardMeasure";
import { useForm } from "react-hook-form";

function ModalEvents_Measure() {
  const [measures, setMeasures] = useState([]);
  const [lastId, setLastId] = useState(0);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const handleSaveMeasure = (data) => {
    const newMeasure = {
      id: lastId + 1,
      description: data.measure,
    };
    setMeasures([...measures, newMeasure]);
    setLastId(lastId + 1);
    reset();
  };

  const handleFormSubmit = (data) => {
    handleSaveMeasure(data);
  };

  const handleDeleteMeasure = (id) => {
    const updatedMeasures = measures.filter((measure) => measure.id !== id);
    setMeasures(updatedMeasures);
  };

  return (
    <section>
      <div className="mt-3">
        {/* New measure */}
        <form>
          <div className="input-group">
            <input
              type="text"
              name="measure"
              placeholder="Descripción"
              className={`form-control mb-0 ${
                errors.measure ? "is-invalid" : ""
              }`}
              {...register("measure", { required: true })}
              aria-describedby="button-addon2"
              autoFocus={true}
            />
            <button
              className="input-group-text"
              type="button"
              id="button-addon2"
              onClick={handleSubmit(handleFormSubmit)}
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
                key={measure.id}
                id={measure.id}
                number={index + 1}
                description={measure.description}
                onDelete={handleDeleteMeasure}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default ModalEvents_Measure;
