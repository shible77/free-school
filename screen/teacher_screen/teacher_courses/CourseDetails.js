import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { firebase } from '../../../config'
import CustomStarRating from '../../../components/CustomStarRating';


const CourseDetails = ({ route }) => {
  const navigation = useNavigation();
  const {course} = route.params
  const [userRating, setUserRating] = useState(0);
 
  useEffect(() => {
    const fetchCourseData = () => {
      try {
        const unsubscribe = firebase.firestore().collection('courses').doc(course.course_id).onSnapshot((doc) => {
          if (doc.exists) {
            const ones = doc.data().one ? doc.data().one.length : 0;
            const twos = doc.data().two ? doc.data().two.length : 0;
            const threes = doc.data().three ? doc.data().three.length : 0;
            const fours = doc.data().four ? doc.data().four.length : 0;
            const fives = doc.data().five ? doc.data().five.length : 0;
            const totalScores = (1*ones) + (2*twos) + (3*threes) + (4*fours) + (5*fives);
            const totalRatings = ones + twos + threes + fours + fives;
            const averageRating = totalScores / totalRatings;
            setUserRating(Math.ceil(averageRating))
          }
        })
        return () => unsubscribe() //cleanup when component is unmounted
      } catch (err) {
        console.log(err.code)
      }
    }
    const unsubscribe = fetchCourseData()
    return () => unsubscribe();
  }, [course.course_id])

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={25} color="black" />
        {/* <Text style={{ fontSize: 16 }}> Go Back</Text> */}
      </TouchableOpacity>
      <View style={styles.heading}>
        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
          <AntDesign name="layout" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Course Details</Text>
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate('EditCourseDetails', { courseId: course.course_id }) }}>
          <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginTop: 5 }}>
            <Feather name="edit" size={24} color="black" />
            <Text style={{ fontSize: 16, marginVertical: 2 }}>EDIT</Text>
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.details}>
          <View style={styles.inputField}>
            <Text style={{ fontSize: 17, marginVertical: 5 }}>Course Title:</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={'dimgray'}
              value={course.title}
              editable={false}
            />
          </View>
          <View style={styles.inputField}>
            <Text style={{ fontSize: 17, marginVertical: 5 }}>Course Description:</Text>
            <TextInput
              style={[styles.input, { height: 90 }]}
              placeholderTextColor={'dimgray'}
              value={course.description}
              multiline
              editable={false}
            />
          </View>
          <View style={styles.inputField}>
            <Text style={{ fontSize: 17, marginVertical: 5 }}>Course Creation Date:</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={'dimgray'}
              value={course.doc.toDate().toLocaleDateString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).split('/').reverse().join('-')}
              editable={false}
            />
          </View>
          <View style={styles.btnView}>
            <TouchableOpacity onPress={() => { navigation.navigate('Videos', { courseId: course.course_id }) }}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['midnightblue', 'maroon']} style={styles.uploadVideoBtn}>
                <Text style={styles.btnText}>Videos</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Quizzes', { courseId: course.course_id }) }}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['midnightblue', 'maroon']} style={styles.uploadVideoBtn}>
                <Text style={styles.btnText}>Quizzes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{ height: 220 }}>
            <View style={{ alignSelf: 'center', marginTop: 20, width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', borderColor: 'dimgray', borderBottomWidth: 2 }}>
              <Text style={{ fontSize: 20 }}>Average rating of this course</Text>
            </View>
            <View style={styles.ratingView}>
              <CustomStarRating rating={userRating} setRating={setUserRating} disabled={true} />
            </View>
          </View>

        </View>
      </ScrollView>
    </View>
  )
}

export default CourseDetails

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    // marginTop: 120,
    flexDirection: 'column',
  },
  backButton: {
    marginLeft : 5,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 45,
        width: 50,
        justifyContent: 'center',
        height : 50,
        // backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems : 'center',
        borderRadius : 25,
        padding : 5,  
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, 
        shadowRadius: 3.84,
        elevation: 5
  },
  heading: {
    marginTop: 20,
    display: 'flex',
    flexDirection: 'row',
    alignSelf: 'center',
    width: '90%'
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
  subHeading: {
    alignSelf: 'center',
    marginTop: 10,
    fontSize: 20
  },
  inputField: {
    display: 'flex',
    flexDirection: 'column',
    width: '90%',
    alignSelf: 'center'
  },
  input: {
    // width: '95%',
    height: 50,
    fontSize: 17,
    padding: 5,
    color: 'dimgray',
    backgroundColor: 'white',
    paddingLeft: 15
  },
  btnView: {
    marginTop: 15,
    alignSelf: 'center',
    width: '90%'
  }
  ,
  uploadVideoBtn: {
    height: 70,
    width: '100%',
    alignSelf: 'center',
    borderRadius: 10,
    marginTop: 15,
    justifyContent: 'center',
    alignItems: 'center'
  },
  btnText: {
    fontSize: 20,
    marginLeft: 5,
    marginTop: 5,
    color: 'white',
  },
  profileButton: {

    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 5,
    padding: 4,
    height: 50,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 35,
    flexDirection: 'row'
  },
  ratingView: {
    marginTop: 10,
    width: '90%',
    // height: 50,
    alignSelf: 'center',
  },
})