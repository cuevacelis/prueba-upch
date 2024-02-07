"use client";

import { SearchType } from "@/app/types/searchType";
import { useEffect, useState } from "react";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";

export default function Search({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: SearchType) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <Row xs={2} md={4} lg={6}>
      <Col sm="12">
        <div id="example_filter" className="dataTables_filter">
          <label>
            Buscar:
            <input
              {...props}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              type="search"
              className="form-control form-control-sm"
              placeholder="Buscar"
              aria-controls="example"
            />
          </label>
        </div>
      </Col>
    </Row>
  );
}
