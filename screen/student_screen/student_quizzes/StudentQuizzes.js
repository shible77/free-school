import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { firebase } from '../../../config'
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
const Quizzes = () => {

  const [quizzes, setQuizzes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchQuizzes = () => {
      const userId = firebase.auth().currentUser.uid;

      const unsubscribeUser = firebase
        .firestore()
        .collection('users')
        .doc(userId)
        .onSnapshot(async (userDoc) => {
          const userInfo = userDoc.data();

          if (userInfo && userInfo.enrolls && userInfo.enrolls.length > 0) {
            const quizPromises = userInfo.enrolls.map(async (courseId) => {
              const quizzesRef = firebase
                .firestore()
                .collection('courses')
                .doc(courseId)
                .collection('quizzes');

              const quizSnapshot = await quizzesRef.get();

              return quizSnapshot.docs.map((quizDoc) => ({
                courseId: courseId,
                quiz_id: quizDoc.data().quiz_id,
                title: quizDoc.data().title,
                topic: quizDoc.data().topic
              }));
            });

            // Wait for all quiz promises to resolve and flatten the result array
            const quizzesArray = await Promise.all(quizPromises);
            setQuizzes(quizzesArray.flat());
          }
        }, (error) => {
          console.error('Error fetching user or quizzes:', error);
        });

      // Clean up the listener when the component unmounts
      return () => unsubscribeUser();
    };

    fetchQuizzes();
  }, []);

  // console.log(quizzes)

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
          <Pressable onPress={() => navigation.navigate('CoursesNavigation', {
            screen: 'QuizParticipation',
            params: {
              quizId: item.quiz_id,
              courseId: item.courseId,
            },
          })}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['slateblue', 'firebrick']} style={styles.flatListContainer} >
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
    height: 70,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    margin: 10,
    padding: 10,
    marginBottom: 5
  },
})