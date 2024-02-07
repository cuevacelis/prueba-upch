import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function Pagination({ table }: any) {
  return (
    <Row>
      <Col sm="12" md="5">
        <div
          className="dataTables_info"
          id="example_info"
          role="status"
          aria-live="polite"
        >
          #Registros: 10
        </div>
      </Col>
      <Col sm="12" md="7">
        <div
          className="dataTables_paginate paging_simple_numbers"
          id="example_paginate"
        >
          <ul className="pagination">
            <li
              className="paginate_button page-item previous disabled"
              id="example_previous"
              onClick={() => table.previousPage()}
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
              className="paginate_button page-item next disabled"
              id="example_next"
              onClick={() => table.nextPage()}
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
