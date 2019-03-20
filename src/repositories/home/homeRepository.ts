import { getManager } from "typeorm";
import { IHomeRepository } from "./ihomeRepository";
import { SeasonDropdownItem } from "./seasonDropdownItem";
import { Season } from "../../models/season";

export class HomeRepository implements IHomeRepository {
  public async getAllSeasonsForDropdown(): Promise<SeasonDropdownItem[]> {
    const season = await getManager().getRepository(Season).createQueryBuilder("season")
      .orderBy("id", "DESC")
      .getMany();

    return season.map(s => new SeasonDropdownItem(s.name, s.slug));
  }

}