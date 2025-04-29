import React from "react";

function CardMeasure({ id, number, description, onDelete, readOnly }) {
  return (
    <article>
      <div className="card card-measure mt-2">
        <div className="row g-0">
          {/* Measure */}
          <div className="col-11 d-flex justify-content-start">
            {/* Number */}
            <div className="d-flex align-items-center p-2">
              <span>{number}.</span>
            </div>
            {/* Vertical Separator */}
            <span className="vr mx-1 text-body"></span>
            {/* Description */}
            <div className="d-flex align-items-center p-1">
              <span>{description}</span>
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

export default CardMeasure;
