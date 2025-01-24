import { useCallback, useState } from "react";
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { Button, Image, ListItem } from "react-native-elements";
import ListItemSwipeable from "react-native-elements/dist/list/ListItemSwipeable";
import databaseService, { dbItem } from "./services/databaseService";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { Configuration, DefaultApi } from "./generated-sources/openapi";
import getTmdbService from "./services/tmdbService";
import { calcEpisodeOfTotal, mapToJson } from "./util/utilMethods";

export default function Index() {
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light"
      ? styles.lightThemeContainer
      : styles.darkThemeContainer;
  const db = new databaseService();
  db.initialize();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
  const [refreshData, setRefreshData] = useState(true);
  const tmdbApi = getTmdbService();

  useFocusEffect(
    useCallback(() => {
      setup();
    }, [!loading && refreshData])
  );

  async function setup() {
    setRefreshData(true);
    setLoading(true);
    try {
      await db.initialize();
      const result = await db.getAllRows();
      setItems(result);
    } catch (error) {
      console.error(error);
    } finally {
      setRefreshData(false);
      setLoading(false);
    }
  }

  async function removeItem(id: string) {
    try {
      await db.deleteRecord(id);
      setup();
    } catch (error) {
      console.error(error);
    }
  }

  async function updateUpNext(id: string) {
    try {
      await db.increaseUpNextCount(id);
      setup();
    } catch (error) {
      console.error(error);
    }
  }

  const buildListItem = (item: {
    id: string;
    title: string;
    upNextEpisode: number;
    currentSeason: number;
    totalEpisodes: number;
    upNextEpisodeOutOfTotal: number;
    imagePath: string;
    isVisible: boolean,
  }) => (
    <ListItemSwipeable
      containerStyle={themeContainerStyle}
      leftContent={
        <Button
          title="Remove"
          onPress={() => removeItem(item.id)}
          icon={{ name: "delete", color: "white" }}
          buttonStyle={{ minHeight: "100%" }}
        />
      }
      rightContent={
        <Button
          title="Update Up Next"
          onPress={() => updateUpNext(item.id)}
          icon={{ name: "arrow-upward", color: "white" }}
          buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
        />
      }
    >
      <ListItem.Content
        style={[styles.listItemContentContainer, themeContainerStyle]}
      >
        <Image style={styles.image} source={{ uri: item.imagePath }} />
        <View style={styles.listItemContentTextContainer}>
          <ListItem.Title style={[themeTextStyle, styles.headerText]}>{item.title}</ListItem.Title>
          <ListItem.Subtitle style={[themeTextStyle, styles.subHeaderText]}>
            Up Next Season {item.currentSeason} Episode {item.upNextEpisode}{" "}
            {"\n"}
            Episode {item.upNextEpisodeOutOfTotal} out of {item.totalEpisodes}{" "}
            episodes
          </ListItem.Subtitle>
        </View>
      </ListItem.Content>
    </ListItemSwipeable>
  );

  async function refreshDataFromTmdb() {
    items.forEach(async (item: dbItem) => {
      await tmdbApi.tvSeriesDetails(item.id).then((res) => {
        var tempSeasons = new Map();
        res.data.seasons?.forEach((season) => {
          if (season.season_number !== undefined && season.season_number > 0) {
            var tempEpisodes = [...Array(season.episode_count).keys()].map(
              (foo) => foo + 1
            );
            tempSeasons.set(season.season_number, tempEpisodes);
          }
        });
        item.seasonsInfo = mapToJson(tempSeasons);
        item.totalEpisodes = res.data.number_of_episodes ?? 0;
        item.imagePath = "https://image.tmdb.org/t/p/w500/" + res.data.poster_path;
        item.upNextEpisodeOutOfTotal = calcEpisodeOfTotal(tempSeasons, item.currentSeason, item.upNextEpisode);
      }).catch((ex) => console.log(ex));
    });
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={refreshData}
          onRefresh={refreshDataFromTmdb}
        />
      }
      data={items.filter(item => item.isVisible)}
      renderItem={({ item }) => buildListItem(item)}
      ItemSeparatorComponent={() => <View style={styles.seperator} />}
      contentContainerStyle={{ padding: 4, margin: 0 }}
    />
  );
}

const styles = StyleSheet.create({
  listItemContentContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "nowrap",
    alignItems: "flex-start",
    paddingStart: 0,
  },
  seperator: {
    height: 2,
  },
  image: {
    display: "flex",
    padding: 0,
    width: 80,
    height: 120,
  },
  lightThemeText: {
    color: "black",
  },
  darkThemeText: {
    color: "white",
  },
  listItemContentTextContainer: {
    height: "100%",
    paddingStart: 10,
    display: "flex",
    flex: 0.8,
    alignSelf: "center",
  },
  lightThemeContainer: {
    color: "white",
    backgroundColor: "white",
  },
  darkThemeContainer: {
    backgroundColor: "grey",
    color: "grey",
  },
  headerText: {
    fontSize: 25
  },
  subHeaderText: {
    fontSize: 14
  },
  show: {
    visibility: 'Visible'
  },
  hide: {
    visibility: 'Hidden'
  }
});
