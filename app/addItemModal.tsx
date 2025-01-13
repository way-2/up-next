import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Button, Input } from 'react-native-elements';
import databaseService from './services/databaseService';
import { useState } from 'react';
import uuid from 'react-native-uuid';

export default function AddItemModalScreen() {
const db = new databaseService();
db.initialize();
const [title, setTitle] = useState("");
const [upNextEpisode, setUpNextEpisode] = useState(0);
const [currentSeason, setCurrentSeasion] = useState(0);
const [totalEpisodes, setTotalEpisodes] = useState(0);
const [upNextEpisodeOutOfTotal, setUpNextEpisodeOutOfTotal] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add an Item</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Input 
        label='Show Title'
        id='title'
        onChangeText={(value) => (setTitle(value))}
        />
        <Input
        label='Up Next Episode'
        id='upNextEpisode'
        onChangeText={(value) => (setUpNextEpisode(parseInt(value)))}
        />
        <Input
        label='Current Season'
        id='currentSeason'
        onChangeText={(value) => (setCurrentSeasion(parseInt(value)))}
        />
        <Input
        label='Total Episodes'
        id='totalEpisodes'

        onChangeText={(value) => (setTotalEpisodes(parseInt(value)))}
        />
        <Input
        label='Up Next Episode out of Total'
        id='upNextEpisodeOutOfTotal'
        onChangeText={(value) => (setUpNextEpisodeOutOfTotal(parseInt(value)))}
        />
        <Button
        title="Add Show"
        onPress={() => {
          var id = uuid.v4().toString();
            console.log(id, title, upNextEpisode, currentSeason, totalEpisodes, upNextEpisodeOutOfTotal)
            db.insertRecord(id, title, upNextEpisode, currentSeason, totalEpisodes, upNextEpisodeOutOfTotal).then((res) =>
                console.log(res)
            ).catch((res) =>
                console.log(res)
            )
        }}
        />

      {/* Use a light status bar on iOS to account for the black space above the modal */}
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
