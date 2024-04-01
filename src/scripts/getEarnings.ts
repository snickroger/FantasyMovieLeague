import { MovieDataSource } from "../modules/db/sqlDataSource";
import { EarningsDownloader } from "../modules/earningsDownloader/earningsDownloader";
import { UrlDownloader } from "../modules/urlDownloader/urlDownloader";
import { ISql } from "../modules/db/isql";
import { Sql } from "../modules/db/sql";

MovieDataSource.initialize().then((conn) => {
  const http = new UrlDownloader();
  const db: ISql = new Sql();
  const earningsDownloader = new EarningsDownloader(http, db, process.stdout);
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
