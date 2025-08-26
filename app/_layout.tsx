import { Drawer } from "expo-router/drawer";
import { Pressable } from "react-native";
import React = require("react");
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer >
      <Drawer.Screen
          name="index"
          options={{
            drawerItemStyle: { display: "none" }, 
            headerShown: false, 
          }}
        />
        <Drawer.Screen
          name="(tabs)"
          options={{
            title: "Home",
          }}
        />
        <Drawer.Screen 
          name="profile" 
          options={{ 
            title: 'Profile' ,
          }} 
        />
        <Drawer.Screen
          name="settings"
          options={{
            title: "Settings",
          }}
        />
        <Drawer.Screen
          name="testscreen"
          options={{
            title: "Test",
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
