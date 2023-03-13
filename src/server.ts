import bodyParser from "body-parser";
import express from "express";
import basicAuth from "express-basic-auth";
import path from "path";
import "reflect-metadata";
import favicon from "serve-favicon";
import { createConnection } from "typeorm";
import { AdminController } from "./controllers/adminController";
import { HomeController } from "./controllers/homeController";
import { MovieController } from "./controllers/movieController";
import { NewController } from "./controllers/newController";
import { PlayerController } from "./controllers/playerController";
import { Earning } from "./models/earning";
import { Movie } from "./models/movie";
import { Player } from "./models/player";
import { Season } from "./models/season";
import { Share } from "./models/share";
import { Team } from "./models/team";
import { Url } from "./models/url";
import { ISql } from "./modules/db/isql";
import { Sql } from "./modules/db/sql";
import { EmailSender } from "./modules/emailSender/emailSender";
import { IEmailSender } from "./modules/emailSender/iemailSender";

// database setup
createConnection({
  type: "postgres",
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT!, 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  logging: ["warn", "error"],
  entities: [Earning, Movie, Player, Season, Share, Team, Url],
}).then((conn) => {
  const defaultParser = bodyParser.urlencoded({ extended: true });
  const server = express();

  const db: ISql = new Sql();
  const emailSender: IEmailSender = new EmailSender();

  // controller declarations
  const homeController = new HomeController(db);
  const newController = new NewController(db, emailSender);
  const movieController = new MovieController(db);
  const playerController = new PlayerController(db);
  const adminController = new AdminController(db);

  // basic auth
  const auth = basicAuth({users: { [process.env.ADMIN_USERNAME!]: process.env.ADMIN_PASSWORD! },
    challenge: true, realm: "Fantasy Movie League"});

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
  server.get("/movies/:id(\\d+)", movieController.get.bind(movieController));
  server.get("/players/:id(\\d+)", playerController.get.bind(playerController));
  server.get("/admin", auth, adminController.index.bind(adminController));
  server.get("/admin/season/new", auth, adminController.newSeason.bind(adminController));
  server.post("/admin/season", auth, adminController.createSeason.bind(adminController));
  server.get("/admin/movies", auth, adminController.listMovies.bind(adminController));
  server.post("/admin/movies", auth, adminController.createOrUpdateMovie.bind(adminController));
  server.get("/admin/movies/:id(\\d+)", auth, adminController.editMovie.bind(adminController));
  server.post("/admin/movies/:id(\\d+)", auth, adminController.createOrUpdateMovie.bind(adminController));
  server.get("/admin/movies/new", auth, adminController.newMovie.bind(adminController));
  server.get("/:teamId.txt", homeController.indexTeamText.bind(homeController));
  server.get("/:teamId", homeController.indexTeam.bind(homeController));

  server.listen(3000);
}).catch((error) => {
  console.error(error);
});
