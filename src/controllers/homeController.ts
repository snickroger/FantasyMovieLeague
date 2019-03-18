import { Request, Response } from "express";
import { getManager } from "typeorm";
import { Season } from "../models/season";

export class HomeController {
  public async index(req: Request, res: Response, next: any) {
    try {
      const season = await getManager().getRepository(Season).createQueryBuilder("season")
      .innerJoinAndSelect("season.movies", "movies")
      .where("season.id = 10")
      .getOne();

      res.render("home/index_test", { title: "Testing" });
    } catch (e) {
      next(e);
    }
  }
}
