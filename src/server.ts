import bodyParser from "body-parser";
import express from "express";
import path from "path";
import "reflect-metadata";
import favicon from "serve-favicon";
import { createConnection } from "typeorm";
import { HomeController } from "./controllers/homeController";
import { NewController } from "./controllers/newController";
import { Earning } from "./models/earning";
import { Movie } from "./models/movie";
import { Player } from "./models/player";
import { Season } from "./models/season";
import { Share } from "./models/share";
import { Team } from "./models/team";
import { Url } from "./models/url";
import { ISeasonRepository } from "./repositories/season/iseasonRepository";
import { SeasonRepository } from "./repositories/season/seasonRepository";
import { ITeamRepository } from "./repositories/team/iteamRepository";
import { TeamRepository } from "./repositories/team/teamRepository";

// database setup
createConnection({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "movie",
  password: "J8Vvs85tJ6exKw88",
  database: "movie",
  logging: ["query", "error"],
  entities: [Earning, Movie, Player, Season, Share, Team, Url],
}).then((conn) => {
  const defaultParser = bodyParser.urlencoded({ extended: true });
  const server = express();

  const seasonDb: ISeasonRepository = new SeasonRepository();
  const teamDb: ITeamRepository = new TeamRepository();

  // controller declarations
  const homeController = new HomeController(seasonDb, teamDb);
  const newController = new NewController(seasonDb, teamDb);

  // server setup
  server.use(defaultParser);
  server.use(express.static("dist/public"));
  server.use(favicon(path.join(__dirname, "public", "favicon.ico")));

  server.set("view engine", "pug");
  server.set("views", "dist/views");

  // route declarations
  server.get("/", homeController.index.bind(homeController));
  server.get("/new", newController.index.bind(newController));
  server.post("/new", newController.postNew.bind(newController));
  server.get("/:teamId", homeController.indexTeam.bind(homeController));

  server.listen(3000);
}).catch((error) => {
  console.error(error);
});
