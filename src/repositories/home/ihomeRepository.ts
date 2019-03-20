import { SeasonDropdownItem } from "./seasonDropdownItem";

export interface IHomeRepository {
  getAllSeasonsForDropdown(): Promise<SeasonDropdownItem[]>;
}