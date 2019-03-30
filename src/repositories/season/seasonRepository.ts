import { getManager } from "typeorm";
import { Season } from "../../models/season";
import { ISeasonRepository } from "./iseasonRepository";
import { SeasonMenuItem } from "./seasonMenuItem";

export class SeasonRepository implements ISeasonRepository {
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
}
