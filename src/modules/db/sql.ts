import { getManager } from "typeorm";
import { Movie } from "../../models/movie";
import { Player } from "../../models/player";
import { Season } from "../../models/season";
import { Share } from "../../models/share";
import { Team } from "../../models/team";
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
      .leftJoinAndSelect("movies.earnings", "earnings")
      .leftJoinAndSelect("movies.shares", "shares")
      .where("season.slug LIKE :slug", { slug })
      .getOne();

    return season;
  }

  public async getTeam(id: number): Promise<Team> {
    const team = await getManager().getRepository(Team).createQueryBuilder("team")
      .innerJoinAndSelect("team.players", "players")
      .where("team.id = :id", { id })
      .getOne();

    return team!;
  }

  public async addPlayerToTeam(player: Player, team: Team): Promise<Player> {
    player.teams = [team];

    await getManager().getRepository(Player).save(player);
    const sharePromises: Array<Promise<Share>> = [];

    for (const share of player.shares) {
      share.player = player;
      player.shares.push(share);
      sharePromises.push(getManager().getRepository(Share).save(share));
    }

    await Promise.all(sharePromises);
    return player;
  }
}
