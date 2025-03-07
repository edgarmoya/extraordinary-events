import React from "react";

const LargeDashboardLoader = () => (
  <div className="card h-100" aria-hidden="true">
    <div className="card-body p-3 d-flex flex-column justify-content-center align-items-center h-100">
      <h5 className="card-title placeholder-glow w-100 mb-3 text-center">
        <span className="placeholder rounded-2 col-6"></span>
      </h5>
      <div
        className="placeholder-glow w-100 d-flex justify-content-center align-items-center"
        style={{ height: "300px" }}
      >
        <span className="placeholder h-100 w-100 rounded-2"></span>
      </div>
    </div>
  </div>
);

export default LargeDashboardLoader;
