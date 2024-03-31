import { Earning } from "../../models/earning";
import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { Season } from "../../models/season";
import { Share } from "../../models/share";
import { Team } from "../../models/team";
import { Url } from "../../models/url";
import { ISql } from "./isql";
import { SeasonMenuItem } from "./seasonMenuItem";
import { MovieDataSource } from "./sqlDataSource";

export class Sql implements ISql {
  public async getAllSeasonsForMenu(): Promise<SeasonMenuItem[]> {
    const seasonRepo = MovieDataSource.getRepository(Season);
    const season = await seasonRepo.createQueryBuilder("season")
      .orderBy("season.id", "DESC")
      .getMany();

    return season.map((s) => new SeasonMenuItem(s.name, s.slug));
  }

  public async getSelectedSeason(seasonSlug: string | undefined): Promise<Season | null> {
    let slug: string;
    const seasonRepo = MovieDataSource.getRepository(Season);
    if (seasonSlug === undefined) {
      const maxSeason = await seasonRepo.createQueryBuilder("season")
        .where("active = true")
        .orderBy("id", "DESC")
        .getOne();
      slug = maxSeason!.slug;
    } else {
      slug = seasonSlug;
    }

    const season = await seasonRepo.createQueryBuilder("season")
      .leftJoinAndSelect("season.teams", "teams")
      .leftJoinAndSelect("season.movies", "movies")
      .leftJoinAndSelect("season.urls", "urls")
      .leftJoinAndSelect("movies.earnings", "earnings")
      .leftJoinAndSelect("movies.shares", "shares")
      .where("season.slug LIKE :slug", { slug })
      .getOne();

    return season;
  }

  public async getTeam(id: number): Promise<Team> {
    const teamRepository = MovieDataSource.getRepository(Team);
    const team = await teamRepository.createQueryBuilder("team")
      .innerJoinAndSelect("team.players", "players")
      .innerJoinAndSelect("team.season", "season")
      .where("team.id = :id", { id })
      .getOne();

    return team!;
  }

  public async getMovieInfo(id: number): Promise<Movie | null> {
    const movieRepository = MovieDataSource.getRepository(Movie);
    return await movieRepository.createQueryBuilder("movie")
      .where("movie.id = :id", { id })
      .getOne();
  }

  public async getMovie(id: number, team: Team): Promise<Movie | null> {
    const movieRepository = MovieDataSource.getRepository(Movie);
    return await movieRepository.createQueryBuilder("movie")
      .leftJoinAndSelect("movie.earnings", "earnings")
      .leftJoinAndSelect("movie.shares", "shares")
      .where("movie.id = :id", { id })
      .andWhere("shares.playerId IN (:...players)", { players: team.players.map((p) => p.id) })
      .getOne();
  }

  public async getPlayer(id: number): Promise<Player | null> {
    const playerRepository = MovieDataSource.getRepository(Player);
    return await playerRepository.createQueryBuilder("player")
      .where("player.id = :id", { id })
      .getOne();
  }

  public async addPlayerToTeam(player: Player, team: Team): Promise<Player> {
    player.teams = [team];

    const playerRepository = MovieDataSource.getRepository(Player);
    const shareRepository = MovieDataSource.getRepository(Share);

    await playerRepository.save(player);
    const sharePromises: Array<Promise<Share>> = [];

    for (const share of player.shares) {
      share.player = player;
      sharePromises.push(shareRepository.save(share));
    }

    await Promise.all(sharePromises);
    return player;
  }

  public async addEarningsForMovies(earnings: Earning[]): Promise<void> {
    const earningsRepo = MovieDataSource.getRepository(Earning);
    const earningPromises = earnings.map((e) => earningsRepo.save(e));
    await Promise.all(earningPromises);
  }

  public async deleteEarningsForDate(dateStr: string) {
    const earningsRepo = MovieDataSource.getRepository(Earning);
    await earningsRepo.createQueryBuilder("earning")
      .delete()
      .where('DATE("createdAt") = :date', { date: dateStr })
      .execute();
  }

  public async updateRatingForMovie(movie: Movie, rating: number): Promise<void> {
    const movieRepository = MovieDataSource.getRepository(Movie);
    await movieRepository.createQueryBuilder("movies")
      .update()
      .set({ rating })
      .where({ id: movie.id })
      .execute();
  }

  public async addSeason(season: Season): Promise<void> {
    const seasonRepo = MovieDataSource.getRepository(Season);
    const urlRepo = MovieDataSource.getRepository(Url);

    await seasonRepo.save(season);
    const urlPromises: Array<Promise<Url>> = [];

    for (const url of season.urls) {
      url.season = season;
      urlPromises.push(urlRepo.save(url));
    }

    await Promise.all(urlPromises);
  }

  public async addTeam(team: Team): Promise<void> {
    const teamRepo = MovieDataSource.getRepository(Team);
    await teamRepo.save(team);
  }

  public async saveMovie(movie: Movie): Promise<void> {
    const movieRepo = MovieDataSource.getRepository(Movie);
    await movieRepo.save(movie);
  }
}
