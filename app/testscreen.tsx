
import { StyleSheet, View } from "react-native";
import React from "react";

export default function SettingsPage() {
    return (
    <View
      style={styles.container}
    >
      Settings
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center', 
    justifyContent: 'center',
  },
});