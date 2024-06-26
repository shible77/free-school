import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import MyCourses from './MyCourses'
import CourseDetails from './CourseDetails';
import EditCourseDetails from './EditCourseDetails';
import Videos from './Videos';
import Quizzes from './Quizzes';
import CreateQuiz from './CreateQuiz';
import QuizDetails from './QuizDetails';

const CoursesNavigation = () => {

    const Stack = createStackNavigator();
    return (
        <Stack.Navigator initialRouteName={MyCourses} screenOptions={{ headerShown: false }}>
            <Stack.Screen name="MyCourses" component={MyCourses} />
            <Stack.Screen name='CourseDetails' component={CourseDetails} />
            <Stack.Screen name='EditCourseDetails'component={EditCourseDetails}/>
            <Stack.Screen name='Videos' component={Videos}/>
            <Stack.Screen name='Quizzes' component={Quizzes}/>
            <Stack.Screen name='CreateQuiz' component={CreateQuiz}/>
            <Stack.Screen name='QuizDetails' component={QuizDetails}/>
        </Stack.Navigator>
    )
}

export default CoursesNavigation