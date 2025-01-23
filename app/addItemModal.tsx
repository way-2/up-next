import { StatusBar } from "expo-status-bar";
import { Platform, StyleSheet, View, Text, useColorScheme } from "react-native";
import { Button, Icon } from "react-native-elements";
import databaseService from "./services/databaseService";
import { useState } from "react";
import { Dropdown } from "react-native-element-dropdown";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React from "react";
import { useDebounce } from "use-debounce";
import WheelPicker from "@quidone/react-native-wheel-picker";
import getTmdbService from "./services/tmdbService";
import { calcEpisodeOfTotal, mapToJson } from "./util/utilMethods";

export default function AddItemModalScreen() {
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light"
      ? styles.lightThemeContainer
      : styles.darkThemeContainer;
  const db = new databaseService();
  db.initialize();
  const tmdbApi = getTmdbService();
  const navigation = useNavigation();
  const [id, setId] = useState(0);
  const [title, setTitle] = useState("");
  const [upNextEpisode, setUpNextEpisode] = useState(1);
  const [currentSeason, setCurrentSeason] = useState(1);
  const [totalEpisodes, setTotalEpisodes] = useState(0);
  const [upNextEpisodeOutOfTotal, setUpNextEpisodeOutOfTotal] = useState(0);
  const [searchResults, setSearchResults] = useState<Object[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 200);
  const [seasonsInfo, setSeasonsInfo] = useState<Map<number, number[]>>(
    new Map()
  );
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
      await tmdbApi.searchTv(debouncedSearchTerm).then((res) => {
        console.log(res);
        if (res.status === 200 && res.data.results != undefined) {
          setSearchResults(res.data.results);
        }
      }).catch((ex) => console.log(ex));
    }
  }

  async function handleSelect(item: {
    id: number;
    name: string;
  }) {
    setId(item.id);
    setTitle(item.name);
    const res = await tmdbApi.tvSeriesDetails(item.id);
    var tempSeasons = new Map();
    res.data.seasons?.forEach((season) => {
      if (season.season_number !== undefined && season.season_number > 0) {
        var tempEpisodes = [...Array(season.episode_count).keys()].map(
          (foo) => foo + 1
        );
        tempSeasons.set(season.season_number, tempEpisodes);
      }
    });
    setSeasonsInfo(tempSeasons);
    setTotalEpisodes(res.data.number_of_episodes ?? 0);
    setImagePath("https://image.tmdb.org/t/p/w500/" + res.data.poster_path);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add an Item</Text>
      <Dropdown
        style={[styles.dropdown, themeContainerStyle]}
        placeholderStyle={[styles.placeholderStyle, themeTextStyle]}
        selectedTextStyle={[styles.selectedTextStyle, themeTextStyle]}
        inputSearchStyle={[styles.inputSearchStyle, themeTextStyle]}
        containerStyle={themeContainerStyle}
        itemContainerStyle={themeContainerStyle}
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
            style={[styles.wheelPicker, themeContainerStyle]}
            overlayItemStyle={[styles.wheelPickerOverlay, themeTextStyle]}
            itemTextStyle={themeTextStyle}
            visibleItemCount={3}
            data={pickerSeasons}
            onValueChanged={(value) => {
              setCurrentSeason(parseInt(value.item.label));
              setUpNextEpisodeOutOfTotal(calcEpisodeOfTotal(seasonsInfo, currentSeason, upNextEpisode));
            }}
          />
        </View>
        <View style={styles.columnContainer}>
          <Text>Current Episode</Text>
          <WheelPicker
            width={50}
            style={[styles.wheelPicker, themeContainerStyle]}
            overlayItemStyle={[styles.wheelPickerOverlay, themeTextStyle]}
            itemTextStyle={themeTextStyle}
            visibleItemCount={3}
            data={pickerEpisodes}
            onValueChanged={(value) => {
              setUpNextEpisode(parseInt(value.item.label));
              setUpNextEpisodeOutOfTotal(calcEpisodeOfTotal(seasonsInfo, currentSeason, upNextEpisode));
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
            .catch((res) => console.log(res))
            .finally(() => navigation.goBack());
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
  wheelPicker: {
    borderRadius: 10,
  },
  wheelPickerOverlay: {
    borderRadius: 10,
    borderWidth: 4,
    opacity: 0.25,
  },
  buttonStyle: {
    width: 100,
  },
  lightThemeText: {
    color: "black",
    borderColor: "black",
  },
  darkThemeText: {
    color: "white",
    borderColor: "white",
  },
  lightThemeContainer: {
    color: "white",
    backgroundColor: "white",
  },
  darkThemeContainer: {
    backgroundColor: "grey",
    color: "grey",
  },
});
