import { getManager } from "typeorm";
import { Earning } from "../../models/earning";
import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { Season } from "../../models/season";
import { Share } from "../../models/share";
import { Team } from "../../models/team";
import { Url } from "../../models/url";
import { ISql } from "./isql";
import { SeasonMenuItem } from "./seasonMenuItem";

export class Sql implements ISql {
  public async getAllSeasonsForMenu(): Promise<SeasonMenuItem[]> {
    const season = await getManager().getRepository(Season).createQueryBuilder("season")
      .orderBy("season.id", "DESC")
      .getMany();

    return season.map((s) => new SeasonMenuItem(s.name, s.slug));
  }

  public async getSelectedSeason(seasonSlug: string | undefined): Promise<Season | undefined> {
    let slug: string;
    if (seasonSlug === undefined) {
      const maxSeason = await getManager().getRepository(Season).createQueryBuilder("season")
        .orderBy("id", "DESC")
        .getOne();
      slug = maxSeason!.slug;
    } else {
      slug = seasonSlug;
    }

    const season = await getManager().getRepository(Season).createQueryBuilder("season")
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
    const team = await getManager().getRepository(Team).createQueryBuilder("team")
      .innerJoinAndSelect("team.players", "players")
      .innerJoinAndSelect("team.season", "season")
      .where("team.id = :id", { id })
      .getOne();

    return team!;
  }

  public async getMovieInfo(id: number): Promise<Movie | undefined> {
    return await getManager().getRepository(Movie).createQueryBuilder("movie")
      .where("movie.id = :id", { id })
      .getOne();
  }

  public async getMovie(id: number, team: Team): Promise<Movie | undefined> {
    return await getManager().getRepository(Movie).createQueryBuilder("movie")
      .leftJoinAndSelect("movie.earnings", "earnings")
      .leftJoinAndSelect("movie.shares", "shares")
      .where("movie.id = :id", { id })
      .andWhere("shares.playerId IN (:...players)", { players: team.players.map((p) => p.id) })
      .getOne();
  }

  public async getPlayer(id: number): Promise<Player | undefined> {
    return await getManager().getRepository(Player).createQueryBuilder("player")
      .where("player.id = :id", { id })
      .getOne();
  }

  public async addPlayerToTeam(player: Player, team: Team): Promise<Player> {
    player.teams = [team];

    await getManager().getRepository(Player).save(player);
    const sharePromises: Array<Promise<Share>> = [];

    for (const share of player.shares) {
      share.player = player;
      sharePromises.push(getManager().getRepository(Share).save(share));
    }

    await Promise.all(sharePromises);
    return player;
  }

  public async addEarningsForMovies(earnings: Earning[]): Promise<void> {
    const earningPromises = earnings.map((e) => getManager().getRepository(Earning).save(e));
    await Promise.all(earningPromises);
  }

  public async deleteEarningsForDate(dateStr: string) {
    await getManager().getRepository(Earning).createQueryBuilder("earning")
      .delete()
      .where('DATE("createdAt") = :date', { date: dateStr })
      .execute();
  }

  public async updateRatingForMovie(movie: Movie, rating: number): Promise<void> {
    await getManager().getRepository(Movie).createQueryBuilder("movies")
      .update()
      .set({ rating })
      .where({ id: movie.id })
      .execute();
  }

  public async addSeason(season: Season): Promise<void> {
    await getManager().getRepository(Season).save(season);
    const urlPromises: Array<Promise<Url>> = [];

    for (const url of season.urls) {
      url.season = season;
      urlPromises.push(getManager().getRepository(Url).save(url));
    }

    await Promise.all(urlPromises);
  }

  public async addTeam(team: Team): Promise<void> {
    await getManager().getRepository(Team).save(team);
  }

  public async saveMovie(movie: Movie): Promise<void> {
    await getManager().getRepository(Movie).save(movie);
  }
}
