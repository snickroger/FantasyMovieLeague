import { Request, Response } from "express";

export class HomeController {
  public index(req: Request, res: Response, next: any) {
    try {
      res.render("home/index_test", { title: "Testing" });
    } catch (e) {
      next(e);
    }
  }
}
