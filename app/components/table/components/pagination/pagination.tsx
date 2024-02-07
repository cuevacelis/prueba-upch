import { Person } from "@/app/types/personType";
import { Table } from "@tanstack/react-table";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function Pagination({ table }: { table: Table<Person> }) {
  return (
    <Row>
      <Col sm="12" md="5">
        <div
          className="dataTables_info"
          id="example_info"
          role="status"
          aria-live="polite"
        >
          #Registros: {table.getRowModel().rows.length}
        </div>
      </Col>
      <Col sm="12" md="7">
        <div
          className="dataTables_paginate paging_simple_numbers"
          id="example_paginate"
        >
          <ul className="pagination">
            <li
              role={table.getCanPreviousPage() ? "button" : "dialog"}
              className="paginate_button page-item previous disabled"
              id="example_previous"
              onClick={() => {
                table.getCanPreviousPage() &&
                  (table.previousPage(), table.resetRowSelection());
              }}
            >
              <a
                aria-controls="example"
                aria-disabled="true"
                role="link"
                data-dt-idx="previous"
                tabIndex={-1}
                className="page-link"
              >
                Anterior
              </a>
            </li>
            <li className="paginate_button page-item active">
              <a
                aria-controls="example"
                role="link"
                aria-current="page"
                data-dt-idx="0"
                tabIndex={0}
                className="page-link"
              >
                {table.getState().pagination.pageIndex + 1}
              </a>
            </li>
            <li
              role="button"
              className="paginate_button page-item next disabled"
              id="example_next"
              onClick={() => {
                table.nextPage();
                table.resetRowSelection();
              }}
            >
              <a
                aria-controls="example"
                aria-disabled="true"
                role="link"
                data-dt-idx="next"
                tabIndex={-1}
                className="page-link"
              >
                Siguiente
              </a>
            </li>
          </ul>
        </div>
      </Col>
    </Row>
  );
}
