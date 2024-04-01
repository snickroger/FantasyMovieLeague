import { MovieDataSource } from "../modules/db/sqlDataSource";
import { PostersDownloader } from "../modules/postersDownloader/postersDownloader";
import { UrlDownloader } from "../modules/urlDownloader/urlDownloader";
import { ISql } from "../modules/db/isql";
import { Sql } from "../modules/db/sql";

const targetPath = process.argv.slice(2)[0];
const slug = process.argv.slice(2)[1];

if (!targetPath) {
  console.error("Please specify target path to download posters to");
  process.exit(1);
}

MovieDataSource.initialize().then((conn) => {
  const http = new UrlDownloader();
  const db: ISql = new Sql();
  const postersDownloader = new PostersDownloader(http, db, process.stdout, targetPath);

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
