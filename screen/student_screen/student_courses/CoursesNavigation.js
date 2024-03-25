import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import StudentCourses from './StudentCourses';
import CourseDetails from './CourseDetails';
import EnrolledCourses from './EnrolledCourses';
import EnrolledCoursesDetails from './EnrolledCoursesDetails';
import InstructorInfo from './InstructorInfo';
import Videos from './Videos';
import Quizzes from './Quizzes';

const CoursesNavigation = () => {

    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName={StudentCourses} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="StudentCourses" component={StudentCourses} />
            <Stack.Screen name='CourseDetails' component={CourseDetails} />
            <Stack.Screen name='EnrolledCourses' component={EnrolledCourses} />
            <Stack.Screen name='EnrolledCoursesDetails' component={EnrolledCoursesDetails} />
            <Stack.Screen name='InstructorInfo' component={InstructorInfo} />
            <Stack.Screen name='Videos' component={Videos} />
            <Stack.Screen name='Quizzes' component={Quizzes} />
        </Stack.Navigator>
    )
}

export default CoursesNavigation