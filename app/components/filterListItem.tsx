import { useState } from "react";
import { View, StyleSheet, useColorScheme } from "react-native";
import { ListItem } from "react-native-elements";
import databaseService from "../services/databaseService";

interface FilterListItemProps {
  item: { title: string; type: string; isVisible: boolean, id: number };
}

const FilterListItem: React.FC<FilterListItemProps> = ({item}) => {
  const colorScheme = useColorScheme();
  const themeTextStyle =
    colorScheme === "light" ? styles.lightThemeText : styles.darkThemeText;
  const themeContainerStyle =
    colorScheme === "light"
      ? styles.lightThemeContainer
      : styles.darkThemeContainer;
  const db = new databaseService();
  db.initialize();
  const [checked, setChecked] = useState(false);
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
            containerStyle={[styles.listItemCheckboxContainer, themeContainerStyle]}
            textStyle={themeTextStyle}
            title={checked?"Hidden":"Visible"}
            onPress={() => {
              setChecked(!checked);
              db.updateVisibility(item.id, checked.valueOf());
            }}
            checked={checked}
            checkedColor={themeTextStyle.color}
            uncheckedColor={themeTextStyle.color}
          />
      </ListItem.Content>
    </ListItem>
  );
}

export default FilterListItem;

const styles = StyleSheet.create({
  listItemContentContainer: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    flex: 1,
    flexWrap: "nowrap",
    alignItems: "flex-start",
    paddingStart: 0,
  },
  lightThemeText: {
    color: "black",
  },
  darkThemeText: {
    color: "white",
  },
  listItemContentTextContainer: {
    height: "100%",
    paddingStart: 10,
    display: "flex",
    flex: 0.5,
    alignSelf: "flex-start",
    alignItems: "flex-start"
  },
  listItemCheckboxContainer: {
    height: "100%",
    paddingStart: 10,
    display: "flex",
    flex: 0.5,
    alignSelf: "flex-end",
    alignItems: "flex-end"
  },
  lightThemeContainer: {
    color: "white",
    backgroundColor: "white",
    borderWidth: 0,
  },
  darkThemeContainer: {
    backgroundColor: "grey",
    color: "grey",
    borderWidth: 0,
  },
  headerText: {
    fontSize: 25,
  },
});
