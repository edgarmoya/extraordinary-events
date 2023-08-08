import React, { useEffect, useState } from "react";

function FormSelect({
  className,
  data,
  name,
  message,
  disabled,
  onChange,
  register,
  registerName,
  errors,
  setValue,
  defaultValue,
}) {
  const [options, setOptions] = useState([]);
  const [selected, setSelected] = useState(defaultValue);

  useEffect(() => {
    setOptions(data);
    setValue(registerName, defaultValue);
  }, [data, setValue, registerName, defaultValue]);

  return (
    <div className={`form-floating ${className}`}>
      <select
        name={registerName}
        onChangeCapture={(event) => {
          onChange(event.target.value);
          setSelected(event.target.value);
        }}
        className={`form-select ${errors[registerName] ? "is-invalid" : ""}`}
        disabled={disabled}
        value={selected}
        {...register(registerName, {
          required: "Por favor, seleccione una opción",
        })}
      >
        <option value="">{message}</option>
        {options.map((element) => (
          <option key={element.id} value={element.id}>
            {element.description}
          </option>
        ))}
      </select>
      <label htmlFor="floatingSelectGrid">{name}</label>
      {errors[registerName] && (
        <div className="invalid-feedback">{errors[registerName].message}</div>
      )}
    </div>
  );
}

export default FormSelect;
