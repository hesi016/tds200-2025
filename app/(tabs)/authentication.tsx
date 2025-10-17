import { useState } from "react";
import Toast from "react-native-toast-message";
import { View, Text, TextInput, Pressable, Switch } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "../../global.css";

const Authentication = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const showToast = (
    type: "success" | "error",
    text1: string,
    text2?: string
  ) => {
    Toast.show({
      type,
      text1,
      text2,
      position: "top",
      visibilityTime: 3000,
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const existingUser = await AsyncStorage.getItem(`user:${email}`);
      if (existingUser) {
        showToast("error", "Bruker eksisterer allerede");
        return;
      }

      const user = { email, password, name };
      await AsyncStorage.setItem(`user:${email}`, JSON.stringify(user));
      showToast("success", "Bruker opprettet", "Du kan nå logge inn");
      setIsSignUp(false);
    } catch (err) {
      showToast("error", "Kunne ikke lagre bruker");
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userData = await AsyncStorage.getItem(`user:${email}`);
      if (!userData) {
        showToast("error", "Bruker ikke funnet");
        return;
      }

      const user = JSON.parse(userData);
      if (user.password === password) {
        await AsyncStorage.setItem("currentUserEmail", email);
        showToast("success", `Velkommen, ${user.name || "bruker"}!`);
      } else {
        showToast("error", "Feil passord");
      }
    } catch (err) {
      showToast("error", "Innlogging feilet");
    }
  };

  const logout = async () => {
    const currentUser = await AsyncStorage.getItem("currentUserEmail");
    if (!currentUser) {
      showToast("error", "Ingen bruker er logget inn");
      return;
    }
    await AsyncStorage.removeItem("currentUserEmail");
    setUserEmail("");
    setUserName("");
    setPassword("");
    showToast("success", "Du er logget ut");
  };

  return (
    <View className="flex-1 items-center justify-center">
      <View className="w-11/12 rounded-lg bg-[#f9f9f9] p-5 android:elevation-2">
        {/* Tips: Mount <Toast /> helst i App.tsx (root). */}
        <Toast />

        {/* Switch-rad */}
        <View className="my-5 flex-row items-center justify-center ">
          <Text className="mr-3 font-bold text-blue-400">Sign-In</Text>
          <Switch
            value={isSignUp}
            onValueChange={setIsSignUp}
            trackColor={{ false: "#ccc", true: "#0096C7" }}
            thumbColor={isSignUp ? "#fff" : "#000"}
          />
          <Text className="ml-3 font-bold text-green-400">Sign-Up</Text>
        </View>

        {/* Brukernavn (kun ved sign up) */}
        {isSignUp && (
          <View className="w-full pt-4">
            <Text>Brukernavn</Text>
            <TextInput
              value={userName}
              onChangeText={setUserName}
              placeholder="Brukernavn"
              className="mt-0.5 rounded border border-gray-400 p-2.5"
            />
          </View>
        )}

        {/* Epost */}
        <View className="w-full pt-4">
          <Text className="font-semibold text-lg">Epost</Text>
          <TextInput
            value={userEmail}
            onChangeText={setUserEmail}
            placeholder="Epost"
            autoCapitalize="none"
            className="mt-0.5 rounded border border-gray-400 p-2.5"
          />
        </View>

        {/* Passord */}
        <View className="w-full pt-4">
          <Text className="font-semibold text-lg">Passord</Text>
          <TextInput
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            placeholder="Passord"
            className="mt-0.5 rounded border border-gray-400 p-2.5"
          />
        </View>

        {/* Auth-knapper */}
        <View className="mt-8">
          <Pressable
            className="w-full items-center rounded-md bg-[#0096C7] py-3"
            onPress={() => {
              if (isSignUp) {
                signUp(userEmail, password, userName);
              } else {
                signIn(userEmail, password);
              }
            }}
          >
            <Text className="text-base font-semibold text-white">
              {isSignUp ? "Lag bruker" : "Logg inn"}
            </Text>
          </Pressable>

          {isSignUp && (
            <Pressable
              className="w-full items-center rounded-md border border-gray-400 py-3"
              onPress={() => setIsSignUp(false)}
            >
              <Text className="text-base font-semibold text-black">Avbryt</Text>
            </Pressable>
          )}
        </View>

        {/* Logout */}
        <View className="mt-6">
          <Pressable
            className="w-full items-center rounded-md bg-red-600 py-3"
            onPress={logout}
          >
            <Text className="text-base font-semibold text-white">Logg ut</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
export default Authentication;
