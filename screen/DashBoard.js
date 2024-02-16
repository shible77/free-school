import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import Videos from './Videos';
import Quiz from './Quiz';

const Tab = createMaterialTopTabNavigator();

const DashBoard = () => {
  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      <Tab.Navigator
        screenOptions={{
          tabBarShowLabel: true,
          tabBarIndicatorStyle: { opacity: 0 },
          tabBarStyle: {
            position: 'absolute',
            top: 40,
            left: 10,
            right: 10,
            elevation: 0,
            backgroundColor: '#ffffff',
            borderRadius: 15,
            height: 80, // Adjusted height
          },
        }}
      >
        <Tab.Screen
          name="Videos"
          component={Videos}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ alignItems: 'center', justifyContent: 'center',top: 5}}>
                <Entypo name="folder-video" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
              </View>
            ),
            tabBarLabel: ({focused}) => (
              <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>VIDEOS</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Quizes"
          component={Quiz}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{alignItems: 'center', justifyContent: 'center', top: 5}}>
                <MaterialIcons name="quiz" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
              </View>
            ),
            tabBarLabel: ({focused}) => (
              <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>QUIZES</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </View>
  );
};

export default DashBoard;
