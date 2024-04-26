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

const Quizzes = ({ route }) => {
  const navigation = useNavigation()
  const courseId = route.params.courseId;
  const [quizzes, setQuizzes] = useState([]);

  const fetchQuizzes = () => {
    try {
      const unsubscribe = firebase.firestore().collection('courses').doc(courseId).collection('quizzes').onSnapshot((querySnapshot) => {
        const quizzes = querySnapshot.docs.map(doc => doc.data());
        setQuizzes(quizzes);
      })
      return () => {
        unsubscribe();
      }
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    fetchQuizzes();
  }, [courseId])

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="black" />
        <Text style={{ fontSize: 16 }}> Go Back</Text>
      </TouchableOpacity>
      <View style={styles.heading}>
        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
          <MaterialCommunityIcons name="head-question-outline" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Quizzes</Text>
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate('CreateQuiz', { courseId: courseId }) }}>
          <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginTop: 5 }}>
            <MaterialIcons name="post-add" size={25} color="black" />
            <Text style={{ fontSize: 16, marginVertical: 2 }}>CREATE</Text>
          </View>
        </TouchableOpacity>
      </View>

      {quizzes.length > 0 ? <FlatList
        data={quizzes}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigation.navigate('QuizDetails', { quizId: item.quiz_id, courseId : courseId })}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['slateblue', 'firebrick']} style={styles.flatListContainer} >
              <Text style={{ fontSize: 20, color : 'white' }}>{`Quiz Title: ${item.title}`}</Text>
              <Text style={{ fontSize: 16, color : 'white' }}>{`Quiz Topic: ${item.topic}`}</Text>
            </LinearGradient>
          </Pressable>
        )}
        keyExtractor={(item) => item.quiz_id}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
      /> : <Text style={{ alignSelf: 'center', fontSize: 18, marginTop : 250}}>No quiz created yet</Text>}
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
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%',
    marginBottom : 10
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
    padding : 10,
    marginBottom : 5
  },
})