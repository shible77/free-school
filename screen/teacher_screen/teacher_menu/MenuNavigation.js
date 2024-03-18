import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import TeacherProfile from './TeacherProfile';
import TeacherMenu from './TeacherMenu'
import EditProfile from './EditProfile';

const MenuNavigation = () => {

    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName={TeacherMenu} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="TeacherMenu" component={TeacherMenu} />
            <Stack.Screen name='TeacherProfile' component={TeacherProfile}/>
            <Stack.Screen name='EditProfile' component={EditProfile} />
        </Stack.Navigator>
    )
}

export default MenuNavigation