import { Team } from "../../models/team";

export interface ITeamRepository {
  getTeamBySeasonIdAndSlug(seasonId: number, slug: string): Promise<Team | undefined>;
}
