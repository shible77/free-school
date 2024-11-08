import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, TextInput, StatusBar } from 'react-native'
import React, { useEffect, useState } from 'react'
import { firebase } from '../../../config'
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
const EnrolledCourses = () => {
  const navigation = useNavigation();
  const [courseList, setCourseList] = useState([]);

  const fetchEnrolledCourses = () => {

    try {
      const userEnrolledCoursesRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);

      userEnrolledCoursesRef.onSnapshot(async (snapshot) => {
        const userData = snapshot.data();
        if (userData.enrolls) {
          const enrolledCourses = userData.enrolls;
          // console.log(enrolledCourses)
          const coursePromises = (enrolledCourses.map(async (courseId) => {
            const courseDoc = await firebase.firestore().collection('courses').doc(courseId).get()
            if (courseDoc.exists) {
              const courseData = courseDoc.data();
              return courseData;
            }
          }))
          const resolvedCoursesData = await Promise.all(coursePromises);
          setCourseList(resolvedCoursesData);
        }
      });
      return () => unsubscribe();
    } catch (err) {
      console.log(err.message)
    }
  }

  useEffect(() => {
    fetchEnrolledCourses()
  }, [])


  const handleWithdraw = async (course_id) => {
    // console.log(course_id)
    const userEnrolledCoursesRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
    try {
      await userEnrolledCoursesRef.update({
        enrolls: firebase.firestore.FieldValue.arrayRemove(course_id)
      })
    } catch (err) {
      console.error('Error updating withdraw: ', err);
    }

  }
  // console.log(courseList)

  return (
    <View style={styles.mainPage}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={25} color="black" />
        {/* <Text style={{ fontSize: 16 }}> Go Back</Text> */}
      </TouchableOpacity>
      <View style={styles.heading}>
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row' }}>
          <Feather name="book-open" size={30} color="black" style={{ marginVertical: 2 }} />
          <Text style={{ fontSize: 25 }}> Your Enrolled Courses</Text>
        </View>
      </View>
      <View View style={[styles.courseListing, { justifyContent: courseList.length === 0 ? 'center' : null }, { alignItems: courseList.length === 0 ? 'center' : null }]} >
        {courseList.length === 0 ? <Text>You have not enroll in any course yet</Text> :
          (<FlatList
            data={courseList}
            keyExtractor={(item) => item.course_id}
            renderItem={({ item }) => (
              <Pressable onPress={() => { navigation.navigate('EnrolledCoursesDetails', { course: item }) }}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['slateblue', 'firebrick']} style={styles.flatListContainer}>
                  <Text style={styles.flatListText}>{"Course Title: " + item.title}</Text>
                  <Text style={[styles.flatListText, { fontSize: 15 }]}>{"Description: " + item.description}</Text>
                  <TouchableOpacity style={styles.enrollButton} onPress={() => { handleWithdraw(item.course_id) }}>
                    <Text style={{ color: 'white', fontWeight: 'bold' }}>Withdraw</Text>
                  </TouchableOpacity>
                </LinearGradient>
              </Pressable>
            )}
          />)}
      </View>
    </View >
  )
}

export default EnrolledCourses

const styles = StyleSheet.create({
  mainPage: {
    flex: 1,
    // marginTop: 40,
    flexDirection: 'column'
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
    width: '90%',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
  },
  myButton: {
    backgroundColor: 'firebrick',
    border: '2px solid green',
    borderRadius: 10,
    padding: 4,
    height: 40,
    marginLeft: 130,
    width: '40%',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myButton2: {
    backgroundColor: 'royalblue',
    border: '2px solid green',
    borderRadius: 10,
    padding: 4,
    height: 50,
    width: '100%',
    margin: 9,
    // marginTop: 9,
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 16,
    color: 'white',

  },
  search: {
    display: 'flex',
    flexDirection: 'row',
    margin: 5,
    alignSelf: 'center'
  },
  field: {
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 10,
    paddingHorizontal: 5,
    width: '60%',
    marginVertical: 10,
    height: 50,
    fontSize: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  courseListing: {
    marginTop: 10,
    flex: 1,
  },
  flatListContainer: {
    height: 155,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    margin: 10,
    justifyContent: 'center'
  },
  flatListText: {
    fontSize: 18,
    marginLeft: 5,
    color: 'white'
  },
  teacherContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  teacherName: {
    alignItems: 'flex-start',
    width: '80%'
  },
  teacherImage: {
    flex: 1,
    alignItems: 'center'
  },
  enrollButton: {
    backgroundColor: 'slateblue',
    borderRadius: 5,
    alignSelf: 'flex-end',
    height: 40,
    width: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginTop: 10
  }
})