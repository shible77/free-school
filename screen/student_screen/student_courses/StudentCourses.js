import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, TextInput, StatusBar, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons';
import { firebase } from '../../../config';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StudentCourses = () => {

  const navigation = useNavigation();
  const [userCourses, setUserCourses] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [currentUserInfo, setCurrentUserInfo] = useState(null);

  useEffect(() => {
    const fetchCurrentUserInfo = () => {
      try {
        const unsubscribe = firebase.firestore().collection('users')
          .doc(firebase.auth().currentUser.uid)
          .onSnapshot((doc) => {
            setCurrentUserInfo(doc.data());
          });

        return () => unsubscribe(); // Cleanup function
      } catch (error) {
        console.error('Error fetching user info:', error);
      }
    };

    fetchCurrentUserInfo();
  }, []);


  useEffect(() => {
    const fetchCoursesWithTeacherInfo = () => {
      try {
        const unsubscribe = firebase.firestore().collection('courses')
          .onSnapshot(async (snapshot) => {
            // Create an array of promises for fetching teacher info
            const teacherPromises = snapshot.docs.map(async (doc) => {
              const courseData = doc.data();
              // Fetch teacher info using teacher_id
              const teacherDoc = await firebase.firestore().collection('users').doc(courseData.teacher_id).get();
              if (teacherDoc.exists) {
                const teacherData = teacherDoc.data();
                courseData.teacher_id = teacherData.user_id;
                courseData.teacher_name = teacherData.name;
                courseData.teacher_image = teacherData.image;
              }
              return { id: doc.id, ...courseData };
            });

            // Wait for all teacher info promises to resolve
            const resolvedCoursesData = await Promise.all(teacherPromises);

            setUserCourses(resolvedCoursesData);
          });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching courses with teacher info:', error);
      }
    };

    fetchCoursesWithTeacherInfo();
  }, []);


  const handleEnroll = async (courseId) => {
    const enrolled = currentUserInfo.enrolls ? currentUserInfo.enrolls.includes(courseId) : false
    if(enrolled === true){
      alert("You have already enrolled in the course")
      return
    }
    const userRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
    try {
      await userRef.update({
        enrolls: firebase.firestore.FieldValue.arrayUnion(courseId)
      });
    } catch (error) {
      console.error('Error updating likes: ', error);
    }
  }
  // console.log(userCourses)
  const searchCourse = () => {

  }

  return (
    
      <View style={styles.mainPage}>
        <View style={styles.heading}>
          <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row' }}>
            <Feather name="book-open" size={30} color="black" style={{ marginVertical: 2 }} />
            <Text style={{ fontSize: 25 }}> Courses</Text>
          </View>
          <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end', marginBottom: 4 }}>
            <TouchableOpacity style={{ flexDirection: 'row' }} onPress={() => navigation.navigate('EnrolledCourses')}>
            <AntDesign name="export" size={24} color="black" />
              <Text style={{ fontSize: 16, marginVertical: 2 }}> Enrolled Courses</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.search}>
          <View style={styles.field}>
            <View style={{ marginVertical: 8, padding: 3, borderRadius: 3, marginRight: 5 }}><AntDesign name="search1" size={24} color="black" /></View>
            <TextInput
              style={{ color: 'black', width: '80%', fontSize: 18 }}
              placeholder='Class 8: Math'
              cursorColor={'black'}
              onChangeText={(text) => setSearchText(text)}></TextInput>
          </View>
          <TouchableOpacity onPress={searchCourse} >
            <View style={styles.myButton2}>
              <Text style={styles.buttonText}>Search</Text>
            </View>
          </TouchableOpacity>

        </View>
        <View View style={[styles.courseListing, { justifyContent: userCourses.length === 0 ? 'center' : null }, { alignItems: userCourses.length === 0 ? 'center' : null }]} >
          {userCourses.length === 0 ? <Text>NO course created yet</Text> :
            (<FlatList
              data={userCourses}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <Pressable onPress={() => { navigation.navigate('CourseDetails', { course: item }) }}>
                  <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['slateblue', 'firebrick']} style={styles.flatListContainer}>
                    <Text style={[styles.flatListText, { marginTop: 5 }]}>{"Course Title: " + item.title}</Text>
                    <Text style={[styles.flatListText, { fontSize: 17, marginTop: 5 }]}>{"Instructor: " + item.teacher_name}</Text>
                    <Text style={[styles.flatListText, { fontSize: 13, marginTop: 5 }]}>{"Description: " + item.description}</Text>
                    <TouchableOpacity style={styles.enrollButton} onPress={() => { handleEnroll(item.id)}}>
                      {currentUserInfo.enrolls && currentUserInfo.enrolls.includes(item.id) ? <Text style={{ color: 'white', fontWeight: 'bold' }}>Enrolled</Text> : <Text style={{ color: 'white', fontWeight: 'bold' }}>Enroll</Text>}
                    </TouchableOpacity>
                  </LinearGradient>
                </Pressable>
              )}
            />)}
        </View>
      </View >
  )
}

export default StudentCourses

const styles = StyleSheet.create({
  mainPage: {
    flex: 1,
    // marginTop: 40,
    flexDirection: 'column'
  },
  heading: {
    marginTop: 135,
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