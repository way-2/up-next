import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { StyleSheet, useColorScheme, View } from "react-native";
import databaseService from "../services/databaseService";
import { upNextTableItem } from "../models/dbModels";
import { FlatList, RefreshControl } from "react-native-gesture-handler";
import { ListItem } from "react-native-elements";

export default function filterScreen() {
  const db = new databaseService();
  db.initialize();
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState([]);
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
      setup();
    }, [!loading && items.length == 0])
  );

  async function setup() {
    setLoading(true);
    try {
      await db.initialize();
      const result = await db.getAllRows();
      setItems(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
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

  const buildListItem = (item: upNextTableItem) => {
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
  };

  return (
    <View>
      <FlatList
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={() => ""} />
        }
        data={items}
        renderItem={({ item }) => buildListItem(item)}
        ItemSeparatorComponent={() => <View style={styles.seperator} />}
        contentContainerStyle={{ padding: 4, margin: 0 }}
      />
    </View>
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
    backgroundColor: "#EEEEEE",
    borderWidth: 0,
  },
  darkThemeContainer: {
    backgroundColor: "#181818",
    borderWidth: 0,
  },
  headerText: {
    fontSize: 25,
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
    fontSize: 14,
  },
  show: {
    visibility: "Visible",
  },
  hide: {
    visibility: "Hidden",
  },
  sideButtonStyle: {
    minHeight: "100%",
    flexWrap: 'wrap',
    alignContent: 'center'
  }
});
