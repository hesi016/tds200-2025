import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/screens/HomeScreen';
import AuthScreen from '@/screens/AuthScreen';
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "react-native";


const Tab = createBottomTabNavigator();

export default function TabNavigator({ navigation }: any) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" 
        component={HomeScreen} 
        options={{
            headerShown: false, // hides the top header for this screen
            title: "Hjem", // this sets the tab label (not visible if you use tabBarLabel: ()=>null)
            tabBarIcon: ({ color, focused }) => (
            <AntDesign name="home" size={24} color={color} />
            ),
            headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
                Hjemmeside
            </Text>
            ),
        }}
        />
      <Tab.Screen name="Auth" 
        component={AuthScreen} 
        options={{
            headerShown: false, // hides the top header for this screen
            title: "Authentication",
            tabBarIcon: ({ color, focused }) => (
            <AntDesign name="user" size={24} color={color} />
            ),
            headerTitle: () => (
            <Text style={{ fontSize: 20, fontWeight: "bold", color: "black" }}>
                Authentication
            </Text>
            ),
        }}
    />
    </Tab.Navigator>
  );
}
