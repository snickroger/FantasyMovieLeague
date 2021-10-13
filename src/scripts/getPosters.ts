import { createConnection } from "typeorm";
import { Earning } from "../models/earning";
import { Movie } from "../models/movie";
import { Player } from "../models/player";
import { Season } from "../models/season";
import { Share } from "../models/share";
import { Team } from "../models/team";
import { Url } from "../models/url";
import { Sql } from "../modules/db/sql";
import { PostersDownloader } from "../modules/postersDownloader/postersDownloader";
import { UrlDownloader } from "../modules/urlDownloader/urlDownloader";

const targetPath = process.argv.slice(2)[0];
const slug = process.argv.slice(2)[1];

if (!targetPath) {
  console.error("Please specify target path to download posters to");
  process.exit(1);
}

const http = new UrlDownloader();
const sql = new Sql();
const postersDownloader = new PostersDownloader(http, sql, process.stdout, targetPath);

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
  postersDownloader.downloadPosters(slug).then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}).catch((dbErr) => {
  console.error(dbErr);
  process.exit(1);
});
