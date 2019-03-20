import { Request, Response } from "express";
import { IHomeRepository } from "../repositories/home/ihomeRepository";

export class HomeController {
  private readonly homeDb: IHomeRepository;

  constructor(homeDb: IHomeRepository) {
    this.homeDb = homeDb;
  }

  public async index(req: Request, res: Response, next: any) {
    try {
      const seasons = await this.homeDb.getAllSeasonsForDropdown();

      res.render("home/index_test", { title: "Testing", seasons: seasons });
    } catch (e) {
      next(e);
    }
  }
}
