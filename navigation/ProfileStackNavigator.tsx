import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '@/screens/ProfileScreen';

const Stack = createStackNavigator();

export default function ProfileStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={({ navigation }) => ({
          title: 'Profile',
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
