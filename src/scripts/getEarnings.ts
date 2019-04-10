import { createConnection } from "typeorm";
import { Earning } from "../models/earning";
import { Movie } from "../models/movie";
import { Player } from "../models/player";
import { Season } from "../models/season";
import { Share } from "../models/share";
import { Team } from "../models/team";
import { Url } from "../models/url";
import { Sql } from "../modules/db/sql";
import { EarningsDownloader } from "../modules/earningsDownloader/earningsDownloader";
import { UrlDownloader } from "../modules/urlDownloader/urlDownloader";

const http = new UrlDownloader();
const sql = new Sql();
const earningsDownloader = new EarningsDownloader(http, sql);

createConnection({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "movie",
  password: "J8Vvs85tJ6exKw88",
  database: "movie",
  logging: ["query", "error"],
  entities: [Earning, Movie, Player, Season, Share, Team, Url],
}).then((conn) => {
  earningsDownloader.downloadEarnings().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error(err);
    process.exit(1);
  });
}).catch((dbErr) => {
  console.error(dbErr);
  process.exit(1);
});
