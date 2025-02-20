import React from "react";

const SmallDashboardLoader = () => (
  <div className="card" aria-hidden="true">
    <div className="card-body p-2">
      <div className="row h-100 w-100">
        <div className="placeholder-glow col-4 d-flex justify-content-center align-items-center">
          <span className="placeholder h-100 w-100 rounded-2"></span>
        </div>
        <div className="col-8 py-2 px-1">
          <h5 className="card-title placeholder-glow">
            <span className="placeholder rounded-2 col-6"></span>
          </h5>
          <p className="card-text placeholder-glow">
            <span className="placeholder rounded-2 col-11"></span>
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default SmallDashboardLoader;
