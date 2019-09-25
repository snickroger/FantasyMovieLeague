import { Earning } from "../../models/earning";
import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { Season } from "../../models/season";
import { Team } from "../../models/team";
import { SeasonMenuItem } from "./seasonMenuItem";

export interface ISql {
  getAllSeasonsForMenu(): Promise<SeasonMenuItem[]>;
  getSelectedSeason(seasonSlug: string | undefined): Promise<Season | undefined>;
  getTeam(id: number): Promise<Team>;
  getMovieInfo(id: number): Promise<Movie | undefined>;
  getMovie(id: number, team: Team): Promise<Movie | undefined>;
  getPlayer(id: number): Promise<Player | undefined>;
  addPlayerToTeam(player: Player, team: Team): Promise<Player>;
  addEarningsForMovies(earning: Earning[]): Promise<void>;
  deleteEarningsForDate(dateStr: string): Promise<void>;
  updateRatingForMovie(movie: Movie, rating: number): Promise<void>;
  addSeason(season: Season): Promise<void>;
  addTeam(team: Team): Promise<void>;
  saveMovie(movie: Movie): Promise<void>;
}
