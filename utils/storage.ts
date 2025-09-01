import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Device from "expo-device";

export const Storage = {

  getAllKeys: async (): Promise<string[]> => {
    if (Platform.OS === "web" || (Platform.OS === "ios" && !Device.isDevice)) {
      const keys = await AsyncStorage.getAllKeys();
      return keys || [];
    } else {
      const allKeysStr = await SecureStore.getItemAsync("allKeys");
      if (allKeysStr) {
        const keys = JSON.parse(allKeysStr);
        return Array.isArray(keys) ? keys : [];
      }
      return [];
    }
  },


  clearStorage: async (): Promise<void> => {
  try {
    if (Platform.OS === "web" || (Platform.OS === "ios" && !Device.isDevice)) {
      // AsyncStorage for web or iOS simulator
        const keys = await AsyncStorage.getAllKeys();
        if (keys.length === 0) {
          console.log("Storage is already empty");
        } else {
          await AsyncStorage.clear();
          console.log("AsyncStorage cleared");
        }
    } else {
      // SecureStore for physical devices
      const allKeys = await SecureStore.getItemAsync("allKeys"); 
      // SecureStore doesn’t support "clear()", you need to track keys
      if (allKeys) {
        const keys = JSON.parse(allKeys);
        for (const key of keys) {
          await SecureStore.deleteItemAsync(key);
        }
        await SecureStore.deleteItemAsync("allKeys");
      }
      console.log("SecureStore cleared");
    }
  } catch (error) {
    console.error("Failed to clear storage:", error);
  }
},


  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === "web" || (Platform.OS === "ios" && !Device.isDevice)) {
        await AsyncStorage.setItem(key, value);
      } else {
        await SecureStore.setItemAsync(key, value);
      }
    } catch (error) {
      console.error(`Failed to set item [${key}]:`, error);
    }
  },

  getItem: async (key: string): Promise<string | null> => {
    try {
      if (Platform.OS === "web" || (Platform.OS === "ios" && !Device.isDevice)) {
        return await AsyncStorage.getItem(key);
      } else {
        return await SecureStore.getItemAsync(key);
      }
    } catch (error) {
      console.error(`Failed to get item [${key}]:`, error);
      return null;
    }
  },

  deleteItem: async (key: string): Promise<void> => {
    try {
      if (Platform.OS === "web" || (Platform.OS === "ios" && !Device.isDevice)) {
        await AsyncStorage.removeItem(key);
      } else {
        await SecureStore.deleteItemAsync(key);
      }
    } catch (error) {
      console.error(`Failed to delete item [${key}]:`, error);
    }
  },

  // Optional: helper for storing objects
  setObject: async <T>(key: string, value: T): Promise<void> => {
    await Storage.setItem(key, JSON.stringify(value));
  },

  getObject: async <T>(key: string): Promise<T | null> => {
    const json = await Storage.getItem(key);
    try {
      return json ? JSON.parse(json) : null;
    } catch {
      return null;
    }
  },
};
