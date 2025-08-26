import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "react-native";
import React = require("react");

const TabsLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen
        name="home"
        options={{
          headerShown: false, 
          title: "Hjem",
          tabBarIcon: ({ color, focused }) => (
            // Ikon hentet fra https://icons.expo.fyi/Index, en ikondatabase for expo. Prøv dere fram med egne ikoner ved å følge lenken!
            <AntDesign name="home" size={24} color={color} />
          ),
          headerTitle(props) {
            return (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Hjemmeside
              </Text>
            );
          },
        }}
      />
      <Tabs.Screen
        name="authentication"
        options={{
          title: "Sign up",
          tabBarIcon: ({ color, focused }) => (
            // Ikon hentet fra https://icons.expo.fyi/Index, en ikondatabase for expo. Prøv dere fram med egne ikoner ved å følge lenken!
            <AntDesign name="user" size={24} color={color} />
          ),
          headerTitle(props) {
            return (
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "black",
                }}
              >
                Sign up
              </Text>
            );
          },
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
