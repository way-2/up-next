import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View, Text } from "react-native";
import { Button, Icon, Input } from "react-native-elements";
import databaseService from "./services/databaseService";
import { useState } from "react";
import { searchTv, tvInfo } from "./services/tmdbService";
import { TvResult } from "moviedb-promise";
import { Dropdown } from "react-native-element-dropdown";
import { useFocusEffect } from "@react-navigation/native";
import React from "react";
import { useDebounce } from "use-debounce";
import WheelPicker from "@quidone/react-native-wheel-picker";

export default function AddItemModalScreen() {
  const db = new databaseService();
  db.initialize();
  const [id, setId] = useState("");
  const [title, setTitle] = useState("");
  const [upNextEpisode, setUpNextEpisode] = useState(0);
  const [currentSeason, setCurrentSeason] = useState(0);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [upNextEpisodeOutOfTotal, setUpNextEpisodeOutOfTotal] = useState(0);
  const [searchResults, setSearchResults] = useState<TvResult[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
  const [seasonsInfo, setSeasonsInfo] = useState<Map<number, number[]>>(new Map());
  const [imagePath, setImagePath] = useState("");
  const pickerSeasons = Array.from(seasonsInfo.keys()).map((index) => ({
    value: index,
    label: index.toString(),
  }));
  const pickerEpisodes = Array.from(seasonsInfo.get(currentSeason) || []).map(
    (index) => ({
      value: index,
      label: index.toString(),
    })
  );

  useFocusEffect(
    React.useCallback(() => {
      if (debouncedSearchTerm) {
        handleSearch();
      }
    }, [debouncedSearchTerm])
  );

  async function handleSearch() {
    if (debouncedSearchTerm) {
      // Perform your search logic here using the 'text' variable
      const res = await searchTv({ query: debouncedSearchTerm });
      setSearchResults(res);
    }
  }

  async function handleSelect(item: { id: React.SetStateAction<string>; name: React.SetStateAction<string>; }) {
    setId(item.id);
    setTitle(item.name);
    const res = await tvInfo(item.id);
    var tempSeasons = new Map();
    res.seasons?.forEach((season) => {
      if (season.season_number !== undefined && season.season_number > 0) {
        var tempEpisodes = [...Array(season.episode_count).keys()].map(
          (foo) => foo + 1
        );
        tempSeasons.set(season.season_number, tempEpisodes);
      }
    });
    setSeasonsInfo(tempSeasons);
    setTotalEpisodes(res.number_of_episodes ?? 0);
    setImagePath("https://image.tmdb.org/t/p/w500/" + res.poster_path);
  }

  function calcEpisodeOfTotal() {
    let epOfTotal = 0;
    for (let [season, episodes] of seasonsInfo.entries()) {
      if (season < currentSeason) {
        epOfTotal += episodes.length;
      } else if (season === currentSeason) {
        epOfTotal += upNextEpisode;
        break;
      }
    }
    return epOfTotal;
  }

  function mapToJson(map: Map<any, any>) {
    return JSON.stringify(Object.fromEntries(map));
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add an Item</Text>
      <Dropdown
        style={styles.dropdown}
        placeholderStyle={styles.placeholderStyle}
        selectedTextStyle={styles.selectedTextStyle}
        inputSearchStyle={styles.inputSearchStyle}
        iconStyle={styles.iconStyle}
        data={searchResults}
        search={true}
        maxHeight={300}
        labelField="name"
        valueField="id"
        placeholder="Find Show..."
        searchPlaceholder="Search..."
        renderLeftIcon={() => <Icon name="search" />}
        onChange={(item) => {
          handleSelect(item);
        }}
        onChangeText={(search) => {
          setSearchTerm(search);
        }}
      />
      <View style={styles.twoColumnContainer}>
        <View style={styles.columnContainer}>
          <Text>Current Season</Text>
          <WheelPicker
            width={50}
            style={styles.wheelPicker}
            overlayItemStyle={styles.wheelPickerOverlay}
            visibleItemCount={3}
            data={pickerSeasons}
            onValueChanged={(value) => {
              setCurrentSeason(parseInt(value.item.label));
              setUpNextEpisodeOutOfTotal(calcEpisodeOfTotal());
            }}
          />
        </View>
        <View style={styles.columnContainer}>
          <Text>Current Episode</Text>
          <WheelPicker
            width={50}
            style={styles.wheelPicker}
            overlayItemStyle={styles.wheelPickerOverlay}
            visibleItemCount={3}
            data={pickerEpisodes}
            onValueChanged={(value) => {
              setUpNextEpisode(parseInt(value.item.label));
              setUpNextEpisodeOutOfTotal(calcEpisodeOfTotal());
            }}
          />
        </View>
      </View>
      <Button
        containerStyle={styles.container}
        buttonStyle={styles.buttonStyle}
        title="Add Show"
        onPress={() => {
          db.insertRecord(
            id,
            title,
            upNextEpisode,
            currentSeason,
            totalEpisodes,
            upNextEpisodeOutOfTotal,
            imagePath,
            mapToJson(seasonsInfo)
          )
            .then((res) => console.log(res))
            .catch((res) => console.log(res));
        }}
      />
      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
    alignItems: "center",
  },
  title: {
    paddingTop: 8,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  dropdown: {
    width: "95%", // Adjust the width as needed
    margin: 16,
    height: 50,
    borderBottomColor: "grey",
    borderBottomWidth: 1,
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  twoColumnContainer: {
    paddingTop: 20,
    display: "flex",
    flexDirection: "row",
    flex: 1,
    width: "95%",
    height: 50,
  },
  columnContainer: {
    textAlign: "center",
    alignItems: "center",
    flex: 0.5,
    paddingHorizontal: 8,
  },
  wheelPicker: {},
  wheelPickerOverlay: {},
  buttonStyle: {
    width: 100,
  },
});
