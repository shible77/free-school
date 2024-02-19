import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import Videos from './student_screen/Videos';
import Courses from './student_screen/Courses';
import Menu from './student_screen/Menu';
import Loader from './../components/Loader'
import { firebase } from '../config'
import MyCourses from './teacher_screen/MyCourses';
import TeacherMenu from './teacher_screen/TeacherMenu';
import MyVideos from './teacher_screen/MyVideos';
import MyQuizzes from './teacher_screen/MyQuizzes';

const Tab = createMaterialTopTabNavigator();

const DashBoard = () => {

  const [userType, setUserType] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const userSnapshot = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get();
        const userData = userSnapshot.data();
        setUserType(userData.type);
        setLoading(false)
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  if (userType === 'student') {
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
              height: 80,
            },
          }}
        >
          <Tab.Screen
            name="Courses"
            component={Courses}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                  <Entypo name="open-book" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
                </View>
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>COURSES</Text>
              ),
            }}
          />
          <Tab.Screen
            name="Videos"
            component={Videos}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                  <Octicons name="video" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
                </View>
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>VIDEOS</Text>
              ),
            }}
          />

          <Tab.Screen
            name="Menu"
            component={Menu}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                  <Entypo name="menu" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
                </View>
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>MENU</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    )
  }
  else if (userType === 'teacher') {
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
              height: 80,
            },
          }}
        >
          <Tab.Screen
            name="MyCourses"
            component={MyCourses}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                  <Feather name="book-open" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
                </View>
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>COURSES</Text>
              ),
            }}
          />
          <Tab.Screen
            name="MyVideos"
            component={MyVideos}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                  <MaterialIcons name="video-collection" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />

                </View>
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>VIDEOS</Text>
              ),
            }}
          />
          <Tab.Screen
            name="MyQuizzes"
            component={MyQuizzes}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                  <MaterialCommunityIcons name="message-question-outline" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
                </View>
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>QUIZZES</Text>
              ),
            }}
          />
          <Tab.Screen
            name="TeacherMenu"
            component={TeacherMenu}
            options={{
              tabBarIcon: ({ focused }) => (
                <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                  <Entypo name="menu" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
                </View>
              ),
              tabBarLabel: ({ focused }) => (
                <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>MENU</Text>
              ),
            }}
          />
        </Tab.Navigator>
      </View>
    );
  }
  else{
    return(
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <Loader size='large' color='black' /> 
    </View>
    )
  }
}

export default DashBoard;
