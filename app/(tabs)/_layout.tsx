import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "react-native";

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
          headerTitle: () => (
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: "black",
              }}
            >
              Hjemmeside
            </Text>
          ),
        }}
        />
      <Tabs.Screen
        name="authentication"
        options={{
          title: "Logg inn",
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
