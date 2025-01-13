import * as SQLite from 'expo-sqlite';

export default class databaseService {

    db: SQLite.SQLiteDatabase|null;

    constructor() {
        this.db = null;
      }
  
    // Initialize and set up the database
    async initialize() {
      this.db = await SQLite.openDatabaseAsync('upNextDb');
      await this.db.execAsync(`
        PRAGMA journal_mode = WAL;
        CREATE TABLE IF NOT EXISTS upNext (
          id TEXT PRIMARY KEY NOT NULL,
          title TEXT NOT NULL,
          upNextEpisode INTEGER,
          currentSeason INTEGER,
          totalEpisodes INTEGER,
          upNextEpisodeOutOfTotal INTEGER
        );
      `);
    }
  
    // Insert a new record
    async insertRecord(id: string, title: string, upNextEpisode: number, currentSeason: number, totalEpisodes: number, upNextEpisodeOutOfTotal: number) {
      const result = await this.db.runAsync('INSERT INTO upNext (id, title, upNextEpisode, currentSeason, totalEpisodes, upNextEpisodeOutOfTotal) VALUES (?, ?, ?, ?, ?, ?)', id, title, upNextEpisode, currentSeason, totalEpisodes, upNextEpisodeOutOfTotal);
      return result;
    }
  
    // Update a record
    // async updateRecord(id: number, title: string, upNextEpisode: number, currentSeason: number, totalEpisodes: number, upNextEpisodeOutOfTotal: number) {}
    //   await this.db.runAsync('UPDATE upNext SET intValue = ? WHERE value = ?', intValue, value);
    // }
  
    // Delete a record
    async deleteRecord(id: string) {
      console.log(id);
      await this.db.runAsync('DELETE FROM upNext WHERE id = ?', id);
    }
  
    // Get all rows
    async getAllRows() {
      const allRows = await this.db.getAllAsync('SELECT * FROM upNext');
      return allRows;
    }

    async getLastId() {
        const lastId = await this.db?.runAsync('SELECT max(id) FROM upNext')
        return lastId;
    }
  }

  interface UpNextItem {
    id: string;
    title: string;
    upNextEpisode: number;
    currentSeason: number;
    totalEpisodes: number;
    upNextEpisodeOutOfTotal: number;
  }
  