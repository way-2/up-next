import { useCallback, useEffect, useState } from "react";
import { Image, StyleSheet, useColorScheme, View } from "react-native";
import databaseService from "./services/databaseService";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { upNextTableItem } from "./models/dbModels";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import ListItemSwipeable from "react-native-elements/dist/list/ListItemSwipeable";
import { Button, ListItem } from "react-native-elements";

export default function Index() {
  const db = new databaseService();
  db.initialize();
  const [items, setItems] = useState<upNextTableItem[]>([]);
  const filteredItems: upNextTableItem[] =
    items.length > 0 ? items.filter((item) => item.isVisible) : [];
  const [refreshData, setRefreshData] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light"
      ? styles.lightThemeContainer
      : styles.darkThemeContainer;
    const themeImageBorderStyle =
    colorScheme === "light"
      ? styles.imageBorderLight
      : styles.imageBorderDark;

  useFocusEffect(
    useCallback(() => {
      console.log("refreshing useFocusEffect");
      getRowsFromDatabase();
    }, [])
  );

  useEffect(() => {
    if (refreshData) {
      console.debug(
        "Refreshing items from database, called from useEffect in index, refreshData is: {}, items before call: {}",
        refreshData,
        items
      );
      getRowsFromDatabase();
    }
  }, [refreshData]);

  function getRowsFromDatabase() {
    setIsLoading(true);
    db.getAllRows()
      .then((res) => {
        setItems(res as upNextTableItem[]);
        console.log("items retrieved from database: {}", items);
        setRefreshData(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setRefreshData(false);
      });
    setIsLoading(false);
  }

  async function deleteRow(item: upNextTableItem) {
    try {
      setIsLoading(true);
      await db.deleteRecord(item).finally(() => setRefreshData(true));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function increaseCount(item: upNextTableItem) {
    try {
      setIsLoading(true);
      await db.increaseUpNextCount(item);
      setRefreshData(true);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  }

  const buildListItem = (item: upNextTableItem) => {
    if (!item) return null;
    return (
      <ListItem.Swipeable
        containerStyle={themeContainerStyle}
        leftContent={
          <Button
            title="Remove"
            onPress={() => deleteRow(item)}
            icon={{ name: "delete", color: "white" }}
            buttonStyle={[styles.sideButtonStyle, { backgroundColor: '#006B94' }]}
          />
        }
        rightContent={
          <Button
            title="Increase Episode"
            onPress={() => increaseCount(item)}
            icon={{ name: "arrow-upward", color: "white" }}
            buttonStyle={[styles.sideButtonStyle, { backgroundColor: '#006B94' }]}
          />
        }
      >
        <ListItem.Content style={styles.listItemContentContainer}>
          <Image style={[styles.image,themeImageBorderStyle]} source={{ uri: item.imagePath }} />
          <View style={styles.listItemContentTextContainer}>
            <ListItem.Title adjustsFontSizeToFit numberOfLines={1} style={[themeTextStyle, styles.headerText]}>
              {item.title}
            </ListItem.Title>
            <ListItem.Subtitle adjustsFontSizeToFit numberOfLines={2} style={[themeTextStyle, styles.subHeaderText]}>
              Up Next S{item.currentSeason}E{item.upNextEpisode}{" "}
              {"\n"}
              Episode {item.upNextEpisodeOutOfTotal} out of {item.totalEpisodes}{" "}
              episodes
            </ListItem.Subtitle>
          </View>
        </ListItem.Content>
      </ListItem.Swipeable>
    );
  };

  return (
    <FlatList
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          onRefresh={() => setRefreshData(true)}
        />
      }
      data={filteredItems}
      renderItem={({ item }) => buildListItem(item)}
      ItemSeparatorComponent={() => <View style={styles.seperator} />}
      contentContainerStyle={{ padding: 4, margin: 0 }}
    />
  );
}

const styles = StyleSheet.create({
  seperator: {
    height: 3,
  },
  listItemContentContainer: {
    justifyContent: "flex-start",
    display: "flex",
    flexDirection: "row",
  },
  lightThemeText: {
    color: "black",
  },
  darkThemeText: {
    color: "white",
  },
  listItemContentTextContainer: {
    marginVertical: "auto",
    paddingHorizontal: 15,
    marginEnd: 12
  },
  lightThemeContainer: {
    backgroundColor: "#EEEEEE",
    borderWidth: 0,
  },
  darkThemeContainer: {
    backgroundColor: "#181818",
    borderWidth: 0,
  },
  headerText: {
    fontSize: 30,
  },
  image: {
    resizeMode: "center",
    width: 80,
    height: 120,
    borderWidth: 2,
    borderRadius: 4,
  },
  imageBorderLight: {
    borderColor: "#FFC107",
  },
  imageBorderDark: {
    borderColor: "#FFC107",
  },
  subHeaderText: {
    paddingTop: 4,
    fontSize: 20,
  },
  sideButtonStyle: {
    minHeight: "100%",
    flexWrap: 'wrap',
    alignContent: 'center'
  }
});
