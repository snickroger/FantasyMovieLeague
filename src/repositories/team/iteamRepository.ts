import { Movie } from "../../models/movie";
import { Team } from "../../models/team";

export interface ITeamRepository {
  getTeam(id: number): Promise<Team>;
  addPlayerToTeam(team: Team, seasonMovies: Movie[], postBody: any): Promise<void>;
}
