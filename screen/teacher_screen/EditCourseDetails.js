import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { firebase } from '../../config'
import ToastNotification from '../../components/Toast';
import { AntDesign } from '@expo/vector-icons';

const EditCourseDetails = ({ route }) => {
  const navigation = useNavigation();
  const courseId = route.params.courseId
  const [courseData, setCourseData] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchCourseData = () => {
      try {
        const unsubscribe = firebase.firestore().collection('courses').doc(courseId).onSnapshot((doc) => {
          setCourseData(doc.data())
        })
        return () => unsubscribe() //cleanup when component is unmounted
      } catch (err) {
        console.log(err.code)
      }
    }
    const unsubscribe = fetchCourseData()
    return () => unsubscribe();
  }, [])

  const updateDetails = async () => {
    try {
      // console.log(courseData)
      await firebase.firestore().collection('courses').doc(courseData.course_id).update({
        title: courseData.title,
        description: courseData.description,
      }).then(() => {
        setShowToast(true)
        setTimeout(() => {
          setShowToast(false);
        }, 5000);
      }).catch((err) => {
        console.log(err.code, err.message)
      })
    } catch (err) {
      console.log(err.code)
    }
  }

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="black" />
        <Text style={{ fontSize: 16 }}> Go Back</Text>
      </TouchableOpacity>
      <View style={styles.heading}>
        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
          <Feather name="edit" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Edit Course Details</Text>
        </View>
      </View>

      {courseData ? (<ScrollView contentContainerStyle={styles.content}>
        <View style={styles.details}>
          <View style={styles.inputView}>
            <Text style={styles.inputHeading}>Course Title:</Text>
            <TextInput style={styles.input}
              placeholderTextColor={'dimgray'}
              placeholder='Class 8: Math'
              cursorColor={'black'}
              value={courseData.title}
              onChangeText={(text) => setCourseData({ ...courseData, title: text })} />
          </View>
          <View style={styles.inputView}>
            <Text style={styles.inputHeading}>Course Title:</Text>
            <TextInput style={[styles.input, {height : 90}]}
              placeholderTextColor={'dimgray'}
              placeholder='write a short description'
              cursorColor={'black'}
              value={courseData.description}
              multiline
              onChangeText={(text) => setCourseData({ ...courseData, description: text })} />
          </View>
          <TouchableOpacity onPress={updateDetails}  style={styles.submitBtn}>
              <Text style={styles.btnText}>Update</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>) :
        <ActivityIndicator size="large" color="black" />}
      {showToast ? <ToastNotification
        icon={<AntDesign name="checkcircle" size={27} color="white" />}
        message='Details Updated Successfully'
        color="green"
        bottom={30} /> : null}
    </View>
  )
}

export default EditCourseDetails

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 120,
    flexDirection: 'column',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  backButton: {
    marginLeft: 15,
    display: 'flex',
    flexDirection: 'row',
    marginTop: 5,
    width: '90%',
    justifyContent: 'flex-start'
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
    width: '90%',
    alignSelf: 'center',
    // flex: 1

  },
  details: {
    display: 'flex',
    flexDirection: 'column',
    alignSelf: 'center',
    width: '100%',
    marginTop: 10
  },
  inputView: {
    display: 'flex',
    alignSelf : 'center',
    width : '90%',
    marginTop : 5
  },
  inputHeading : {
    fontSize : 18,
  },
  input: {
    backgroundColor : 'white',
    width : '100%',
    height : 50,
    padding : 5,
    fontSize : 18,
    color : 'dimgray',
    paddingLeft : 15

  },
  submitBtn: {
    backgroundColor: 'seagreen',
    borderRadius: 10,
    width: '90%',
    height: 50,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  },
  btnText: {
    fontSize: 20
  },
})