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
    let season: Season | undefined;
    if (seasonSlug !== undefined) {
      season = await getManager().getRepository(Season).createQueryBuilder("season")
        .leftJoinAndSelect("season.teams", "teams")
        .leftJoinAndSelect("season.movies", "movies")
        .where("season.slug LIKE :slug", { slug: seasonSlug })
        .getOne();
    } else {
      season = await getManager().getRepository(Season).createQueryBuilder("season")
        .leftJoinAndSelect("season.teams", "teams")
        .leftJoinAndSelect("season.movies", "movies")
        .orderBy("season.id", "DESC")
        .getOne();
    }

    return season;
  }
}
