import * as SQLite from "expo-sqlite";
import { upNextTableItem } from "../models/dbModels";
import { jsonToMap } from "../util/utilMethods";

export default class databaseService {
  db: SQLite.SQLiteDatabase | null;

  constructor() {
    this.db = null;
  }

  // Initialize and set up the database
  async initialize() {
    this.db = await SQLite.openDatabaseSync("upNextDb");
    await this.db.execSync(`
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
  async insertRecord(item: upNextTableItem) {
    return new Promise((resolve, reject) => {
      this.db?.withTransactionAsync(async () => {
        await this.db
          ?.runAsync(
            "INSERT INTO upNext (id, title, upNextEpisode, currentSeason, totalEpisodes, upNextEpisodeOutOfTotal, imagePath, seasonsInfo, type, isVisible) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
            item.id,
            item.title,
            item.upNextEpisode,
            item.currentSeason,
            item.totalEpisodes,
            item.upNextEpisodeOutOfTotal,
            item.imagePath,
            item.seasonsInfo,
            item.type,
            item.isVisible
          )
          .then((result: unknown) => resolve(result))
          .catch((error: any) => reject(error));
      });
    });
  }

  async updateRecord(item: upNextTableItem): Promise<upNextTableItem> {
    return new Promise((resolve, reject) => {
      this.db?.withTransactionAsync(async () => {
        await this.db
          ?.runAsync(
            "UPDATE upNext SET title = ?, upNextEpisode = ?, currentSeason = ?, totalEpisodes = ?, upNextEpisodeOutOfTotal = ?, imagePath = ?, seasonsInfo = ?, type = ?, isVisible = ? WHERE id = ?",
            item.title,
            item.upNextEpisode,
            item.currentSeason,
            item.totalEpisodes,
            item.upNextEpisodeOutOfTotal,
            item.imagePath,
            item.seasonsInfo,
            item.isVisible,
            item.id
          )
          .then((result: unknown) => resolve(result as upNextTableItem))
          .catch((error: any) => reject(error));
      });
    });
  }

  async updateVisibility(item: upNextTableItem) {
    return new Promise((resolve, reject) => {
      this.db?.withTransactionAsync(async () => {
        await this.db
          ?.runAsync(
            "UPDATE upNext SET isVisible= ? WHERE id = ?",
            item.isVisible,
            item.id
          )
          .then((result: unknown) => resolve(result))
          .catch((error: any) => reject(error));
      });
    });
  }

  // Delete a record
  async deleteRecord(item: upNextTableItem) {
    return new Promise((resolve, reject) => {
      this.db?.withTransactionAsync(async () => {
        await this.db
          ?.runAsync("DELETE FROM upNext WHERE id = ?", item.id)
          .then((result: unknown) => resolve(result))
          .catch((error: any) => reject(error));
      });
    });
  }

  // Get all rows
  async getAllRows() {
    return new Promise<upNextTableItem[]>((resolve, reject) => {
      this.db
        ?.getAllAsync("SELECT * FROM upNext ORDER BY title ASC")
        .then((result: unknown) => {
          resolve(result);
        })
        .catch((error: any) => reject(error));
    });
  }

  async increaseUpNextCount(item: upNextTableItem): Promise<upNextTableItem> {
    const seasonsMap = jsonToMap(item.seasonsInfo);

    // Increase upNextEpisode
    item.upNextEpisode += 1;
    item.upNextEpisodeOutOfTotal += 1;

    // Check if we need to move to the next season
    const episodesInCurrentSeason = seasonsMap.get(item.currentSeason) || [];
    if (item.upNextEpisode > episodesInCurrentSeason.length) {
      item.upNextEpisode = 1;
      item.currentSeason += 1;
    }

    // Update the record in the database
    return new Promise((resolve, reject) => {
      this.db?.withTransactionAsync(async () => {
        await this.db
          ?.runAsync(
            "UPDATE upNext SET upNextEpisode = ?, currentSeason = ?, upNextEpisodeOutOfTotal = ? WHERE id = ?",
            [
              item.upNextEpisode,
              item.currentSeason,
              item.upNextEpisodeOutOfTotal,
              item.id,
            ]
          )
          .then((result: unknown) => resolve(result))
          .catch((error) => reject(error));
      });
    });
  }
}
