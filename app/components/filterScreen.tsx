import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import databaseService from "../services/databaseService";
import FilterListItem from "./filterListItem";

export default function filterScreen() {
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

  useFocusEffect(
    useCallback(() => {
      setup();
    }, [!loading && items.length==0])
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

  return (
    <View>
      <FlatList data={items} renderItem={({item}) => <FilterListItem item={item} />}/>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#397af8",
    marginBottom: 20,
    width: "100%",
    paddingVertical: 15,
  },
});
