import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { firebase } from '../../../config'
import { LinearGradient } from 'expo-linear-gradient';

const Quizzes = () => {
  const navigation = useNavigation()
  const [quizzes, setQuizzes] = useState([]);
  const teacherId = firebase.auth().currentUser.uid;

  const fetchQuizzes = () => {
    const unsubscribeCourse = firebase.firestore()
      .collection('courses')
      .where('teacher_id', '==', teacherId)
      .onSnapshot(async (courseSnapshot) => {
        const quizPromises = []; // Array to hold promises for each quiz query

  
        courseSnapshot.forEach((courseDoc) => {
          const courseId = courseDoc.id;
          const courseTitle = courseDoc.data().title;
  
          // Create a promise for each quiz query
          const quizPromise = new Promise((resolve, reject) => {
            const unsubscribeQuiz = firebase.firestore()
              .collection('courses')
              .doc(courseId)
              .collection('quizzes')
              .onSnapshot((quizSnapshot) => {
                const tQuizzes = quizSnapshot.docs.map((quizDoc) => ({
                  courseId: courseId,
                  courseTitle: courseTitle,
                  quiz_id: quizDoc.data().quiz_id,
                  title: quizDoc.data().title,
                  topic: quizDoc.data().topic
                }));
                resolve(tQuizzes); // Resolve the promise with the quizzes
              }, (error) => {
                reject(error); // Reject the promise if there's an error
              });
  
           
          });
  
          quizPromises.push(quizPromise); // Add the promise to the array
        });
  
        // Wait for all quiz promises to resolve
        try {
          const allQuizzes = await Promise.all(quizPromises);
          const flattenedQuizzes = allQuizzes.flat(); // Flatten the array of arrays
          setQuizzes(flattenedQuizzes); // Set the quizzes state with all quizzes
          // console.log(flattenedQuizzes); // Log all the quizzes
        } catch (error) {
          console.error('Error fetching quizzes:', error);
        }
      }, (error) => {
        console.error('Error fetching courses:', error);
      });
  
    // Return a cleanup function to unsubscribe from both course and quiz listeners
    return () => unsubscribeCourse(); // Unsubscribe from the course listener    
  };
  
  useEffect(() => {
    const cleanup = fetchQuizzes();
  
    // Cleanup function on unmount
    return () => {
      cleanup();
    };
  }, []);
  

  return (
    <View style={styles.mainContainer}>
      <View style={styles.heading}>
        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
          <MaterialCommunityIcons name="head-question-outline" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Quizzes</Text>
        </View>
      </View>

      {quizzes.length > 0 ? <FlatList
        data={quizzes}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('CoursesNavigation',{screen : 'QuizDetails', params : {quizId: item.quiz_id,
            courseId: item.courseId}})}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['slateblue', 'firebrick']} style={styles.flatListContainer} >
              <Text style={{ fontSize: 20, color: 'white' }}>{`Course Title: ${item.courseTitle}`}</Text>
              <Text style={{ fontSize: 20, color: 'white' }}>{`Quiz Title: ${item.title}`}</Text>
              <Text style={{ fontSize: 16, color: 'white' }}>{`Quiz Topic: ${item.topic}`}</Text>
            </LinearGradient>
          </Pressable>
        )}
        keyExtractor={(item) => item.quiz_id}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      /> : <Text style={{ alignSelf: 'center', fontSize: 18, marginTop: 250 }}>No quiz created yet</Text>}
    </View>
  )
}

export default Quizzes

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // marginTop: 120,
    flexDirection: 'column'
  },
  backButton: {
    marginLeft: 15,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 130,
    width: '90%',
    justifyContent: 'flex-start'
  },
  heading: {
    marginTop: 130,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%',
    marginBottom: 10
  },
  content: {
    marginTop: 10,
    width: '100%',
    alignSelf: 'center',
    // flex: 1

  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '90%',
    marginTop: 10
  },
  flatListContainer: {
    height: 90,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    marginBottom: 5
  },
})