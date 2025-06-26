"use client"

import {
  type ColumnDef,
  type PaginationState,
  type SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { useEffect, useMemo, useState } from "react"
import { Loader2, ChevronUp, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { LIST_INPUT_COUNTRY } from "../../lib/listInputCountry"
import { LIST_INPUT_GENDER } from "../../lib/listInputGender"
import type { Person, PersonFetch } from "../../types/personType"
import Dashboard from "./components/dashboard/dashboard"
import Pagination from "./components/pagination/pagination"
import Search from "./components/search/search"

export default function MyTable() {
  const [dataFetch, setDataFetch] = useState<PersonFetch>({})
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [globalFilter, setGlobalFilter] = useState<string>("")
  const [filterGender, setFilterGender] = useState<string>("")
  const [filterCountry, setFilterCountry] = useState<string>("")
  const [showResultFilterGender, setShowResultFilterGender] = useState(LIST_INPUT_GENDER)
  const [showResultFilterCountry, setShowResultFilterCountry] = useState(LIST_INPUT_COUNTRY)
  const [selectPrevGender, setSelectPrevGender] = useState<(typeof showResultFilterGender)[0]>("FEMALE")
  const [selectPrevCountry, setSelectPrevCountry] = useState<(typeof showResultFilterCountry)[0]>("US")
  const [selectGender, setSelectGender] = useState<(typeof showResultFilterGender)[0]>("FEMALE")
  const [selectCountry, setSelectCountry] = useState<(typeof showResultFilterCountry)[0]>("US")
  const [{ pageIndex, pageSize }, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })

  const pagination = useMemo(
    () => ({
      pageIndex,
      pageSize,
    }),
    [pageIndex, pageSize],
  )

  const getFetching = async ({ gender = selectGender, country = selectCountry, page = pagination.pageIndex }) => {
    try {
      setIsLoading(true)
      const responseDataFetch = await fetch(
        `https://randomuser.me/api?results=10&gender=${gender.toLowerCase()}&nat=${country}&page=${page}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        },
      )
      if (!responseDataFetch.ok) {
        throw "Respuesta de red OK pero respuesta HTTP no OK"
      }
      const dataJson = await responseDataFetch.json()
      setDataFetch(dataJson)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
      console.error(error)
    }
  }

  const columns = useMemo<ColumnDef<Person>[]>(
    () => [
      {
        id: "select",
        accessorKey: "",
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            onCheckedChange={(value) => table.toggleAllRowsSelected(!!value)}
            aria-label="Seleccionar todas las filas"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            disabled={!row.getCanSelect()}
            aria-label="Seleccionar fila"
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
        header: "Género",
        cell: (info) => <span className="capitalize">{info.getValue() as string}</span>,
        footer: (props) => props.column.id,
      },
      {
        id: "email",
        accessorKey: "email",
        header: "Correo electrónico",
        cell: (info) => <span className="text-blue-600 hover:text-blue-800">{info.getValue() as string}</span>,
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
        cell: (info) => <span className="uppercase font-medium">{info.getValue() as string}</span>,
        footer: (props) => props.column.id,
      },
    ],
    [],
  )

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
      if (typeof updater !== "function") return
      const newPageInfo = updater(table.getState().pagination)
      setPagination(updater)
      getFetching({ page: newPageInfo.pageIndex + 1 })
      setGlobalFilter("")
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualPagination: true,
    debugTable: false,
  })

  useEffect(function getFirstFetching() {
    getFetching({ page: 1 })
  }, [])

  return (
    <div className="container mx-auto px-4 pt-8">
      <div className="space-y-6">
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

        <div className="space-y-4">
          <Search value={globalFilter ?? ""} onChange={(value) => setGlobalFilter(String(value))} />

          <div className="rounded-md border">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-6 w-6 animate-spin" />
                  <span className="text-sm text-muted-foreground">Cargando...</span>
                </div>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow key={headerGroup.id}>
                      {headerGroup.headers.map((header) => {
                        const canSort = header.column.getCanSort()
                        const sortDirection = header.column.getIsSorted()

                        return (
                          <TableHead
                            key={header.id}
                            colSpan={header.colSpan}
                            className={cn("select-none", canSort && "cursor-pointer hover:bg-muted/50")}
                            onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                          >
                            {header.isPlaceholder ? null : (
                              <div className="flex items-center space-x-2">
                                <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                                {canSort && (
                                  <div className="flex flex-col">
                                    <ChevronUp
                                      className={cn(
                                        "h-3 w-3",
                                        sortDirection === "asc" ? "text-foreground" : "text-muted-foreground",
                                      )}
                                    />
                                    <ChevronDown
                                      className={cn(
                                        "h-3 w-3 -mt-1",
                                        sortDirection === "desc" ? "text-foreground" : "text-muted-foreground",
                                      )}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </TableHead>
                        )
                      })}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table
                    .getRowModel()
                    .rows.slice(0, 10)
                    .map((row) => (
                      <TableRow key={row.id} className={cn("hover:bg-muted/50", row.getIsSelected() && "bg-muted")}>
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            )}
          </div>

          <Pagination table={table} />
        </div>
      </div>
    </div>
  )
}
