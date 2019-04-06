import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { Team } from "../../models/team";

export interface ITeamRepository {
  getTeam(id: number): Promise<Team>;
  addPlayerToTeam(team: Team, seasonMovies: Movie[], postBody: any): Promise<Player>;
}
