import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import StudentProfile from './StudentProfile';
import StudentMenu from './StudentMenu'
import EditStudentProfile from './EditStudentProfile';
import Report from './Report';

const MenuNavigation = () => {

    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName={StudentMenu} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="StudentMenu" component={StudentMenu} />
            <Stack.Screen name='StudentProfile' component={StudentProfile}/>
            <Stack.Screen name='EditStudentProfile' component={EditStudentProfile} />
            <Stack.Screen name='Report' component={Report} />
        </Stack.Navigator>
    )
}

export default MenuNavigation