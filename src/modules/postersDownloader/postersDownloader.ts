import Enumerable from "linq";
import { ISql } from "../db/isql";
import { IUrlDownloader } from "../urlDownloader/iurlDownloader";
import { IPostersDownloader } from "./ipostersDownloader";
import path from "path";

export default class PostersDownloader implements IPostersDownloader {
  private readonly http: IUrlDownloader;
  private readonly sql: ISql;
  private readonly output: NodeJS.WriteStream;

  constructor(http: IUrlDownloader, sql: ISql, output: NodeJS.WriteStream) {
    this.http = http;
    this.sql = sql;
    this.output = output;
  }

  public async downloadPosters(): Promise<void> {
    const currentSeason = await this.sql.getSelectedSeason(undefined);
    if (currentSeason === undefined) {
      return;
    }

    const moviesToGet = Enumerable.from(currentSeason.movies)
      .orderBy((m) => m.id)
      .toArray();

    for (const movie of moviesToGet)
    {
      const imdbId = movie.imdb;
      if (imdbId === undefined) {
        continue;
      }

      const omdbApiKey = process.env.OMDB_API_KEY;
      const omdbUrl = `http://www.omdbapi.com/?i=${imdbId}&apikey=${omdbApiKey}`;
      
      try
      {
        const omdbResponse = await this.http.download(omdbUrl);
        const jsonResponse = JSON.parse(omdbResponse);

        const posterUrl = (jsonResponse.Poster as string).replace("_SX300.jpg", "_SX600.jpg");
        const posterLocalPath = path.join(process.env.POSTERS_PATH as string, `${imdbId}.jpg`);
        
        await this.http.downloadFile(posterUrl, posterLocalPath);
      }
      catch (e)
      {
        // no-op
      }
    }
  }

}