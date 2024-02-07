"use client";
import {
  ColumnDef,
  PaginationState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import Dashboard from "./components/dashboard/dashboard";
import Pagination from "./components/pagination/pagination";
import Search from "./components/search/search";

type Person = {
  gender: string;
  name: Name;
  location: Location;
  email: string;
  login: Login;
  dob: Dob;
  registered: Registered;
  phone: string;
  cell: string;
  id: Id;
  picture: Picture;
  nat: string;
};

export interface Name {
  title: string;
  first: string;
  last: string;
}

export interface Location {
  street: Street;
  city: string;
  state: string;
  country: string;
  postcode: number;
  coordinates: Coordinates;
  timezone: Timezone;
}

export interface Street {
  number: number;
  name: string;
}

export interface Coordinates {
  latitude: string;
  longitude: string;
}

export interface Timezone {
  offset: string;
  description: string;
}

export interface Login {
  uuid: string;
  username: string;
  password: string;
  salt: string;
  md5: string;
  sha1: string;
  sha256: string;
}

export interface Dob {
  date: string;
  age: number;
}

export interface Registered {
  date: string;
  age: number;
}

export interface Id {
  name: string;
  value: string;
}

export interface Picture {
  large: string;
  medium: string;
  thumbnail: string;
}

const LIST_INPUT_GENDER = ["FEMALE", "MALE"];

const LIST_INPUT_COUNTRY = ["US", "AU", "BR", "CH"];

export default function TableComponent() {
  const [dataFetch, setDataFetch] = useState<any>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [filterGender, setFilterGender] = useState("");
  const [filterCountry, setFilterCountry] = useState("");
  const [showResultFilterGender, setShowResultFilterGender] =
    useState(LIST_INPUT_GENDER);
  const [showResultFilterCountry, setShowResultFilterCountry] =
    useState(LIST_INPUT_COUNTRY);
  const [selectPrevGender, setSelectPrevGender] = useState("FEMALE");
  const [selectPrevCountry, setSelectPrevCountry] = useState("US");
  const [selectGender, setSelectGender] = useState("FEMALE");
  const [selectCountry, setSelectCountry] = useState("US");
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize]
  );

  const getFetching = async ({
    gender = selectGender,
    country = selectCountry,
    page = pagination.pageIndex,
  }: any) => {
    try {
      const responseDataFetch = await fetch(
        `https://randomuser.me/api?results=10&gender=${gender.toLowerCase()}&nat=${country}&page=${page}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!responseDataFetch.ok) {
        throw "Respuesta de red OK pero respuesta HTTP no OK";
      }
      const dataJson = await responseDataFetch.json();
      // console.log(dataJson);
      setDataFetch(dataJson);
    } catch (error) {
      console.error(error);
    }
  };

  // useEffect(function getFirstFetching() {
  //   getFetching({ page: 1 });
  // }, []);

  useEffect(
    function handlePagination() {
      getFetching({ page: pagination.pageIndex });
      setGlobalFilter("");
    },
    [pagination]
  );

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: "select",
        accessorKey: "",
        // header: () => <i className="bi bi-check-lg"></i>,
        header: ({ table }) => (
          <input
            className="form-check-input"
            type="checkbox"
            {...{
              checked: table.getIsAllRowsSelected(),
              // indeterminate: table.getIsSomeRowsSelected(),
              onChange: table.getToggleAllRowsSelectedHandler(),
            }}
          />
        ),
        cell: ({ row }) => (
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            {...{
              checked: row.getIsSelected(),
              disabled: !row.getCanSelect(),
              // indeterminate: row.getIsSomeSelected(),
              onChange: row.getToggleSelectedHandler(),
            }}
          />
        ),
        footer: (props) => props.column.id,
      },
      {
        id: "name",
        accessorFn: (row) => `${row.name.first} ${row.name.last}`,
        header: "Nombre",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        id: "gender",
        accessorKey: "gender",
        header: "Genero",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Correo electrónico",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        id: "phone",
        accessorKey: "phone",
        header: "Celular",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
      {
        id: "nacionality",
        accessorKey: "nat",
        header: "Nacionalidad",
        cell: (info) => info.getValue(),
        footer: (props) => props.column.id,
      },
    ],
    []
  );

  const table = useReactTable({
    data: dataFetch?.results ?? [],
    columns,
    pageCount: -1,
    autoResetPageIndex: false,
    state: {
      globalFilter,
      rowSelection,
      sorting,
      pagination,
    },
    enableRowSelection: true,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    debugTable: false,
  });

  return (
    <Container className="pt-5">
      <Row>
        <Dashboard
          {...{
            table,
            setGlobalFilter,
            getFetching,
            filterGender,
            setFilterGender,
            filterCountry,
            setFilterCountry,
            selectPrevCountry,
            setSelectPrevCountry,
            selectPrevGender,
            setSelectPrevGender,
            selectCountry,
            setSelectCountry,
            selectGender,
            setSelectGender,
            LIST_INPUT_GENDER,
            LIST_INPUT_COUNTRY,
            showResultFilterGender,
            setShowResultFilterGender,
            showResultFilterCountry,
            setShowResultFilterCountry,
          }}
        />
        <div className="dt-example">
          <div
            id="example_wrapper"
            className="dataTables_wrapper dt-bootstrap5 no-footer"
          >
            <Search
              value={globalFilter ?? ""}
              onChange={(value) => setGlobalFilter(String(value))}
            />
            <Row className="dt-row">
              <Col sm="12">
                <Table
                  responsive
                  hover
                  className="table-light dataTable no-footer"
                >
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                          return (
                            <th
                              key={header.id}
                              colSpan={header.colSpan}
                              tabIndex={0}
                              scope="col"
                              className={clsx("sorting", {
                                ["sorting_asc"]:
                                  header.column.getIsSorted() === "asc",
                                ["sorting_desc"]:
                                  header.column.getIsSorted() === "desc",
                              })}
                              aria-controls="example"
                              rowSpan={1}
                              onClick={header.column.getToggleSortingHandler()}
                            >
                              {header.isPlaceholder ? null : (
                                <span
                                // {...{
                                //   className: header.column.getCanSort()
                                //     ? "cursor-pointer select-none"
                                //     : "",
                                //   onClick:
                                //     header.column.getToggleSortingHandler(),
                                // }}
                                >
                                  {flexRender(
                                    header.column.columnDef.header,
                                    header.getContext()
                                  )}
                                </span>
                              )}
                            </th>
                          );
                        })}
                      </tr>
                    ))}

                    {/* <tr>
                      <th
                        scope="col"
                        className="sorting sorting_asc"
                        tabIndex={0}
                        aria-controls="example"
                        rowSpan={1}
                        colSpan={1}
                        aria-label=": activate to sort column descending"
                        style={{ width: "13px" }}
                        aria-sort="ascending"
                      >
                        <i className="bi bi-check-lg"></i>
                      </th>
                      <th
                        scope="col"
                        className="sorting"
                        tabIndex={0}
                        aria-controls="example"
                        rowSpan={1}
                        colSpan={1}
                        aria-label="Nombre: activate to sort column ascending"
                        style={{ width: "60.8281px" }}
                      >
                        Nombre
                      </th>
                      <th
                        scope="col"
                        className="sorting"
                        tabIndex={0}
                        aria-controls="example"
                        rowSpan={1}
                        colSpan={1}
                        aria-label="Genero: activate to sort column ascending"
                        style={{ width: "48.6719px" }}
                      >
                        Genero
                      </th>
                      <th
                        scope="col"
                        className="sorting"
                        tabIndex={0}
                        aria-controls="example"
                        rowSpan={1}
                        colSpan={1}
                        aria-label="Correo electrónico: activate to sort column ascending"
                        style={{ width: "138.609px" }}
                      >
                        Correo electrónico
                      </th>
                      <th
                        scope="col"
                        className="sorting"
                        tabIndex={0}
                        aria-controls="example"
                        rowSpan={1}
                        colSpan={1}
                        aria-label="Celular: activate to sort column ascending"
                        style={{ width: "54.9375px" }}
                      >
                        Celular
                      </th>
                      <th
                        scope="col"
                        className="sorting"
                        tabIndex={0}
                        aria-controls="example"
                        rowSpan={1}
                        colSpan={1}
                        aria-label="Nacionalidad: activate to sort column ascending"
                        style={{ width: "86.9531px" }}
                      >
                        Nacionalidad
                      </th>
                    </tr> */}
                  </thead>
                  <tbody>
                    {table
                      .getRowModel()
                      .rows.slice(0, 10)
                      .map((row) => {
                        return (
                          <tr key={row.id}>
                            {row.getVisibleCells().map((cell) => {
                              return (
                                <td key={cell.id}>
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    {/* <tr className="odd">
                      <th scope="row" className="sorting_1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </th>
                      <td>Lesa Collins</td>
                      <td>Female</td>
                      <td>example@gmail.com</td>
                      <td>527 567 368</td>
                      <td>US</td>
                    </tr>
                    <tr className="even">
                      <th scope="row" className="sorting_1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </th>
                      <td>Lesa Collins</td>
                      <td>Female</td>
                      <td>example@gmail.com</td>
                      <td>527 567 368</td>
                      <td>US</td>
                    </tr>
                    <tr className="odd">
                      <th scope="row" className="sorting_1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </th>
                      <td>Lesa Collins</td>
                      <td>Female</td>
                      <td>example@gmail.com</td>
                      <td>527 567 368</td>
                      <td>US</td>
                    </tr>
                    <tr className="even">
                      <th scope="row" className="sorting_1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </th>
                      <td>Lesa Collins</td>
                      <td>Female</td>
                      <td>example@gmail.com</td>
                      <td>527 567 368</td>
                      <td>US</td>
                    </tr>
                    <tr className="odd">
                      <th scope="row" className="sorting_1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </th>
                      <td>Lesa Collins</td>
                      <td>Female</td>
                      <td>example@gmail.com</td>
                      <td>527 567 368</td>
                      <td>US</td>
                    </tr>
                    <tr className="even">
                      <th scope="row" className="sorting_1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </th>
                      <td>Lesa Collins</td>
                      <td>Female</td>
                      <td>example@gmail.com</td>
                      <td>527 567 368</td>
                      <td>US</td>
                    </tr>
                    <tr className="odd">
                      <th scope="row" className="sorting_1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </th>
                      <td>Lesa Collins</td>
                      <td>Female</td>
                      <td>example@gmail.com</td>
                      <td>527 567 368</td>
                      <td>US</td>
                    </tr>
                    <tr className="even">
                      <th scope="row" className="sorting_1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </th>
                      <td>Lesa Collins</td>
                      <td>Female</td>
                      <td>example@gmail.com</td>
                      <td>527 567 368</td>
                      <td>US</td>
                    </tr>
                    <tr className="odd">
                      <th scope="row" className="sorting_1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </th>
                      <td>Lesa Collins</td>
                      <td>Female</td>
                      <td>example@gmail.com</td>
                      <td>527 567 368</td>
                      <td>US</td>
                    </tr>
                    <tr className="even">
                      <th scope="row" className="sorting_1">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          value=""
                        />
                      </th>
                      <td>Lesa Collins</td>
                      <td>Female</td>
                      <td>example@gmail.com</td>
                      <td>527 567 368</td>
                      <td>US</td>
                    </tr> */}
                  </tbody>
                </Table>
              </Col>
            </Row>
            <Pagination table={table} />
          </div>
        </div>
      </Row>
    </Container>
  );
}
