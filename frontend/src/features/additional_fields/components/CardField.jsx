import React from "react";

function CardField({ id, field, value, onDelete, readOnly }) {
  return (
    <article>
      <div className="card card-measure mt-2">
        <div className="row g-0">
          <div className="col-11 d-flex justify-content-start">
            {/* Key */}
            <div className="d-flex align-items-center p-2">
              <span className="fw-bold">{field}</span>
            </div>
            {/* Vertical Separator */}
            <span className="vr mx-1 text-body"></span>
            {/* Value */}
            <div className="d-flex align-items-center p-1">
              <span>{value}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="col-1 d-flex justify-content-end align-items-center pe-1">
            <button
              name="deleteBtn"
              type="button"
              onClick={() => onDelete(id)}
              className={`btn btn-close p-2 ${readOnly ? "disabled" : ""}`}
            ></button>
          </div>
        </div>
      </div>
    </article>
  );
}

export default CardField;
