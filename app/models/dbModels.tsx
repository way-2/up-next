export interface upNextTableItem {
    id: number;
    title: string;
    upNextEpisode: number;
    currentSeason: number;
    totalEpisodes: number;
    upNextEpisodeOutOfTotal: number;
    imagePath: string;
    seasonsInfo: string;
    isVisible: boolean,
    type: string
  }