import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from '../../../config';
import CustomStarRating from '../../../components/CustomStarRating';
import Toast from '../../../components/Toast';


const EnrolledCoursesDetails = ({ route }) => {
  const { course } = route.params
  const navigation = useNavigation();
  const [userRating, setUserRating] = useState(0);
  const [previousRating, setPreviousRating] = useState(0);
  const [showToast, setShowToast] = useState(false);
  // console.log(course)
  useEffect(() => {
    const fetchCourseInfo = () => {
      try {
        const unsubscribe = firebase.firestore().collection('courses').doc(course.course_id).onSnapshot((doc) => {
          if (doc.exists) {
            if (doc.data().one && doc.data().one.includes(firebase.auth().currentUser.uid)) {
              setUserRating(1);
              setPreviousRating(1);
            }
            if (doc.data().two && doc.data().two.includes(firebase.auth().currentUser.uid)) {
              setUserRating(2)
              setPreviousRating(2);
            }
            if (doc.data().three && doc.data().three.includes(firebase.auth().currentUser.uid)) {
              setUserRating(3)
              setPreviousRating(3);
            }
            if (doc.data().four && doc.data().four.includes(firebase.auth().currentUser.uid)) {
              setUserRating(4)
              setPreviousRating(4);
            }
            if (doc.data().five && doc.data().five.includes(firebase.auth().currentUser.uid)) {
              setUserRating(5)
              setPreviousRating(5);
            }
          }
        })
        return () => unsubscribe()
      } catch (err) {
        console.log(err.message)
      }
    }
    fetchCourseInfo()
  }, [course.course_id])

  const saveRating = async () => {
    try {
      if (userRating !== previousRating) {
        const target = previousRating === 1 ? 'one' : previousRating === 2 ? 'two' : previousRating === 3 ? 'three' : previousRating === 4 ? 'four' : 'five'
        await firebase.firestore().collection('courses').doc(course.course_id).update({
          [target]: firebase.firestore.FieldValue.arrayRemove(firebase.auth().currentUser.uid)
        }).then(() => {
          const target = userRating === 1 ? 'one' : userRating === 2 ? 'two' : userRating === 3 ? 'three' : userRating === 4 ? 'four' : 'five'
          firebase.firestore().collection('courses').doc(course.course_id).update({
            [target]: firebase.firestore.FieldValue.arrayUnion(firebase.auth().currentUser.uid)
          }).then(() => {
            setShowToast(true)
            setTimeout(() => {
              setShowToast(false)
            }, 4000)

          }).catch(err => {
            console.log(err.message)
          })
        }).catch(err => {
          console.log(err.message)
        })
      }

    } catch (err) {
      console.log(err.message)
    }
  }

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={25} color="black" />
        {/* <Text style={{ fontSize: 16 }}> Go Back</Text> */}
      </TouchableOpacity>
      <View style={styles.heading}>
        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
          <AntDesign name="layout" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Enrolled Course Details</Text>
        </View>
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
          <View style={{ alignSelf: 'center', marginTop: 20, width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', borderColor: 'dimgray', borderBottomWidth: 2 }}>
            <Text style={{ fontSize: 20 }}>Videos and Quizzes</Text>
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
          <View style={{ height: 250 }}>
            <View style={{ alignSelf: 'center', marginTop: 20, width: '90%', height: 50, alignItems: 'center', justifyContent: 'center', borderColor: 'dimgray', borderBottomWidth: 2 }}>
              <Text style={{ fontSize: 20 }}>Rate this course</Text>
            </View>
            <View style={styles.ratingView}>
              <CustomStarRating rating={userRating} setRating={setUserRating} disabled={false} />
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={() => saveRating()}>
              <Text style={{ fontSize: 20, color: 'white' }}>Save Rating</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      {showToast ? <Toast
        icon={<AntDesign name="checkcircle" size={27} color="white" />}
        message='Your Rating Updated Successfully'
        color="green"
        bottom={55} /> : null}
    </View>
  )
}

export default EnrolledCoursesDetails

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
    width: '90%',
    marginBottom: 10,
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
    marginTop: 10,
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
  saveButton: {
    height: 50,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'darkcyan',
    marginTop: 20
  }
})