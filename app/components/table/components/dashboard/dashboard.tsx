"use client";
import { LIST_INPUT_COUNTRY } from "@/app/lib/listInputCountry";
import { LIST_INPUT_GENDER } from "@/app/lib/listInputGender";
import { DashboardInterface } from "@/app/types/dashboardType";
import clsx from "clsx";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { SubmitHandler, useForm } from "react-hook-form";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { useOnClickOutside } from "usehooks-ts";

const MySwal = withReactContent(Swal);

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
    formState: { errors },
  } = useForm();
  const [isShowFilterSection, setIsShowFilterSection] = useState(false);
  const [isOpenGenderInput, setIsOpenGenderInput] = useState<boolean>(false);
  const [isOpenCountryInput, setIsOpenCountryInput] = useState<boolean>(false);
  const [showModal, setShowModal] = useState(false);
  const refGenderInput = useRef<null | HTMLDivElement>(null);
  const refCountryInput = useRef<null | HTMLDivElement>(null);

  let positionSelected = Object.getOwnPropertyNames(
    table.getState().rowSelection
  );
  const rowsSelected = table.getSelectedRowModel().rows;

  useEffect(() => {
    reset();
  }, [table.getState().rowSelection]);

  const handleCloseModal = () => {
    setShowModal(false);
    reset();
  };
  const handleShowModal = () => setShowModal(true);

  useOnClickOutside(refGenderInput, () => {
    if (isOpenGenderInput) {
      setIsOpenGenderInput(false);
    }
  });

  useOnClickOutside(refCountryInput, () => {
    if (isOpenCountryInput) {
      setIsOpenCountryInput(false);
    }
  });

  const handleChangeInputGender = (e: any) => {
    const currentFilterGender = e.target.value;
    setFilterGender(currentFilterGender);

    setShowResultFilterGender(
      LIST_INPUT_GENDER.filter((gender: any) => {
        if (filterGender === "") {
          return gender;
        } else {
          return gender
            .toUpperCase()
            .includes(currentFilterGender.toUpperCase());
        }
      })
    );
  };

  const handleChangeInputCountry = (e: any) => {
    const currentFilterCountry = e.target.value;
    setFilterCountry(currentFilterCountry);

    setShowResultFilterCountry(
      LIST_INPUT_COUNTRY.filter((country: any) => {
        if (filterCountry === "") {
          return country;
        } else {
          return country
            .toUpperCase()
            .includes(currentFilterCountry.toUpperCase());
        }
      })
    );
  };

  const handleEditRowTable = () => {
    const countRowsSelect = Object.keys(table.getState().rowSelection).length;
    if (countRowsSelect === 0) {
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Debes seleccionar una fila",
        showConfirmButton: false,
        timer: 1500,
      });
    } else if (countRowsSelect > 1) {
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Seleccionaste más de una fila, selecciona solo una",
        showConfirmButton: false,
        timer: 1500,
      });
    } else {
      handleShowModal();
    }
  };

  const handleDeleteRowsTable = () => {
    const countRowsSelect = Object.keys(table.getState().rowSelection).length;
    if (countRowsSelect === 0) {
      MySwal.fire({
        toast: true,
        position: "top-end",
        icon: "info",
        title: "Debes seleccionar almenos una fila.",
        showConfirmButton: false,
        timer: 1500,
      });
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
          const newDataResults = dataFetch?.results?.filter(
            (e: any, index: number) => {
              if (!positionSelected.includes(String(index))) {
                return e;
              }
            }
          );
          setDataFetch((prev: any) => ({
            info: prev.info,
            results: newDataResults,
          }));
          table.resetRowSelection();
          Swal.fire({
            title: "¡Eliminado!",
            text: "La fila fue eliminada.",
            icon: "success",
          });
        }
      });
    }
  };

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
        };
      } else {
        return e;
      }
    });
    setDataFetch((prev: any) => ({ info: prev.info, results: newDataResults }));
    setShowModal(false);
    // reset();
  };

  return (
    <>
      <Col sm="12" md="6">
        <div className="dt-title ">
          <h2>Mi tabla</h2>
        </div>
      </Col>

      <Col sm="12" md="6">
        <div className="d-flex justify-content-end align-items-center">
          <button
            className="btn btn-sm btn-outline-primary px-4 me-2"
            id="filtrosBtn"
            onClick={() => {
              setIsShowFilterSection(!isShowFilterSection);
            }}
          >
            <i className="bi bi-sliders"></i> Filtros
          </button>
          <button
            className="btn btn-sm btn-outline-primary px-4 me-2"
            onClick={handleEditRowTable}
          >
            <i className="bi bi-pencil"></i> Editar
          </button>
          <button
            className="btn btn-sm btn-outline-danger px-4 me-2"
            onClick={handleDeleteRowsTable}
          >
            <i className="bi bi-trash3"></i> Eliminar
          </button>
        </div>
      </Col>

      {isShowFilterSection && (
        <Col sm="12" className="mt-4 filtros-content">
          <Card className="border-0 shadow-sm">
            <Card.Body>
              <Form className="row py-3">
                <Form.Group className="form-group col-sm-12 col-lg-4">
                  <div className="input-group">
                    <div className="dropdown js-bs-select-dropdown">
                      <a
                        className={clsx(
                          "btn btn-outline-secondary dropdown-toggle d-flex flex-nowrap align-items-center",
                          {
                            ["show"]: isOpenGenderInput,
                          }
                        )}
                        onClick={() => {
                          setIsOpenGenderInput(!isOpenGenderInput);
                        }}
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ width: "auto" }}
                      >
                        <div className="js-dropdown-header flex-fill text-start">
                          <span>{selectPrevGender}</span>
                          <small className="text-muted mx-2"></small>
                        </div>
                      </a>
                      {isOpenGenderInput && (
                        <div
                          ref={refGenderInput}
                          className="dropdown-menu mt-1 show"
                        >
                          <div className="d-flex flex-column px-2 pb-2 border-bottom">
                            <div className="d-flex justify-content-end align-items-center">
                              <input
                                autoFocus
                                value={filterGender}
                                onChange={handleChangeInputGender}
                                type="search"
                                className="form-control form-control-sm me-auto"
                                placeholder="Buscar.."
                              />
                            </div>
                          </div>
                          <h6 className="dropdown-header text-uppercase text-start my-0 w-100 rounded-0 py-1 bg-secondary text-bg-secondary">
                            GENERO
                          </h6>
                          {showResultFilterGender.map(
                            (gender: any, index: number) => (
                              <div
                                key={gender}
                                className=""
                                onClick={() => {
                                  setSelectPrevGender(gender);
                                  setIsOpenGenderInput(false);
                                }}
                              >
                                <a
                                  className={clsx(
                                    "dropdown-item d-flex align-items-end",
                                    {
                                      ["active"]: gender === selectPrevGender,
                                    }
                                  )}
                                  data-index={index}
                                >
                                  <span className="ps-3">{gender}</span>
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Form.Group>
                <Form.Group className="form-group col-sm-12 col-lg-4">
                  <div className="input-group ">
                    <div className="dropdown js-bs-select-dropdown ">
                      <a
                        className={clsx(
                          "btn btn-outline-secondary dropdown-toggle d-flex flex-nowrap align-items-center",
                          {
                            ["show"]: isOpenCountryInput,
                          }
                        )}
                        onClick={() => {
                          setIsOpenCountryInput(!isOpenCountryInput);
                        }}
                        role="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style={{ width: "auto" }}
                      >
                        <div className="js-dropdown-header flex-fill text-start">
                          <span>{selectPrevCountry}</span>
                          <small className="text-muted mx-2"></small>
                        </div>
                      </a>
                      {isOpenCountryInput && (
                        <div
                          ref={refCountryInput}
                          className="dropdown-menu mt-1 show"
                        >
                          <div className="d-flex flex-column px-2 pb-2 border-bottom">
                            <div className="d-flex  justify-content-end align-items-center">
                              <input
                                autoFocus
                                value={filterCountry}
                                onChange={handleChangeInputCountry}
                                type="search"
                                className="form-control form-control-sm me-auto"
                                placeholder="Buscar.."
                              />
                            </div>
                          </div>
                          <h6 className="dropdown-header text-uppercase text-start my-0 w-100 rounded-0 py-1 bg-secondary text-bg-secondary">
                            NACIONALIDAD
                          </h6>
                          {showResultFilterCountry.map(
                            (country: any, index: number) => (
                              <div
                                key={country}
                                className=""
                                onClick={() => {
                                  setSelectPrevCountry(country);
                                  setIsOpenCountryInput(false);
                                }}
                              >
                                <a
                                  className={clsx(
                                    "dropdown-item d-flex align-items-end",
                                    {
                                      ["active"]: country === selectPrevCountry,
                                    }
                                  )}
                                  data-index={index}
                                >
                                  <span className="ps-3">{country}</span>
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </Form.Group>
                <div className="col-sm-12 col-lg-4">
                  <button
                    className="btn btn-sm btn-primary px-4 rounded-3 btn-search"
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectGender(selectPrevGender);
                      setSelectCountry(selectPrevCountry);
                      getFetching({
                        gender: selectPrevGender,
                        country: selectPrevCountry,
                      });
                      setGlobalFilter("");
                      table.resetPageIndex(true);
                      table.resetRowSelection();
                    }}
                  >
                    <i className="bi bi-search me-2"></i> Buscar
                  </button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      )}

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Editar</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onSubmit)}>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                type="text"
                defaultValue={rowsSelected[0]?.original.name?.first}
                {...register("first", { required: true })}
                autoFocus
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                type="text"
                defaultValue={rowsSelected[0]?.original.name.last}
                {...register("last", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Genero</Form.Label>
              <Form.Select
                aria-label="genero"
                defaultValue={rowsSelected[0]?.original.gender}
                {...register("gender", { required: true })}
              >
                {LIST_INPUT_GENDER.map((gender: any) => (
                  <option key={gender} value={gender.toLowerCase()}>
                    {gender}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Correo electronico</Form.Label>
              <Form.Control
                type="email"
                defaultValue={rowsSelected[0]?.original.email}
                {...register("email", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Celular</Form.Label>
              <Form.Control
                type="text"
                defaultValue={rowsSelected[0]?.original.phone}
                {...register("phone", { required: true })}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
              <Form.Label>Nacionalidad</Form.Label>
              <Form.Select
                aria-label="nacionalidad"
                defaultValue={rowsSelected[0]?.original.nat}
                {...register("nat", { required: true })}
              >
                {LIST_INPUT_COUNTRY.map((country: any) => (
                  <option key={country} value={country.toUpperCase()}>
                    {country}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseModal}>
                Cerrar
              </Button>
              <Button variant="primary" type="submit">
                Guardar
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
