import React from "react";

const Skeleton = ({ children }) => {
  return <div className="d-flex flex-column gap-0">{children}</div>;
};

Skeleton.Text = ({
  className,
  width = "100%",
  height = "1rem",
  position = "start",
}) => (
  <div
    className={`placeholder-glow text-${position} ${className}`}
    aria-hidden="true"
  >
    <span className="placeholder rounded-2" style={{ width, height }}></span>
  </div>
);

Skeleton.Circle = ({ size = "40px", position = "start" }) => (
  <div className={`placeholder-glow text-${position}`}>
    <span
      className="placeholder rounded-circle"
      style={{ width: size, height: size }}
    ></span>
  </div>
);

Skeleton.Rectangle = ({
  className,
  width = "100%",
  height = "80px",
  position = "start",
}) => (
  <div
    className={`placeholder-glow text-${position} ${className}`}
    aria-hidden="true"
  >
    <span className="placeholder rounded-3" style={{ width, height }}></span>
  </div>
);

export default Skeleton;
