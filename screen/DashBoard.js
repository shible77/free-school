import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { View } from 'react-native';

import Videos from './Videos';
import Quiz from './Quiz';

const Tab = createMaterialTopTabNavigator();

const DashBoard = () => {
  return (
    <View style={{ flex: 1, marginVertical: 10 }}>
      <Tab.Navigator
        screenOptions={{
          tabBarShowIcon: true,
          tabBarLabelStyle: { fontSize: 15 },
        }}
        style={{ marginVertical: 28 }}
      >
        <Tab.Screen
          name="Videos"
          component={Videos}
          options={{
            tabBarLabel: 'Videos',
            tabBarIcon: ({ color, size }) => (
              <Entypo name="folder-video" size={20} color="black" />
            ),
          }}
        />
        <Tab.Screen
          name="Quiz"
          component={Quiz}
          options={{
            tabBarLabel: 'Quiz',
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="quiz" size={20} color="black" />
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default DashBoard;
