import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Link } from "expo-router";
import { StyleSheet, View, Text } from "react-native";
import { Header as RNHeader, Icon } from "react-native-elements";

export default function Header() {
  const navigation = useNavigation();

  return (
    <RNHeader
      containerStyle={styles.headerContainer}
      rightComponent={
        <View style={styles.rightViewContainer}>
          <Link href="/components/filterScreen">
            <Icon
              name="filter-list"
              color="white"
              size={35}
              style={{ paddingEnd: 10 }}
            />
          </Link>
          <Link href="/components/addItemModal">
            <Icon name="add" color="white" size={35} />
          </Link>
        </View>
      }
      centerComponent={<Text style={styles.headerText}>Up Next</Text>}
      leftComponent={
        <View style={styles.leftViewContainer}>
          <Icon
            name="menu"
            onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())}
            color="white"
            size={35}
          />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: "#0091BD",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    paddingVertical: 20,
  },
  headerText: {
    color: "white",
    fontSize: 25,
  },
  rightViewContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  leftViewContainer: {
    alignItems: "center",
  },
});
