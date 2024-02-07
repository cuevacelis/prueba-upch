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
import { Spinner } from "react-bootstrap";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Table from "react-bootstrap/Table";
import { LIST_INPUT_COUNTRY } from "../../lib/listInputCountry";
import { LIST_INPUT_GENDER } from "../../lib/listInputGender";
import { Person, PersonFetch } from "../../types/personType";
import Dashboard from "./components/dashboard/dashboard";
import Pagination from "./components/pagination/pagination";
import Search from "./components/search/search";

export default function MyTable() {
  const [dataFetch, setDataFetch] = useState<PersonFetch>({});
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [globalFilter, setGlobalFilter] = useState<string>("");
  const [filterGender, setFilterGender] = useState<string>("");
  const [filterCountry, setFilterCountry] = useState<string>("");
  const [showResultFilterGender, setShowResultFilterGender] =
    useState(LIST_INPUT_GENDER);
  const [showResultFilterCountry, setShowResultFilterCountry] =
    useState(LIST_INPUT_COUNTRY);
  const [selectPrevGender, setSelectPrevGender] =
    useState<(typeof showResultFilterGender)[0]>("FEMALE");
  const [selectPrevCountry, setSelectPrevCountry] =
    useState<(typeof showResultFilterCountry)[0]>("US");
  const [selectGender, setSelectGender] =
    useState<(typeof showResultFilterGender)[0]>("FEMALE");
  const [selectCountry, setSelectCountry] =
    useState<(typeof showResultFilterCountry)[0]>("US");
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
  }) => {
    try {
      setIsLoading(true);
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
      setDataFetch(dataJson);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: "select",
        accessorKey: "",
        header: ({ table }) => (
          <input
            className="form-check-input"
            type="checkbox"
            {...{
              checked: table.getIsAllRowsSelected(),
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
    onPaginationChange: (updater) => {
      if (typeof updater !== "function") return;
      const newPageInfo = updater(table.getState().pagination);
      setPagination(updater);
      getFetching({ page: newPageInfo.pageIndex + 1 });
      setGlobalFilter("");
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    debugTable: false,
  });

  useEffect(function getFirstFetching() {
    getFetching({ page: 1 });
  }, []);

  return (
    <Container className="pt-5">
      <Row>
        <Dashboard
          {...{
            dataFetch,
            setDataFetch,
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
            setSelectCountry,
            setSelectGender,
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
                {isLoading ? (
                  <div
                    className="text-center"
                    style={{ marginTop: "50px", overflowY: "hidden" }}
                  >
                    <Spinner animation="border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </Spinner>
                  </div>
                ) : (
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
                                  <span>
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
                    </tbody>
                  </Table>
                )}
              </Col>
            </Row>
            <Pagination table={table} />
          </div>
        </div>
      </Row>
    </Container>
  );
}
