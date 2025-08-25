import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SettingsScreen from '@/screens/SettingsScreen';

const Stack = createStackNavigator();

export default function SettingsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={SettingsScreen}
        options={({ navigation }) => ({
          title: 'Settings',
          headerLeft: () => (
            <BackButton onPress={() => navigation.goBack()} />
          ),
        })}
      />
    </Stack.Navigator>
  );
}

// BackButton component example:
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginLeft: 15 }}>
      <Ionicons name="arrow-back" size={24} />
    </TouchableOpacity>
  );
}
