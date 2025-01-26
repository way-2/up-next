import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { View } from "react-native";
import databaseService from "../services/databaseService";
import FlatList from "./flatListComponent";

export default function filterScreen() {
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
      <FlatList items={items} page={"filter"} refreshing={false} onRefresh={()=>('')} />
    </View>
  );
}