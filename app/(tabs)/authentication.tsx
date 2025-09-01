import { useState } from "react";
import Toast from 'react-native-toast-message';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Switch,
} from "react-native";
import { Storage } from "@/utils/storage"; 

const Authentication = () => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);

  const showToast = (type: 'success' | 'error', text1: string, text2?: string) => {
    Toast.show({
      type,
      text1,
      text2,
      position: 'top',
      visibilityTime: 3000,
      onHide: () => {
        console.log("Toast is gone, you can trigger something now.");
      },
    });
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const existingUser = await Storage.getItem(`user:${email}`);
      if (existingUser) {
        showToast('error', 'Bruker eksisterer allerede');
        return;
      }

      const user = { email, password, name };
      await Storage.setItem(`user:${email}`, JSON.stringify(user));
      showToast('success', 'Bruker opprettet', 'Du kan nå logge inn');
      setIsSignUp(false);
      setPassword("");
    } catch (err) {
      showToast('error', 'Kunne ikke lagre bruker');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const userData = await Storage.getItem(`user:${email}`);
      if (!userData) {
        showToast('error', 'Bruker ikke funnet');
        return;
      }

      const user = JSON.parse(userData);
      if (user.password === password) {
        await Storage.setItem("currentUserEmail", email);
        showToast('success', `Velkommen, ${user.name || "bruker"}!`);
      } else {
        showToast('error', 'Feil passord');
      }
    } catch (err) {
        showToast('error', 'Innlogging feilet');
    }
  };
const logout = async () => {
  const currentUser = await Storage.getItem("currentUserEmail");

  if (!currentUser) {
    showToast('error', 'Ingen bruker er logget inn');
    return;
  }

  await Storage.deleteItem("currentUserEmail");
  setUserEmail("");
  setUserName("");
  setPassword("");
  showToast('success', 'Du er logget ut');
};


  return (
  <View style={styles.container}>
    <View style={styles.mainContainer}>
      <Toast />

      <View style={styles.switchContainer}>
        <Text>Sign-In</Text>
        <Switch
          value={isSignUp}
          onValueChange={setIsSignUp}
          trackColor={{ false: "#ccc", true: "#0096C7" }}
          thumbColor={isSignUp ? "#fff" : "#000"}
        />
        <Text>Sign-Up</Text>
      </View>

      {isSignUp && (
        <View style={styles.textFieldContainer}>
          <Text>Brukernavn</Text>
          <TextInput
            value={userName}
            onChangeText={setUserName}
            style={styles.textField}
            placeholder="Brukernavn"
          />
        </View>
      )}

      <View style={styles.textFieldContainer}>
        <Text>Epost</Text>
        <TextInput
          value={userEmail}
          onChangeText={setUserEmail}
          style={styles.textField}
          placeholder="Epost"
          autoCapitalize="none"
        />
      </View>

      <View style={styles.textFieldContainer}>
        <Text>Passord</Text>
        <TextInput
          value={password}
          secureTextEntry={true}
          onChangeText={setPassword}
          style={styles.textField}
          placeholder="Passord"
        />
      </View>

      {/* Auth Buttons */}
      <View style={styles.authButtonContainer}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => {
            if (isSignUp) {
              signUp(userEmail, password, userName);
            } else {
              signIn(userEmail, password);
            }
          }}
        >
          <Text style={styles.buttonText}>
            {isSignUp ? "Lag bruker" : "Logg inn"}
          </Text>
        </Pressable>

        {isSignUp && (
          <Pressable
            style={styles.secondaryButton}
            onPress={() => setIsSignUp(false)}
          >
            <Text style={styles.buttonTextSecondary}>Avbryt</Text>
          </Pressable>
        )}
      </View>

      {/* Logout Button */}
      <View style={styles.logoutButtonContainer}>
        <Pressable style={styles.logoutButton} onPress={logout}>
          <Text style={styles.buttonText}>Logg ut</Text>
        </Pressable>
      </View>
    </View>
  </View>
);
};

export default Authentication;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  mainContainer: {
    width: "90%",
    padding: 20,
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },
  textFieldContainer: {
    width: "100%",
    paddingTop: 16,
  },
  textField: {
    borderWidth: 1,
    padding: 10,
    marginTop: 2,
    borderColor: "gray",
    borderRadius: 5,
  },
  authButtonContainer: {
    marginTop: 32,
  },
  primaryButton: {
    backgroundColor: "#0096C7",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    marginBottom: 12,
    width: "100%",
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: "gray",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonTextSecondary: {
    color: "black",
    fontWeight: "600",
    fontSize: 16,
  },
  logoutButtonContainer: {
    marginTop: 24,
  },
  logoutButton: {
    backgroundColor: "red",
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: "center",
    width: "100%",
  },
});
