import { SplashScreen, Stack, Link } from "expo-router";
import {
  DarkTheme,
  DefaultTheme,
  DrawerActions,
  ThemeProvider,
  useNavigation,
} from "@react-navigation/native";
import { Button, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useFonts } from "expo-font";
import { useColorScheme } from "./components/useColorScheme";
import { Header, Icon } from "react-native-elements";
import { SQLiteProvider } from "expo-sqlite";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "index",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const navigation = useNavigation();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <SQLiteProvider databaseName="upNextDb">
        <Header
          rightComponent={
            <View style={{flex:1, flexDirection:'row', alignItems: 'center'}}>
            <Link href="/components/filterScreen">
              <Icon name="filter-list" color="#fff" size={30} style={{paddingEnd:10}}/>
            </Link>
            <Link href="/components/addItemModal">
              <Icon name="add" color="#fff" size={30}/>
            </Link>
            </View>
          }
          centerComponent={{ text: "Up Next", style: styles.heading }}
          leftComponent={
            <Icon name="menu" onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} color="#fff" size={30} style={{alignItems: 'center'}} />
            // <FontAwesome.Button name="bars" onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} backgroundColor={"#96000000"}/>
          }
        />
        <GestureHandlerRootView style={{ flex: 1 }} >
              <Drawer>
                <Drawer.Screen
                  name="index"
                  options={{ headerShown: false, drawerLabel: "Home", title: "" }}
                />
                <Drawer.Screen
                  name="components/filterScreen"
                  options={{ headerShown: false, drawerLabel: "Filter", title: "" }}
                />
                <Drawer.Screen
                  name="components/licenseScreen"
                  options={{ headerShown: false, drawerLabel: "Licenses", title: "" }}
                />
                <Drawer.Screen
                  name="components/addItemModal"
                  options={{ headerShown: false , drawerItemStyle:{height:0}, title: "" }}
                />
                <Drawer.Screen
                  name="services/tmdbService"
                  options={{ headerShown: false , drawerItemStyle:{height:0}}}
                />
                <Drawer.Screen
                  name="services/databaseService"
                  options={{ headerShown: false , drawerItemStyle:{height:0}}}
                />
                <Drawer.Screen
                  name="components/license"
                  options={{ headerShown: false , drawerItemStyle:{height:0}}}
                />
                <Drawer.Screen
                  name="components/licenseListItem"
                  options={{ headerShown: false , drawerItemStyle:{height:0}}}
                />
                <Drawer.Screen
                  name="components/filterListItem"
                  options={{ headerShown: false , drawerItemStyle:{height:0}}}
                />
              </Drawer>
            </GestureHandlerRootView>
      </SQLiteProvider>
    </ThemeProvider>
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
  heading: {
    color: "white",
    fontSize: 22,
    fontWeight: "bold",
  },
});
