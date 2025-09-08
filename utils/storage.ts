import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Storage = {
  setItem: async (key: string, value: string): Promise<void> => {
    try {
      if (Platform.OS === "web") {
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
      if (Platform.OS === "web") {
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
      if (Platform.OS === "web") {
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
