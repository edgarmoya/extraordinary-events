import Tooltip from "./Tooltip";

const ActionButton = ({ tooltipText, onClick, svgPath, show = true }) => {
  if (!show) return null; // Si no debe mostrarse, retorna null.

  return (
    <Tooltip tooltipText={tooltipText} childClassName="p-0">
      <button
        type="button"
        onClick={onClick}
        className="btn-accion shadow-sm w-100"
      >
        {svgPath}
      </button>
    </Tooltip>
  );
};

export default ActionButton;
