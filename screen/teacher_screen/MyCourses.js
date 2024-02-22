import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons';
import CourseModal from '../../components/CourseModal';
import { firebase } from './../../config';
import { LinearGradient } from 'expo-linear-gradient';



const MyCourses = () => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [userCourses, setUserCourses] = useState([]);
  
  const openModal = () => {
    setModalVisible(true)
  }

  useEffect(() => {
    const fetchUserCourses = () => {
      try {
        const uID = firebase.auth().currentUser.uid;
        const unsubscribe = firebase.firestore().collection('courses')
          .where('teacher_id', '==', uID)
          .onSnapshot((snapshot) => {
            const coursesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUserCourses(coursesData);
          });

        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching user courses:', error);
      }
    };

    const unsubscribe = fetchUserCourses();

    return () => unsubscribe();
  }, []);

  // console.log('userCourses:', userCourses);


  const addCourse = async () => {
    try {
      if (courseName.length > 0 && courseDescription.length > 0) {
        const uID = firebase.auth().currentUser.uid;
        const fieldValue = firebase.firestore.FieldValue.serverTimestamp();
        await firebase.firestore().collection('courses').add({
          title: courseName,
          description: courseDescription,
          teacher_id: uID,
          doc: fieldValue
        })
          .then((docRef) => {
            return docRef.update({
              course_id: docRef.id
            });
          })
          .then(() => {
            setCourseName('')
            setCourseDescription('')
            setModalVisible(false)
            alert("Course created successfully");
          })
          .catch((err) => {
            console.log("Error adding course: ", err);
          })

      }
    }
    catch (err) {
      console.log("Error adding course: ", err)
    }

  }
  return (
    <View style={styles.mainPage}>
      {isModalVisible ? <CourseModal isModalVisible={isModalVisible} setModalVisible={setModalVisible} addCourse={addCourse}
        setCourseName={setCourseName} setCourseDescription={setCourseDescription} /> :
        (<>
          <View style={styles.scrollViewContent}>
            <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 18 }}>
              <Feather name="book-open" size={28} color="black" style={{ marginVertical: 2 }} />
              <Text style={{ fontSize: 25 }}>Courses</Text>
              <View style={styles.myButton}>
                <TouchableOpacity onPress={openModal} >
                  <Text style={styles.buttonText}>Create Course</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View View style={[styles.courseListing, { justifyContent: userCourses.length === 0 ? 'center' : null }, { alignItems: userCourses.length === 0 ? 'center' : null }]} >
            {userCourses.length === 0 ? <Text>NO course created yet</Text> :
              (<FlatList
                data={userCourses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable  onPress={() => alert('Press Worked')}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['slateblue', 'firebrick']} style={styles.flatListContainer}>
                      <Text style={styles.flatListText}>{"Course Title: " + item.title}</Text>
                      <Text style={[styles.flatListText, { fontSize: 13, marginTop: 5 }]}>{"Description: " + item.description}</Text>
                      <Text style={[styles.flatListText, { fontSize: 13, marginTop: 5 }]}>{'Created at: '+ item.doc.toDate().toLocaleDateString()}</Text>
                    </LinearGradient>
                  </Pressable>
                )}
              />)}
          </View>
        </>)}
    </View>
  )
}

export default MyCourses

const styles = StyleSheet.create({
  mainPage: {
    flex: 1,
    marginTop: 80,
    flexDirection: 'column'
  },
  scrollViewContent: {
    marginTop: 50
  },
  myButton: {
    backgroundColor: '#7B68EE',
    border: '2px solid green',
    borderRadius: 5,
    padding: 4,
    marginLeft: 114,
    marginTop: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',

  },
  courseListing: {
    marginTop: 10,
    flex: 1,
  },
  flatListContainer: {
    height: 120,
    width: '90%',
    alignSelf: 'center',
    borderRadius: 10,
    margin: 10,
  },
  flatListText: {
    fontSize: 18,
    marginLeft: 5,
    marginTop: 5,
    color: 'white'
  }
})

