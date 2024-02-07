"use client";
import clsx from "clsx";
import { useRef, useState } from "react";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import { useOnClickOutside } from "usehooks-ts";

export default function Dashboard({
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
}: any) {
  const [isShowFilterSection, setIsShowFilterSection] = useState(false);
  const [isOpenGenderInput, setIsOpenGenderInput] = useState<boolean>(false);
  const [isOpenCountryInput, setIsOpenCountryInput] = useState<boolean>(false);
  const refGenderInput = useRef<null | HTMLDivElement>(null);
  const refCountryInput = useRef<null | HTMLDivElement>(null);

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
          <button className="btn btn-sm btn-outline-primary px-4 me-2">
            <i className="bi bi-pencil"></i> Editar
          </button>
          <button className="btn btn-sm btn-outline-danger px-4 me-2">
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
    </>
  );
}
