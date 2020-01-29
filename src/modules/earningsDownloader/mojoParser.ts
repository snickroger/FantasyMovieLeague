import cheerio from "cheerio";
import { Earning } from "../../models/earning";
import { Movie } from "../../models/movie";

export class MojoParser {
  public static parse(html: string): Array<{ name: string, gross: number }> {
    const $ = cheerio.load(html);
    const rows = $("table.mojo-body-table").last().find("tr");
    const movies = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows.eq(i);
      const gross = this.currencyToInt(row.find("td").eq(5).text());
      if (isNaN(gross)) {
        continue;
      }

      movies.push({
        name: row.find("td").eq(1).text(),
        gross,
      });
    }

    return movies;
  }

  public static getEarnings(rows: Array<{ name: string, gross: number }>, movies: Movie[]) {
    const earnings = [];
    for (const row of rows) {
      const matchingMovies = movies.filter((m) => m.mappedName === row.name || m.name === row.name);
      if (matchingMovies.length === 0) {
        continue;
      }

      const movie = matchingMovies[0];
      const limit = movie.percentLimit || 100;
      const gross = row.gross * (limit / 100);

      const newEarning = new Earning();
      newEarning.gross = gross;
      newEarning.movie = movie;

      earnings.push(newEarning);
    }
    return earnings;
  }

  private static currencyToInt(strGross: string): number {
    return parseInt(strGross.replace(/\$|,/g, ""), 10);
  }
}
