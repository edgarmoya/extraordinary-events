import React from "react";

const BuildIcon = ({ size = "1.5rem", color = "currentColor", className }) => {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={color}
      height={size}
    >
      <path d="m18.5,2h-.5v-.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5,1.5v.5h-6v-.5c0-.829-.672-1.5-1.5-1.5s-1.5.671-1.5,1.5v.5h-.5C2.468,2,0,4.467,0,7.5v11c0,3.033,2.468,5.5,5.5,5.5h13c3.032,0,5.5-2.467,5.5-5.5V7.5c0-3.033-2.468-5.5-5.5-5.5Zm0,19H5.5c-1.379,0-2.5-1.122-2.5-2.5v-9.5h18v9.5c0,1.378-1.121,2.5-2.5,2.5Zm-8.5-8.5v2c0,.828-.672,1.5-1.5,1.5h-2c-.828,0-1.5-.672-1.5-1.5v-2c0-.828.672-1.5,1.5-1.5h2c.828,0,1.5.672,1.5,1.5Z" />
    </svg>
  );
};

export default BuildIcon;
