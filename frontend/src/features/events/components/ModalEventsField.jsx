import React, { useState, useCallback, useEffect } from "react";
import CardField from "../../additional_fields/components/CardField";
import { useForm } from "react-hook-form";
import FormSelect from "../../../ui/FormSelect";
import FieldService from "../../../api/fields.api";

function ModalEventsField({
  fieldValues,
  setFieldValues,
  eventData,
  readOnly,
}) {
  const [fields, setFields] = useState([]);
  const [availableFields, setAvailableFields] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [selectedField, setSelectedField] = useState(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();

  /* Función para cargar los campos adicionales */
  const loadFields = useCallback(async () => {
    try {
      const response = await FieldService.getFields(
        undefined,
        undefined,
        "True"
      );
      setFields(response.data);
    } catch (error) {
      console.error("Error obteniendo los campos: ", error);
    }
  }, []);

  const handleSaveFieldValues = (data) => {
    const newFieldValue = {
      id: lastId + 1,
      add_field_description: selectedField.description, // Agregar la descripción del campo
      ...data,
    };
    setFieldValues([...fieldValues, newFieldValue]);
    setLastId(lastId + 1);
    reset();
  };

  //* Función para cargar los valores de los campos
  const loadValues = useCallback(async () => {
    try {
      const response = await FieldService.getFieldValues(eventData?.id);
      setFieldValues(response.data);
    } catch (error) {
      console.error("Error obteniendo valores: ", error);
    }
  }, [eventData, setFieldValues]);

  const handleDeleteFieldValue = (id) => {
    const updatedValues = fieldValues.filter(
      (fieldValue) => fieldValue.id !== id
    );
    setFieldValues(updatedValues);
  };

  useEffect(() => {
    if (eventData?.id) {
      loadValues();
    }
  }, [eventData, loadValues]);

  useEffect(() => {
    loadFields();
  }, [loadFields]);

  useEffect(() => {
    //* Función para filtrar campos ya seleccionados
    const available = fields.filter(
      (field) =>
        !fieldValues.some((fv) => String(fv.add_field) === String(field.id))
    );
    setAvailableFields(available);
  }, [fields, fieldValues]);

  return (
    <section>
      <form className="mt-3 d-flex gap-2 align-items-start">
        <FormSelect
          className={"col-4"}
          data={availableFields}
          name={"Campo adicional*"}
          message={"Seleccione un campo"}
          onChange={(selectedId) => {
            const s = fields.find((f) => f.id === parseInt(selectedId));
            setSelectedField(s);
          }}
          errors={errors}
          register={register}
          setValue={setValue}
          registerName={"add_field"}
          floatingForm={false}
          disabled={readOnly}
        />
        <div className="input-group col">
          <input
            type={`${selectedField ? selectedField.field_type : "text"}`}
            name="value"
            placeholder="Valor"
            className={`form-control mb-0 ${errors.value ? "is-invalid" : ""}`}
            {...register("value", { required: true })}
            autoFocus={true}
            disabled={readOnly}
          />
          <button
            className="input-group-text"
            type="button"
            onClick={handleSubmit(handleSaveFieldValues)}
            disabled={readOnly}
          >
            Agregar
          </button>
          {errors.value && (
            <div className="invalid-feedback">
              Por favor, ingrese el valor del campo adicional
            </div>
          )}
        </div>
      </form>

      <div className="overflow-y-auto mt-1" style={{ height: 300 }}>
        {fieldValues.length === 0 ? (
          <div className="d-flex h-75 justify-content-center align-items-center mt-3">
            <p>No se han registrado campos adicionales para este hecho</p>
          </div>
        ) : (
          fieldValues.map((fieldValue, index) => (
            <CardField
              key={index}
              id={fieldValue.id}
              field={fieldValue.add_field_description}
              value={fieldValue.value}
              onDelete={handleDeleteFieldValue}
              readOnly={readOnly}
            />
          ))
        )}
      </div>
    </section>
  );
}

export default ModalEventsField;
