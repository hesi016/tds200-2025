/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/Colors';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark
) {
  const system = useColorScheme() ?? 'light';
  const [storedTheme, setStoredTheme] = useState<"light" | "dark" | null>(null);


  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem("darkMode");
      if(saved === "true") setStoredTheme("dark");
      if(saved === "false") setStoredTheme("light");
    })();
  }, []);

const theme = storedTheme ?? system;
const colorFromProps = props[theme];
return colorFromProps ?? Colors[theme][colorName];

}
