import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons';
import CourseModal from '../../components/CourseModal';
import { firebase } from './../../config';


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
  
        // Return a cleanup function to unsubscribe from the snapshot listener
        return () => unsubscribe();
      } catch (error) {
        console.error('Error fetching user courses:', error);
      }
    };
  
    // Call the fetchUserCourses function to start listening for real-time updates
    const unsubscribe = fetchUserCourses();
  
    // Return a cleanup function to unsubscribe from the snapshot listener when the component unmounts
    return () => unsubscribe();
  }, []);
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
        (<ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 10 }}>
            <Feather name="book-open" size={28} color="black" style={{ marginVertical: 2 }} />
            <Text style={{ fontSize: 25 }}>Courses</Text>
            <View style={styles.myButton}>
              <TouchableOpacity onPress={openModal} >
                <Text style={styles.buttonText}>Create Course</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>

          </View>
        </ScrollView>)}
    </View>
  )
}

export default MyCourses

const styles = StyleSheet.create({
  mainPage: {
    flex: 1,
    marginVertical: 80,
    flexDirection: 'column'
  },
  scrollViewContent: {
    flex: 1,
    marginVertical: 50,
    // border: '2px solid red'
  },
  myButton: {
    backgroundColor: '#7B68EE',
    border: '2px solid green',
    borderRadius: 5,
    padding: 4,
    marginLeft: 120,
    marginVertical: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',

  }
})