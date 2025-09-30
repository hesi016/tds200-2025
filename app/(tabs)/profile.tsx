import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import React, { useState } from "react";

export default function Profile() {
  const [input, setInput] = useState("");
  const [inputEmail, setInputEmail] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const handleInput = () => {
    setUsername(input); // Update the displayed username
    setEmail(inputEmail); // Update the displayed email
    setInput(""); // Clear the input field
    setInputEmail(""); // Clear the input field
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 18, marginBottom: 10 }}>Set Your Username</Text>
      <TextInput
        style={{
          width: "40%",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
        placeholder="Enter your username"
        value={input}
        onChangeText={setInput}
      />
      <Text style={{ fontSize: 18, marginBottom: 10 }}>
        Set Your Email address
      </Text>
      <TextInput
        style={{
          width: "40%",
          borderWidth: 1,
          padding: 10,
          marginBottom: 10,
          borderRadius: 5,
        }}
        placeholder="Enter your email address"
        value={inputEmail}
        onChangeText={setInputEmail}
      />

      <Button title="Save" onPress={handleInput} />

      {username && (
        <Text style={styles.userText}>Current Username: {username}</Text>
      )}
      {email && <Text style={styles.userText}>Current Email: {email}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  userText: {
    marginTop: 20,
    fontSize: 16,
    color: "#555",
  },
});
