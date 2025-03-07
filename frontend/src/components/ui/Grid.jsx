import React from "react";

function Grid({ children }) {
  return (
    <section className="overflow-y-auto my-1">
      <table className="table table-sm table-hover table-responsive m-0">
        {children}
      </table>
    </section>
  );
}

function Head({ children }) {
  return (
    <thead className="sticky-top z-1">
      <tr>{children}</tr>
    </thead>
  );
}

function Header({ children, ...props }) {
  return (
    <th scope="col" {...props}>
      {children}
    </th>
  );
}

function Row({ children, ...props }) {
  return <tr {...props}>{children}</tr>;
}

function Cell({ children, ...props }) {
  return <td {...props}>{children}</td>;
}

function Body({ children }) {
  return <tbody>{children}</tbody>;
}

function Footer({ children }) {
  return <tfoot>{children}</tfoot>;
}

Grid.Head = Head;
Grid.Header = Header;
Grid.Row = Row;
Grid.Cell = Cell;
Grid.Body = Body;
Grid.Footer = Footer;
export default Grid;
