import Drawer from "expo-router/drawer";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const screens = [
  { name: "index", options: { headerShown: false, drawerLabel: "Home", title: "" } },
  { name: "components/filterScreen", options: { headerShown: false, drawerLabel: "Filter", title: "" } },
  { name: "components/licenseScreen", options: { headerShown: false, drawerLabel: "Licenses", title: "" } },
  { name: "services/tmdbService", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "services/databaseService", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "components/addItemModal", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "components/license", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "components/licenseListItem", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "components/filterListItem", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "components/header", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "components/navigationDrawer", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "components/useColorScheme", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "util/utilMethods", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "generated-sources/openapi/api", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "generated-sources/openapi/base", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "generated-sources/openapi/common", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "generated-sources/openapi/index", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
  { name: "generated-sources/openapi/configuration", options: { headerShown: false, drawerItemStyle: { height: 0 } } },
];

export default function NavigationDrawer() {
  return (
    <GestureHandlerRootView>
      <Drawer>
        {screens.map((screen) => (
          <Drawer.Screen key={screen.name} name={screen.name} options={screen.options} />
        ))}
      </Drawer>
    </GestureHandlerRootView>
  );
}
