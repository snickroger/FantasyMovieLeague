import assert from "assert";
import "mocha";
import fs from "fs";
import path from "path";
import { MojoParser } from "../src/modules/earningsDownloader/mojoParser";
import { MetacriticParser } from "../src/modules/earningsDownloader/metacriticParser";
import { MockSql } from "./mocks/mockSql";
import { Standings } from "../src/modules/standings/standings";
import { Season } from "../src/models/season";
import { Team } from "../src/models/team";
import { StandingsDisplay } from "../src/modules/standings/standingsDisplay";

describe('revenues', function () {
  describe('MojoParser', function () {
    let filePath = path.join(__dirname, "mocks/data/mojoResponse.txt");
    let html = fs.readFileSync(filePath).toString();
    let movies = MojoParser.parse(html);

    it('has 88 movies', function () {
      assert.equal(movies.length, 81);
    });

    it('has Thor in position 68', function () {
      assert.equal(movies[68].name, "Thor: Ragnarok");
    });

    it('has Star Wars with a $278M gross', function () {
      assert.equal(movies[2].gross, 278710009);
    });

    it('has 3 movies after filtering', function () {
      let rows = MojoParser.getEarnings(movies, [
        { name: "Thor: Ragnarok" },
        { name: "Star Wars: The Last Jedi" },
        { name: "Coco" }] as any);
      assert.equal(rows.length, 3);
    });
  });

  describe('MetacriticParser', function () {
    let filePath = path.join(__dirname, "mocks/data/mcResponse1.txt");
    let noRatingfilePath = path.join(__dirname, "mocks/data/mcResponse2.txt");
    let html = fs.readFileSync(filePath).toString();
    let noRatingHtml = fs.readFileSync(noRatingfilePath).toString();

    it('has Widows with a 86% rating', function () {
      let rating = MetacriticParser.getRating(html);
      assert.equal(rating, 86);
    });
    it('has Vice with no rating', function () {
      let rating = MetacriticParser.getRating(noRatingHtml);
      assert.equal(rating, null);
    });
  });

  describe('Standings (README Example)', function () {
    const mockSql = new MockSql(0);
    let season: Season;
    let team: Team;
    let sortedStandings: StandingsDisplay[];

    before(async function () {
      season = await mockSql.getSelectedSeason("dummy");
      team = await mockSql.getTeam(1);
      sortedStandings = Standings.getStandingsDisplay(season.movies, team.players, 0);
    });

    it('has Bob in 1st with $72,000,000', function () {
      assert.equal(sortedStandings[0].name, "Bob");
      assert.equal(sortedStandings[0].total, 72000000);
    });

    it('has Eve in 2nd with $50,400,000', function () {
      assert.equal(sortedStandings[1].name, "Eve");
      assert.equal(sortedStandings[1].total, 50400000);
    });

    it('has Alice in 3rd with $36,000,000', function () {
      assert.equal(sortedStandings[2].name, "Alice");
      assert.equal(sortedStandings[2].total, 36000000);
    });

    it('has David in 4th with $21,600,000', function () {
      assert.equal(sortedStandings[3].name, "David");
      assert.equal(sortedStandings[3].total, 21600000);
    });

    it('has Charlie in 5th with $0', function () {
      assert.equal(sortedStandings[4].name, "Charlie");
      assert.equal(sortedStandings[4].total, 0);
    });
  });

  describe('Standings (More)', function () {
    const mockSql = new MockSql(1);
    let season: Season;
    let team: Team;
    let sortedStandings: StandingsDisplay[];

    before(async function () {
      season = await mockSql.getSelectedSeason("dummy");
      team = await mockSql.getTeam(1);
      sortedStandings = Standings.getStandingsDisplay(season.movies, team.players, 5000000);
    });

    it('has Player 4 in last', function () {
      assert.equal(sortedStandings[sortedStandings.length - 1].name, "Player 4");
    });

    it('has Player 4 with Bonus 1', function () {
      assert(sortedStandings[sortedStandings.length - 1].hasBonus1);
    });

    it('has Player 2 in 1st with $78,000,000', function () {
      assert.equal(sortedStandings[0].name, "Player 2");
      assert.equal(sortedStandings[0].total, 78000000);
    });

    it('has Player 3 in 2nd with $50,000,000', function () {
      assert.equal(sortedStandings[1].name, "Player 3");
      assert.equal(sortedStandings[1].total, 50000000);
    });

    it('has Player 1 in 3rd with $40,000,000', function () {
      assert.equal(sortedStandings[2].name, "Player 1");
      assert.equal(sortedStandings[2].total, 40000000);
    });

    it('has Player 4 in 4th with $37,000,000', function () {
      assert.equal(sortedStandings[3].name, "Player 4");
      assert.equal(sortedStandings[3].total, 37000000);
    });
  });
})