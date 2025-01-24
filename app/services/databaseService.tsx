import * as SQLite from "expo-sqlite";

export default class databaseService {
  db: SQLite.SQLiteDatabase | null;

  constructor() {
    this.db = null;
  }

  // Initialize and set up the database
  async initialize() {
    this.db = await SQLite.openDatabaseAsync("upNextDb");
    await this.db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS upNext (
          id INTEGER PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          upNextEpisode INTEGER,
          currentSeason INTEGER,
          totalEpisodes INTEGER,
          upNextEpisodeOutOfTotal INTEGER,
          imagePath TEXT,
          seasonsInfo TEXT,
          type TEXT,
          isVisible BOOLEAN
        );
      `);
  }

  // Insert a new record
  async insertRecord(
    id: number,
    title: string,
    upNextEpisode: number,
    currentSeason: number,
    totalEpisodes: number,
    upNextEpisodeOutOfTotal: number,
    imagePath: string,
    seasonsInfo: string,
    type: string
  ) {
    const result = await this.db.runAsync(
      "INSERT INTO upNext (id, title, upNextEpisode, currentSeason, totalEpisodes, upNextEpisodeOutOfTotal, imagePath, seasonsInfo, type, isVisible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      id,
      title,
      upNextEpisode,
      currentSeason,
      totalEpisodes,
      upNextEpisodeOutOfTotal,
      imagePath,
      seasonsInfo,
      type,
      true
    );
    return result;
  }

  async updateRecord(
    id: number,
    title: string,
    upNextEpisode: number,
    currentSeason: number,
    totalEpisodes: number,
    upNextEpisodeOutOfTotal: number,
    imagePath: string,
    seasonsInfo: string,
    isVisible: boolean
  ) {
    const result = await this.db.runAsync(
      "UPDATE upNext SET title = ?, upNextEpisode = ?, currentSeason = ?, totalEpisodes = ?, upNextEpisodeOutOfTotal = ?, imagePath = ?, seasonsInfo = ?, isVisible: ? WHERE id = ?",
      title,
      upNextEpisode,
      currentSeason,
      totalEpisodes,
      upNextEpisodeOutOfTotal,
      imagePath,
      seasonsInfo,
      isVisible,
      id
    );
    return result;
  }

  async updateVisibility(id: number, isVisible: boolean) {
    await this.db.runAsync(
      "UPDATE upNext SET isVisible= ? WHERE id = ?",
      isVisible,
      id
    );
  }

  // Delete a record
  async deleteRecord(id: string) {
    await this.db.runAsync("DELETE FROM upNext WHERE id = ?", id);
  }

  // Get all rows
  async getAllRows() {
    const allRows = await this.db.getAllAsync("SELECT * FROM upNext");
    return allRows;
  }

  jsonToMap(jsonStr: string): Map<number, number[]> {
    const obj = JSON.parse(jsonStr);
    return new Map<number, number[]>(
      Object.entries(obj).map(([key, value]) => [Number(key), value])
    );
  }

  async increaseUpNextCount(id: string) {
    try {
      const result = await this.db.getFirstSync(
        "SELECT * FROM upNext WHERE id = ?",
        id
      );
      var item = result as dbItem;
      const seasonsMap = this.jsonToMap(item.seasonsInfo);

      // Increase upNextEpisode
      item.upNextEpisode += 1;
      item.upNextEpisodeOutOfTotal += 1;

      // Check if we need to move to the next season
      const episodesInCurrentSeason = seasonsMap.get(item.currentSeason) || [];
      if (item.upNextEpisode > episodesInCurrentSeason.length) {
        item.upNextEpisode = 1;
        item.currentSeason += 1;
      }

      //Update the record in the database
      await this.db.runAsync(
        "UPDATE upNext SET upNextEpisode = ?, currentSeason = ?, upNextEpisodeOutOfTotal = ? WHERE id = ?",
        item.upNextEpisode,
        item.currentSeason,
        item.upNextEpisodeOutOfTotal,
        id
      );
    } catch (e) {
      console.log(e);
    }
  }
}

export interface dbItem {
  id: number;
  title: string;
  upNextEpisode: number;
  currentSeason: number;
  totalEpisodes: number;
  upNextEpisodeOutOfTotal: number;
  imagePath: string;
  seasonsInfo: string;
  isVisible: boolean,
  type: string, 
  orderMarker: number
}
