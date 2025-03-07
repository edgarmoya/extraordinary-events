import React from "react";

const TableLoader = ({ rows = 10, columns = 4 }) => {
  return (
    <div className="mt-1">
      <table className="table table-sm table-responsive">
        <thead className="sticky-top z-1">
          <tr>
            {Array.from({ length: columns }).map((_, colIndex) => (
              <th scope="col" key={colIndex}>
                <h6 className="placeholder-glow w-100">
                  <span className="placeholder rounded-2 w-50"></span>
                </h6>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex}>
                  <p className="placeholder-glow w-100">
                    <span className="placeholder rounded-2 w-75"></span>
                  </p>
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableLoader;
