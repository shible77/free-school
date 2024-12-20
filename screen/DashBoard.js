import React, { useEffect, useState } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { Entypo } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import StudentVideos from './student_screen/student_videos/StudentVideos';
import StudentCourses from './student_screen/student_courses/StudentCourses';
import Loader from './../components/Loader'
import { firebase } from '../config'
import MyVideos from './teacher_screen/teacher_videos/MyVideos';
import MyQuizzes from './teacher_screen/teacher_quizzes/MyQuizzes';
import MenuNavigation from './teacher_screen/teacher_menu/MenuNavigation';
import TCoursesNavigation from './teacher_screen/teacher_courses/CoursesNavigation';
import SCoursesNavigation from './student_screen/student_courses/CoursesNavigation';
import { StatusBar } from 'react-native';
import StudentMenuNavigation from './student_screen/student_menu/StudentMenuNavigation'
import StudentQuizzes from './student_screen/student_quizzes/StudentQuizzes';
import ActivityIndicator from '../components/ActivityIndicator'
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

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
        setTimeout(() => {
          setUserType(userData.type);
          setLoading(false)
        }, 3000)
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  if (userType === 'student') {
    return (
      <>
        <StatusBar translucent backgroundColor="black" />
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Tab.Navigator
            screenOptions={{
              tabBarShowLabel: true,
              tabBarIndicatorStyle: { opacity: 0 },
              tabBarStyle: {
                position: 'absolute',
                top: 45,
                left: 8,
                right: 8,
                elevation: 0,
                // backgroundColor: '#ffffff',
                backgroundColor: 'gainsboro',
                borderRadius: 15,
                height: 80,
              },
            }}
          >
            <Tab.Screen
              name="CoursesNavigation"
              component={SCoursesNavigation}
              options={({ route }) => ({
                tabBarIcon: ({ focused }) => (
                  <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                    <Feather name="book-open" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
                  </View>
                ),
                tabBarLabel: ({ focused }) => (
                  <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>COURSES</Text>
                ),
                tabBarStyle: {
                  display: getTabBarVisibility(route),
                  position: 'absolute',
                  top: 45,
                  left: 8,
                  right: 8,
                  elevation: 0,
                  // backgroundColor: '#ffffff',
                  backgroundColor: 'gainsboro',
                  borderRadius: 15,
                  height: 80,
                },
              })}
            />
            <Tab.Screen
              name="StudentVideos"
              component={StudentVideos}
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
              name="StudentQuizzes"
              component={StudentQuizzes}
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
              name="StudentMenuNavigation"
              component={StudentMenuNavigation}
              options={({ route }) => ({
                tabBarIcon: ({ focused }) => (
                  <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                    <Entypo name="menu" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
                  </View>
                ),
                tabBarLabel: ({ focused }) => (
                  <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>MENU</Text>
                ),
                tabBarStyle: {
                  display: getTabBarVisibility(route),
                  position: 'absolute',
                  top: 45,
                  left: 8,
                  right: 8,
                  elevation: 0,
                  // backgroundColor: '#ffffff',
                  backgroundColor: 'gainsboro',
                  borderRadius: 15,
                  height: 80,
                },
              })}
            />
          </Tab.Navigator>
        </View></>
    )
  }
  else if (userType === 'teacher') {
    return (
      <>
        <StatusBar translucent backgroundColor="black" />
        <View style={{ flex: 1, backgroundColor: 'white' }}>
          <Tab.Navigator
            screenOptions={{
              tabBarShowLabel: true,
              tabBarIndicatorStyle: { opacity: 0 },
              tabBarStyle: {
                position: 'absolute',
                top: 45,
                left: 8,
                right: 8,
                elevation: 0,
                backgroundColor: 'gainsboro',
                borderRadius: 15,
                height: 80,
              },
            }}
          >
            <Tab.Screen
              name="CoursesNavigation"
              component={TCoursesNavigation}
              options={({ route}) => ({
                tabBarIcon: ({ focused }) => (
                  <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                    <Feather name="book-open" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
                  </View>
                ),
                tabBarLabel: ({ focused }) => (
                  <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>COURSES</Text>
                ),
                tabBarStyle: {
                  display: getTabBarVisibility(route),
                  position: 'absolute',
                  top: 45,
                  left: 8,
                  right: 8,
                  elevation: 0,
                  // backgroundColor: '#ffffff',
                  backgroundColor: 'gainsboro',
                  borderRadius: 15,
                  height: 80,
                }
              })}
            />
            <Tab.Screen
              name="MyVideos"
              component={MyVideos}
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
              name="MenuNavigation"
              component={MenuNavigation}
              options={({ route}) => ({
                tabBarIcon: ({ focused }) => (
                  <View style={{ alignItems: 'center', justifyContent: 'center', top: 5 }}>
                    <Entypo name="menu" size={22} style={{ color: focused ? '#e32f45' : '#748c94' }} />
                  </View>
                ),
                tabBarLabel: ({ focused }) => (
                  <Text style={{ color: focused ? '#e32f45' : '#748c94', fontSize: 12 }}>MENU</Text>
                ),
                tabBarStyle: {
                  display: getTabBarVisibility(route),
                  position: 'absolute',
                  top: 45,
                  left: 8,
                  right: 8,
                  elevation: 0,
                  // backgroundColor: '#ffffff',
                  backgroundColor: 'gainsboro',
                  borderRadius: 15,
                  height: 80,
                }
              })}
            />
          </Tab.Navigator>
        </View>
      </>
    );
  }
  else {
    return (
      <>
        <StatusBar translucent backgroundColor="black" />
        {loading && <ActivityIndicator />}
      </>
    )
  }
}

const getTabBarVisibility = route => {
  // console.log(route);
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'StudentMenu'
    // console.log(routeName);
  if (routeName === 'StudentMenu' || routeName === 'StudentCourses' || routeName === 'MyCourses' || routeName === 'TeacherMenu') {
    return 'flex'
  }else{
    return 'none'
  }
};

export default DashBoard;
