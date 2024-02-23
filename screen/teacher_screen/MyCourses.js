import { StyleSheet, Text, View, TouchableOpacity, FlatList, Pressable, TextInput } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Feather } from '@expo/vector-icons';
import CourseModal from '../../components/CourseModal';
import { firebase } from './../../config';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';



const MyCourses = () => {

  const [isModalVisible, setModalVisible] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [userCourses, setUserCourses] = useState([]);
  const [searchText, setSearchText] = useState('')
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

  const searchCourse = () => {

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
                  <View style={{display: 'flex', flexDirection : 'row'}}>
                    <Ionicons name="add-circle-outline" size={20} color="white" />
                    <Text style={styles.buttonText}> Create Course</Text>
                  </View>

                </TouchableOpacity>
              </View>
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
            <View style={styles.myButton2}>
              <TouchableOpacity onPress={searchCourse} >
                <Text style={styles.buttonText}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
          <View View style={[styles.courseListing, { justifyContent: userCourses.length === 0 ? 'center' : null }, { alignItems: userCourses.length === 0 ? 'center' : null }]} >
            {userCourses.length === 0 ? <Text>NO course created yet</Text> :
              (<FlatList
                data={userCourses}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <Pressable onPress={() => alert('Press Worked')}>
                    <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['slateblue', 'firebrick']} style={styles.flatListContainer}>
                      <Text style={styles.flatListText}>{"Course Title: " + item.title}</Text>
                      <Text style={[styles.flatListText, { fontSize: 13, marginTop: 5 }]}>{"Description: " + item.description}</Text>
                      <Text style={[styles.flatListText, { fontSize: 13, marginTop: 5 }]}>{'Created at: ' + item.doc.toDate().toLocaleDateString()}</Text>
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
    backgroundColor: 'firebrick',
    border: '2px solid green',
    borderRadius: 10,
    padding: 4,
    height: 40,
    marginLeft: 80,
    width: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myButton2: {
    backgroundColor: 'royalblue',
    border: '2px solid green',
    borderRadius: 10,
    padding: 4,
    height: 50,
    width: '34%',
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
    marginLeft: 18
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

