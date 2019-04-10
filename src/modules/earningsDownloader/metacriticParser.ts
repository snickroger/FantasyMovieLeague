import cheerio from "cheerio";

export class MetacriticParser {
  public static getRating(html: string): number | undefined {
    const $ = cheerio.load(html);
    const metascoreElement = $("a.metascore_anchor span");

    if (!metascoreElement || metascoreElement.length === 0) {
      return undefined;
    }

    const score = parseInt(metascoreElement.eq(0).text(), 10);
    if (isNaN(score)) {
      return undefined;
    }

    return score;
  }
}
