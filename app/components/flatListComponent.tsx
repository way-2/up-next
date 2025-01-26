import {
  RefreshControl,
  FlatList as RnFlatList,
  StyleSheet,
  useColorScheme,
  View,
} from "react-native";
import { upNextTableItem } from "../models/dbModels";
import databaseService from "../services/databaseService";
import ListItemSwipeable from "react-native-elements/dist/list/ListItemSwipeable";
import { Button, Image, ListItem } from "react-native-elements";
import { useEffect, useState } from "react";

interface FlatListProps {
  items: upNextTableItem[];
  page: string;
  refreshing: boolean;
  onRefresh: () => void;
}

export default function FlatList(props: FlatListProps) {
  const colorScheme = useColorScheme();
  const db = new databaseService();
  db.initialize();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light"
      ? styles.lightThemeContainer
      : styles.darkThemeContainer;
  const [items, setItems] = useState<upNextTableItem[]>(props.items);

  useEffect(() => {
    setItems(props.items);
  }, [props.items]);

  async function deleteRow(item: upNextTableItem) {
    try {
      await db.deleteRecord(item);
      props.onRefresh();
    } catch (error) {
      console.error(error);
    }
  }

  async function increaseCount(item: upNextTableItem) {
    try {
      await db.increaseUpNextCount(item);
      props.onRefresh();
    } catch (error) {
      console.error(error);
    }
  }

  async function toggleVisibility(item: upNextTableItem) {
    try {
      item.isVisible = !item.isVisible;
      await db.updateVisibility(item);
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.id === item.id ? { ...i, isVisible: item.isVisible } : i
        )
      );
    } catch (error) {
      console.error(error);
    }
  }

  const buildListItem = (item: upNextTableItem, page: string) => {
    if (page === "home") {
      return (
        <ListItemSwipeable
          containerStyle={themeContainerStyle}
          leftContent={
            <Button
              title="Remove"
              onPress={() => deleteRow(item)}
              icon={{ name: "delete", color: "white" }}
              buttonStyle={{ minHeight: "100%" }}
            />
          }
          rightContent={
            <Button
              title="Increase Episode"
              onPress={() => increaseCount(item)}
              icon={{ name: "arrow-upward", color: "white" }}
              buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
            />
          }
        >
          <ListItem.Content style={styles.listItemContentContainer}>
            <Image style={styles.image} source={{ uri: item.imagePath }} />
            <View style={styles.listItemContentTextContainer}>
              <ListItem.Title style={[themeTextStyle, styles.headerText]}>
                {item.title}
              </ListItem.Title>
              <ListItem.Subtitle style={[themeTextStyle, styles.subHeaderText]}>
                Up Next Season {item.currentSeason} Episode {item.upNextEpisode}{" "}
                {"\n"}
                Episode {item.upNextEpisodeOutOfTotal} out of{" "}
                {item.totalEpisodes} episodes
              </ListItem.Subtitle>
            </View>
          </ListItem.Content>
        </ListItemSwipeable>
      );
    } else {
      return (
        <ListItem containerStyle={themeContainerStyle}>
          <ListItem.Content
            style={[styles.listItemContentContainer, themeContainerStyle]}
          >
            <View
              style={[styles.listItemContentTextContainer, themeContainerStyle]}
            >
              <ListItem.Title style={[themeTextStyle, styles.headerText]}>
                {item.title}
              </ListItem.Title>
            </View>
            <ListItem.CheckBox
              containerStyle={[
                styles.listItemCheckboxContainer,
                themeContainerStyle,
              ]}
              textStyle={themeTextStyle}
              title={!item.isVisible ? "Hidden" : "Visible"}
              onPress={() => {
                toggleVisibility(item);
              }}
              checked={!item.isVisible}
              checkedColor={themeTextStyle.color}
              uncheckedColor={themeTextStyle.color}
            />
          </ListItem.Content>
        </ListItem>
      );
    }
  };

  return (
    <RnFlatList
      refreshControl={
        <RefreshControl
          refreshing={props.refreshing}
          onRefresh={props.onRefresh}
        />
      }
      data={
        props.page === "home" ? items.filter((item) => item.isVisible) : items
      }
      renderItem={({ item }) => buildListItem(item, props.page)}
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
    flex: 1,
  },
  lightThemeText: {
    color: "black",
  },
  darkThemeText: {
    color: "white",
  },
  listItemContentTextContainer: {
    paddingStart: 10,
    flex: 0.7,
    marginVertical: "auto",
  },
  listItemCheckboxContainer: {
    height: "100%",
    paddingStart: 10,
    display: "flex",
    flex: 0.5,
    alignSelf: "flex-end",
    alignItems: "flex-end",
  },
  lightThemeContainer: {
    color: "white",
    backgroundColor: "white",
    borderWidth: 0,
  },
  darkThemeContainer: {
    backgroundColor: "#7F949E",
    borderWidth: 0,
  },
  headerText: {
    fontSize: 25,
  },
  image: {
    flex: 0.3,
    width: 80,
    height: 120,
    borderColor: "grey",
    borderWidth: 4,
    borderRadius: 6,
  },
  subHeaderText: {
    fontSize: 14,
  },
  show: {
    visibility: "Visible",
  },
  hide: {
    visibility: "Hidden",
  },
});
