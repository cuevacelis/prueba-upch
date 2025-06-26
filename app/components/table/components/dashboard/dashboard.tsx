"use client"

import type React from "react"

import { LIST_INPUT_COUNTRY } from "@/app/lib/listInputCountry"
import { LIST_INPUT_GENDER } from "@/app/lib/listInputGender"
import type { DashboardInterface } from "@/app/types/dashboardType"
import { useEffect, useRef, useState } from "react"
import { type SubmitHandler, useForm } from "react-hook-form"
import Swal from "sweetalert2"
import withReactContent from "sweetalert2-react-content"
import { useOnClickOutside } from "usehooks-ts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { cn } from "@/lib/utils"
import { SlidersHorizontal, Pencil, TrashIcon as Trash3, Search, ChevronDown, ChevronUp } from "lucide-react"

const MySwal = withReactContent(Swal)

export default function Dashboard({
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
}: DashboardInterface) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()

  const [isShowFilterSection, setIsShowFilterSection] = useState(false)
  const [isOpenGenderInput, setIsOpenGenderInput] = useState<boolean>(false)
  const [isOpenCountryInput, setIsOpenCountryInput] = useState<boolean>(false)
  const [showModal, setShowModal] = useState(false)
  const refGenderInput = useRef<HTMLDivElement>(null)
  const refCountryInput = useRef<HTMLDivElement>(null)

  const positionSelected = Object.getOwnPropertyNames(table.getState().rowSelection)
  const rowsSelected = table.getSelectedRowModel().rows

  // useOnClickOutside(refGenderInput, () => setIsOpenGenderInput(false))
  // useOnClickOutside(refCountryInput, () => setIsOpenCountryInput(false))

  useEffect(() => {
    reset()
  }, [table.getState().rowSelection, reset])

  const handleCloseModal = () => {
    setShowModal(false)
    reset()
  }

  const handleShowModal = () => setShowModal(true)

  const handleChangeInputGender = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFilterGender = e.target.value
    setFilterGender(currentFilterGender)

    setShowResultFilterGender(
      LIST_INPUT_GENDER.filter((gender: string) => {
        if (filterGender === "") {
          return gender
        } else {
          return gender.toUpperCase().includes(currentFilterGender.toUpperCase())
        }
      }),
    )
  }

  const handleChangeInputCountry = (e: React.ChangeEvent<HTMLInputElement>) => {
    const currentFilterCountry = e.target.value
    setFilterCountry(currentFilterCountry)

    setShowResultFilterCountry(
      LIST_INPUT_COUNTRY.filter((country: string) => {
        if (filterCountry === "") {
          return country
        } else {
          return country.toUpperCase().includes(currentFilterCountry.toUpperCase())
        }
      }),
    )
  }

  const handleEditRowTable = () => {
    const countRowsSelect = Object.keys(table.getState().rowSelection).length
    if (countRowsSelect === 0) {
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Debes seleccionar una fila",
        showConfirmButton: false,
        timer: 1500,
      })
    } else if (countRowsSelect > 1) {
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Seleccionaste más de una fila, selecciona solo una",
        showConfirmButton: false,
        timer: 1500,
      })
    } else {
      // Pre-fill form with selected row data
      const selectedRow = rowsSelected[0]?.original
      if (selectedRow) {
        setValue("first", selectedRow.name?.first)
        setValue("last", selectedRow.name?.last)
        setValue("gender", selectedRow.gender)
        setValue("email", selectedRow.email)
        setValue("phone", selectedRow.phone)
        setValue("nat", selectedRow.nat)
      }
      handleShowModal()
    }
  }

  const handleDeleteRowsTable = () => {
    const countRowsSelect = Object.keys(table.getState().rowSelection).length
    if (countRowsSelect === 0) {
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Debes seleccionar almenos una fila.",
        showConfirmButton: false,
        timer: 1500,
      })
    } else {
      MySwal.fire({
        title: "¿Estas seguro?",
        text: "¡No podrás revertir esto!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "¡Sí, eliminar!",
      }).then((result) => {
        if (result.isConfirmed) {
          const newDataResults = dataFetch?.results?.filter((e: any, index: number) => {
            if (!positionSelected.includes(String(index))) {
              return e
            }
          })
          setDataFetch((prev: any) => ({
            info: prev.info,
            results: newDataResults,
          }))
          table.resetRowSelection()
          Swal.fire({
            title: "¡Eliminado!",
            text: "La fila fue eliminada.",
            icon: "success",
          })
        }
      })
    }
  }

  const onSubmit: SubmitHandler<any> = (data) => {
    const newDataResults = dataFetch?.results?.map((e: any, index: number) => {
      if (index === Number(positionSelected[0])) {
        return {
          ...e,
          name: {
            ...e.name,
            first: data.first,
            last: data.last,
          },
          gender: data.gender,
          email: data.email,
          phone: data.phone,
          nat: data.nat,
        }
      } else {
        return e
      }
    })
    setDataFetch((prev: any) => ({ info: prev.info, results: newDataResults }))
    setShowModal(false)
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Mi tabla</h2>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsShowFilterSection(!isShowFilterSection)}
            className="flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filtros
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleEditRowTable}
            className="flex items-center gap-2 bg-transparent"
          >
            <Pencil className="h-4 w-4" />
            Editar
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDeleteRowsTable}
            className="flex items-center gap-2 text-destructive hover:text-destructive bg-transparent"
          >
            <Trash3 className="h-4 w-4" />
            Eliminar
          </Button>
        </div>
      </div>

      <Collapsible open={isShowFilterSection} onOpenChange={setIsShowFilterSection}>
        <CollapsibleContent className="space-y-4">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 items-end">
                {/* Gender Filter */}
                <div className="space-y-2">
                  <Label>Género</Label>
                  <div className="relative" ref={refGenderInput}>
                    <Button
                      variant="outline"
                      onClick={() => setIsOpenGenderInput(!isOpenGenderInput)}
                      className="w-full justify-between"
                    >
                      {selectPrevGender}
                      {isOpenGenderInput ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    {isOpenGenderInput && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md">
                        <div className="p-2 border-b">
                          <Input
                            autoFocus
                            value={filterGender}
                            onChange={handleChangeInputGender}
                            placeholder="Buscar..."
                            className="h-8"
                          />
                        </div>
                        <div className="p-1 max-h-48 overflow-y-auto">
                          <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">Género</div>
                          {showResultFilterGender.map((gender: string) => (
                            <button
                              key={gender}
                              className={cn(
                                "w-full text-left px-2 py-1 text-sm hover:bg-accent rounded-sm",
                                gender === selectPrevGender && "bg-accent",
                              )}
                              onClick={() => {
                                setSelectPrevGender(gender)
                                setIsOpenGenderInput(false)
                              }}
                            >
                              {gender}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Country Filter */}
                <div className="space-y-2">
                  <Label>Nacionalidad</Label>
                  <div className="relative" ref={refCountryInput}>
                    <Button
                      variant="outline"
                      onClick={() => setIsOpenCountryInput(!isOpenCountryInput)}
                      className="w-full justify-between"
                    >
                      {selectPrevCountry}
                      {isOpenCountryInput ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </Button>
                    {isOpenCountryInput && (
                      <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md">
                        <div className="p-2 border-b">
                          <Input
                            autoFocus
                            value={filterCountry}
                            onChange={handleChangeInputCountry}
                            placeholder="Buscar..."
                            className="h-8"
                          />
                        </div>
                        <div className="p-1 max-h-48 overflow-y-auto">
                          <div className="px-2 py-1 text-xs font-medium text-muted-foreground uppercase">
                            Nacionalidad
                          </div>
                          {showResultFilterCountry.map((country: string) => (
                            <button
                              key={country}
                              className={cn(
                                "w-full text-left px-2 py-1 text-sm hover:bg-accent rounded-sm",
                                country === selectPrevCountry && "bg-accent",
                              )}
                              onClick={() => {
                                setSelectPrevCountry(country)
                                setIsOpenCountryInput(false)
                              }}
                            >
                              {country}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Search Button */}
                <div className="lg:col-span-2">
                  <Button
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectGender(selectPrevGender)
                      setSelectCountry(selectPrevCountry)
                      getFetching({
                        gender: selectPrevGender,
                        country: selectPrevCountry,
                      })
                      setGlobalFilter("")
                      table.resetPageIndex(true)
                      table.resetRowSelection()
                    }}
                    className="flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" />
                    Buscar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Edit Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Editar</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="first">Nombre</Label>
              <Input id="first" {...register("first", { required: true })} autoFocus />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last">Apellido</Label>
              <Input id="last" {...register("last", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Género</Label>
              <Select onValueChange={(value) => setValue("gender", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar género" />
                </SelectTrigger>
                <SelectContent>
                  {LIST_INPUT_GENDER.map((gender: string) => (
                    <SelectItem key={gender} value={gender.toLowerCase()}>
                      {gender}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input id="email" type="email" {...register("email", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Celular</Label>
              <Input id="phone" {...register("phone", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nat">Nacionalidad</Label>
              <Select onValueChange={(value) => setValue("nat", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nacionalidad" />
                </SelectTrigger>
                <SelectContent>
                  {LIST_INPUT_COUNTRY.map((country: string) => (
                    <SelectItem key={country} value={country.toUpperCase()}>
                      {country}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
