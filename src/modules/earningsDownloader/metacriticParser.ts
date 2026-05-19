import * as cheerio from "cheerio";

export class MetacriticParser {

  private static cssPaths: string[] = ["div.hero-scores div[data-testid='product-score']:first-child span"];

  public static getRating(html: string): number | undefined {
    const $ = cheerio.load(html);
    for (const cssPath of this.cssPaths)
    {
      const metascoreElement = $(cssPath);

      if (!metascoreElement || metascoreElement.length === 0) {
        continue;
      }
  
      const score = parseInt(metascoreElement.eq(0).text(), 10);
      if (isNaN(score)) {
        continue;
      }
  
      return score;
    }

    return undefined;
  }
}
