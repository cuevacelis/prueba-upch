import { Table } from "@tanstack/react-table";
import { Dispatch, SetStateAction } from "react";
import { Person, PersonFetch } from "./personType";

export interface DashboardInterface {
  dataFetch: PersonFetch;
  setDataFetch: Dispatch<SetStateAction<PersonFetch>>;
  table: Table<Person>;
  setGlobalFilter: Dispatch<SetStateAction<string>>;
  getFetching: ({
    gender,
    country,
    page,
  }: {
    gender?: string | undefined;
    country?: string | undefined;
    page?: number | undefined;
  }) => Promise<void>;
  filterGender: string;
  setFilterGender: Dispatch<SetStateAction<string>>;
  filterCountry: string;
  setFilterCountry: Dispatch<SetStateAction<string>>;
  selectPrevCountry: string;
  setSelectPrevCountry: Dispatch<SetStateAction<string>>;
  selectPrevGender: string;
  setSelectPrevGender: Dispatch<SetStateAction<string>>;
  setSelectCountry: Dispatch<SetStateAction<string>>;
  setSelectGender: Dispatch<SetStateAction<string>>;
  showResultFilterGender: string[];
  setShowResultFilterGender: Dispatch<SetStateAction<string[]>>;
  showResultFilterCountry: string[];
  setShowResultFilterCountry: Dispatch<SetStateAction<string[]>>;
}
