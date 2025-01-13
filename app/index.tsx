import { useEffect, useState } from "react";
import { FlatList } from "react-native";
import { Button, ListItem } from "react-native-elements";
import ListItemSwipeable from "react-native-elements/dist/list/ListItemSwipeable";
import databaseService from "./services/databaseService";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";

export default function Index() {
  const db = new databaseService();
  db.initialize();
  const [loading, setLoading] = useState(false);
  const [items , setItems] = useState([]);
  const [refreshData, setRefreshData] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
    setup();
  }, [!loading && refreshData]));

  async function setup() {
    setRefreshData(true);
    setLoading(true);
    await db.initialize();
    await db.getAllRows().then((result) => {
      console.log(result)
      return setItems(result);
    }).catch((res) =>
      console.log(res)
    ).finally(() => 
      setRefreshData(false)
    );
    setLoading(false);
  }

  async function removeItem(id: string) {
    await db.deleteRecord(id).finally(() => 
      setup()
    );
  }

  function buildListItem(item: {
    id: string;
    title: string;
    upNextEpisode: number;
    currentSeason: number;
    totalEpisodes: number;
    upNextEpisodeOutOfTotal: number;
  }):
    | import("react").ReactElement<
        any,
        string | import("react").JSXElementConstructor<any>
      >
    | null {

    function updateUpNext(): void {
      throw new Error("Function not implemented.");
    }

    return (
      <ListItemSwipeable
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
            onPress={() => updateUpNext()}
            icon={{ name: "arrow-upward", color: "white" }}
            buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
          />
        }
      >
        <ListItem.Content>
          <ListItem.Title>{item.title}</ListItem.Title>
          <ListItem.Subtitle>Up Next Season {item.currentSeason} Episode {item.upNextEpisode} {"\n"}
            Episode {item.upNextEpisodeOutOfTotal} out of {item.totalEpisodes} episodes</ListItem.Subtitle>
        </ListItem.Content>
      </ListItemSwipeable>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => buildListItem(item)}
    />
  );
}
