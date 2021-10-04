import accounting from "accounting";
import Enumerable from "linq";
import moment from "moment-timezone";
import { Earning } from "../../models/earning";
import { ISql } from "../db/isql";
import { IUrlDownloader } from "../urlDownloader/iurlDownloader";
import { IEarningsDownloader } from "./iearningsDownloader";
import { MetacriticParser } from "./metacriticParser";
import { MojoParser } from "./mojoParser";

export class EarningsDownloader implements IEarningsDownloader {
  private readonly http: IUrlDownloader;
  private readonly sql: ISql;
  private readonly output: NodeJS.WriteStream;

  constructor(http: IUrlDownloader, sql: ISql, output: NodeJS.WriteStream) {
    this.http = http;
    this.sql = sql;
    this.output = output;
  }

  public async downloadEarnings(): Promise<void> {
    const date: Date = moment().tz("America/New_York").toDate();
    const dateStr: string = moment().tz("America/New_York").format("YYYY-MM-DD");
    const dateThreshold: Date = moment().add(5, "days").tz("America/New_York").toDate();
    const currentSeason = await this.sql.getSelectedSeason(undefined);
    if (currentSeason === undefined || currentSeason.getEndDate() < date) {
      return;
    }

    const moviesToGet = Enumerable.from(currentSeason.movies)
      .where((m) => m.releaseDate <= dateThreshold)
      .orderByDescending((m) => m.releaseDate)
      .toArray();

    let earnings: Earning[] = [];
    for (const url of currentSeason.urls) {
      const html = await this.http.download(url.url);
      const rows = MojoParser.parse(html);
      const earningsToAdd = MojoParser.getEarnings(rows, moviesToGet);
      earnings = earnings.concat(earningsToAdd);
    }

    for (const earning of earnings) {
      const value = accounting.formatMoney(earning.gross, "$", 0);
      this.output.write(`${earning.movie.name}: ${value}\n`);
    }

    await this.sql.deleteEarningsForDate(dateStr);
    const addPromise = this.sql.addEarningsForMovies(earnings);

    this.output.write("\n");

    const ratingsPromises: Array<Promise<void>> = [];
    for (const movie of moviesToGet) {
      if (movie.metacriticUrl === undefined) {
        continue;
      }
      const rating = await this.getRating(movie.metacriticUrl, 0);
      if (rating === undefined) {
        continue;
      }
      ratingsPromises.push(this.sql.updateRatingForMovie(movie, rating));
      this.output.write(`${movie.name}: ${rating}%\n`);
    }

    await addPromise;
    await Promise.all(ratingsPromises);
  }

  private async getRating(url: string, attempt: number): Promise<number | undefined> {
    const sleep = async (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
    if (attempt >= 4) {
      return undefined;
    }
    await sleep(1000 * 2 ** attempt);

    try {
      const html = await this.http.download(url);
      return MetacriticParser.getRating(html);
    } catch (e) {
      return await this.getRating(url, attempt + 1);
    }
  }
}
