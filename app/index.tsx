import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { Button, Image, ListItem } from "react-native-elements";
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

  async function updateUpNext(id: string) {
    await db.increaseUpNextCount(id).finally(() => 
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
    imagePath: string;
  }):
    | import("react").ReactElement<
        any,
        string | import("react").JSXElementConstructor<any>
      >
    | null {

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
            onPress={() => updateUpNext(item.id)}
            icon={{ name: "arrow-upward", color: "white" }}
            buttonStyle={{ minHeight: "100%", backgroundColor: "red" }}
          />
        }
      >
        <ListItem.Content style={styles.listItemContentContainer}>
          <Image style={styles.image} source={{ uri: item.imagePath }} />
          <View style={styles.listItemContentTextContainer}>
            <ListItem.Title style={styles.listItemText}>{item.title}</ListItem.Title>
            <ListItem.Subtitle style={styles.listItemText}>Up Next Season {item.currentSeason} Episode {item.upNextEpisode} {"\n"}
              Episode {item.upNextEpisodeOutOfTotal} out of {item.totalEpisodes} episodes</ListItem.Subtitle>
          </View>
        </ListItem.Content>
      </ListItemSwipeable>
    );
  }

  return (
    <FlatList
      data={items}
      renderItem={({ item }) => buildListItem(item)}
      ItemSeparatorComponent={() => <View style={styles.seperator} />}
      contentContainerStyle={{padding: 4, margin: 0}}
      ListEmptyComponent={null}
      ListHeaderComponent={null}
      ListFooterComponent={null}
    />
  );
}

const styles = StyleSheet.create({
  listItemContentContainer: {
    width: "100%",
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    flexWrap: 'nowrap',
    alignItems: 'flex-start',
    paddingStart: 0
  },
  seperator: {
    height: 2,
  },
  image: {
    display: 'flex',
    padding: 0,
    width: 80,
    height: 120,
  },
  listItemContentTextContainer: {
    height: '100%',
    paddingStart: 10,
    display: 'flex',
    flex: .8,
    alignSelf: 'center'
  },
  listItemText: {
    
  }
})