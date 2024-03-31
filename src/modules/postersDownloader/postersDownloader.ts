import Enumerable from "linq";
import { ISql } from "../db/isql";
import { IUrlDownloader } from "../urlDownloader/iurlDownloader";
import { IPostersDownloader } from "./ipostersDownloader";
import path from "path";

export class PostersDownloader implements IPostersDownloader {
  private readonly http: IUrlDownloader;
  private readonly sql: ISql;
  private readonly output: NodeJS.WriteStream;
  private readonly targetPath: string;

  constructor(http: IUrlDownloader, sql: ISql, output: NodeJS.WriteStream, targetPath: string) {
    this.http = http;
    this.sql = sql;
    this.output = output;
    this.targetPath = targetPath;
  }

  public async downloadPosters(slug: string): Promise<void> {
    const currentSeason = await this.sql.getSelectedSeason(slug);
    if (currentSeason === null) {
      return;
    }

    const moviesToGet = Enumerable.from(currentSeason.movies)
      .orderBy((m) => m.id)
      .toArray();

    for (const movie of moviesToGet)
    {
      let imdbId = movie.imdb;
      if (imdbId === undefined) {
        continue;
      }

      imdbId = imdbId.replace("https://www.imdb.com/title/", "");

      const omdbApiKey = process.env.OMDB_API_KEY;
      const omdbUrl = `http://www.omdbapi.com/?i=${imdbId}&apikey=${omdbApiKey}`;
      
      try
      {
        const omdbResponse = await this.http.download<{Poster: string}>(omdbUrl);

        const posterUrl = omdbResponse.Poster.replace("_SX300.jpg", "_SX600.jpg");
        const posterLocalPath = path.join(this.targetPath, `${imdbId}.jpg`);
        
        await this.http.downloadFile(posterUrl, posterLocalPath);
        
        this.output.write(`${movie.name} - ${imdbId}.jpg\n`);
      }
      catch (e)
      {
        this.output.write(`ERROR: ${movie.name} - ${e}\n`);
      }
    }
  }

}