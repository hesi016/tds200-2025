import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import TabNavigator from './TabNavigator';
import ProfileStackNavigator from './ProfileStackNavigator';
import SettingsStackNavigator from './SettingsStackNavigator';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
const Drawer = createDrawerNavigator();

export default function DrawerNavigator() {
  return (

    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerLeft: () => (
          <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={{ marginLeft: 15 }}>
            <Ionicons name="menu" size={24} />
          </TouchableOpacity>
        ),
        headerTitle: '',  // no title text
      })}
    >
      <Drawer.Screen name="Home" component={TabNavigator} options={{ drawerLabel: 'Home' }} />
      <Drawer.Screen name="Profile" component={ProfileStackNavigator} options={{ drawerLabel: 'Profile' }} />
      <Drawer.Screen name="Settings" component={SettingsStackNavigator} options={{ drawerLabel: 'Settings' }} />
    </Drawer.Navigator>

  );
}
