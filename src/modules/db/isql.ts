import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { Season } from "../../models/season";
import { Team } from "../../models/team";
import { SeasonMenuItem } from "./seasonMenuItem";

export interface ISql {
  getAllSeasonsForMenu(): Promise<SeasonMenuItem[]>;
  getSelectedSeason(seasonSlug: string | undefined): Promise<Season | undefined>;
  getTeam(id: number): Promise<Team>;
  addPlayerToTeam(player: Player, team: Team): Promise<Player>;
}