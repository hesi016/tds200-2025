import { ThemedText } from "@/components/ThemedText";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { StyleSheet, Switch, View } from "react-native";

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("darkMode");
      if (saved !== null) setDarkMode(saved === "true");
    })();
  }, []);

  const toggleDarkMode = async (value: boolean) => {
    setDarkMode(value);
    await AsyncStorage.setItem("darkMode", String(value));
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: darkMode ? "#0B0B0C" : "#FFFFFF" },
      ]}
    >
      <ThemedText
        type="title"
        style={{ color: darkMode ? "#ECEDEE" : "#11181C" }}
      >
        Settings
      </ThemedText>

      <Switch value={darkMode} onValueChange={toggleDarkMode} />

      <ThemedText
        style={{
          marginTop: 8,
          color: darkMode ? "#ECEDEE" : "#11181C",
        }}
      >
        Current theme:{" "}
        <ThemedText
          style={{
            fontWeight: "600",
            color: darkMode ? "#ECEDEE" : "#11181C",
          }}
        >
          {darkMode ? "dark" : "light"}
        </ThemedText>
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
});
