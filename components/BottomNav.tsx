import React, {useEffect} from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';

import { CommonActions } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, BottomNavigation } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '../screens/HomeScreen';
import FriendsScreen from '../screens/FriendsScreen';
import ProfileScreen from '../screens/ProfileScreen';
import ListScreen from '../screens/ListsScreen';

const Tab = createBottomTabNavigator();

export default function BottomNav() {

  useEffect(() => {
    // Set status bar style when component mounts
    StatusBar.setBarStyle('light-content'); // or 'dark-content'
  }, []);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
      tabBar={({ navigation, state, descriptors, insets }) => (
        <BottomNavigation.Bar
          style={styles.bottomNav}
          inactiveColor='#fff'
          activeColor='#fff'
          activeIndicatorStyle={styles.activeTab}
          navigationState={state}
         safeAreaInsets={insets}
          onTabPress={({ route, preventDefault }) => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (event.defaultPrevented) {
              preventDefault();
            } else {
             navigation.dispatch({
                ...CommonActions.navigate(route.name, route.params),
                target: state.key,
              });
            }
          }}
          renderIcon={({ route, focused, color }) => {
            const { options } = descriptors[route.key];
            if (options.tabBarIcon) {
              return options.tabBarIcon({ focused, color, size: 24 });
            }

            return null;
          }}
          getLabelText={({ route }) => {
            const { options } = descriptors[route.key];
            const label =
              options.tabBarLabel !== undefined
                ? options.tabBarLabel
                : options.title !== undefined
                ? options.title
                : route.title;

            return label;
          }}
        />
      )}
    >
      <Tab.Screen
        name="Home"
        component={ListScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => {
            return <Icon name="home" size={size} color="#fff"/>;
          },
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => {
            return <Ionicons name="person" size={24} color="#fff" />;
          },
        }}
      />
      <Tab.Screen
        name="Friends"
        component={FriendsScreen}
        options={{
          tabBarLabel: 'Friends',
          tabBarIcon: ({ color, size }) => {
            return <FontAwesome5 name="user-friends" size={24} color="#fff" />;
          },
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({ 
  bottomNav: {
     backgroundColor: "#0a0a31",
     opacity: 0.9,
     color: "#fff",
     padding: 0,
     margin: 0,
     borderWidth: 0,
     borderColor: "fff"
  },
  activeTab: {
    backgroundColor: "#f20089",
  }
})
