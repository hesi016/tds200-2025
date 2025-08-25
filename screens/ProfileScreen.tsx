import React from 'react';
import { View, Text, TextInput, Button } from "react-native";
import { useState } from "react";

export default function ProfileScreen() {

  const [input, setInput] = useState("");  
  const [username, setUsername] = useState("");

  const handleUserName = () => {
    setUsername(input); // Update the displayed username
    setInput(""); // Clear the input field
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

      <Button title="Save Username" onPress={handleUserName} />
      
      {username && (
        <Text style={{marginTop: 20,
          fontSize: 16,
          color: "#555",}}>Current Username: {username}</Text>
      )}
    </View>
  );

}
