import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "react-native";
import React from "react";

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="home" size={24} color={color} />
          ),
          headerTitle(props) {
            return (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                Hjemmeside
              </Text>
            );
          },
        }}
      />
      <Tabs.Screen
        name="profilePage"
        options={{
          title: "Profil",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="user" size={24} color={color} />
          ),
          headerTitle(props) {
            return (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "blue",
                }}
              >
                Profilside
              </Text>
            );
          },
        }}
      />
      <Tabs.Screen
        name="authenticationPage"
        options={{
          title: "Authentication",
          tabBarIcon: ({ color, focused }) => (
            <AntDesign name="setting" size={24} color={color} />
          ),
          headerTitle(props) {
            return (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "green",
                }}
              >
                Authentication
              </Text>
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
