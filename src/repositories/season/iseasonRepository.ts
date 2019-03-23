import { Season } from "../../models/season";
import { SeasonMenuItem } from "./seasonMenuItem";

export interface ISeasonRepository {
  getAllSeasonsForMenu(): Promise<SeasonMenuItem[]>;
  getSelectedSeason(seasonSlug: string | undefined): Promise<Season | undefined>;
}
