import bodyParser from "body-parser";
import express from "express";
import path from "path";
import "reflect-metadata";
import favicon from "serve-favicon";
import { createConnection } from "typeorm";
import { HomeController } from "./controllers/homeController";
import { Movie } from "./models/movie";
import { Player } from "./models/player";
import { Season } from "./models/season";
import { Team } from "./models/team";
import { Url } from "./models/url";

// database setup
createConnection({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "movie",
  password: "J8Vvs85tJ6exKw88",
  database: "movie",
  logging: ["query", "error"],
  entities: [Movie, Player, Season, Team, Url],
}).then((conn) => {
  const defaultParser = bodyParser.urlencoded({ extended: true });
  const server = express();

  // controller declarations
  const homeController = new HomeController();

  // server setup
  server.use(defaultParser);
  server.use(express.static("dist/public"));
  server.use(favicon(path.join(__dirname, "public", "favicon.ico")));

  server.set("view engine", "pug");
  server.set("views", "dist/views");

  // route declarations
  server.get("/", homeController.index.bind(homeController));

  server.listen(3000);
}).catch((error) => {
  console.error(error);
});
