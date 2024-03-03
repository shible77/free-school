import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { firebase } from '../../config'


const CourseDetails = ({ route }) => {
  const navigation = useNavigation();
  const [courseData, setCourseData] = useState(route.params.courseData);
  // console.log(courseData)

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="black" />
        <Text style={{ fontSize: 16 }}> Go Back</Text>
      </TouchableOpacity>
      <View style={styles.heading}>
        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
          <AntDesign name="layout" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Course Details</Text>
        </View>
        <TouchableOpacity onPress={() => { navigation.navigate('EditCourseDetails') }}>
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
              value={courseData.title}
              editable={false}
            />
          </View>
          <View style={styles.inputField}>
            <Text style={{ fontSize: 17, marginVertical: 5 }}>Course Description:</Text>
            <TextInput
              style={[styles.input, { height: 90 }]}
              placeholderTextColor={'dimgray'}
              value={courseData.description}
              multiline
              editable={false}
            />
          </View>
          <View style={styles.inputField}>
            <Text style={{ fontSize: 17, marginVertical: 5 }}>Course Creation Date:</Text>
            <TextInput
              style={styles.input}
              placeholderTextColor={'dimgray'}
              value={courseData.doc.toDate().toLocaleDateString('en-CA', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
              }).split('/').reverse().join('-')}
              editable={false}
            />
          </View>
          <View style={{ alignSelf: 'center', marginTop: 20, backgroundColor: 'snow', width: '100%', height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 5, borderColor: 'dimgray', borderWidth: 2 }}>
            <Text style={{ fontSize: 20 }}>Your Videos and Quizzes</Text>
          </View>
          <View style={styles.btnView}>
            <TouchableOpacity onPress={() => { navigation.navigate('Videos') }}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['midnightblue', 'maroon']} style={styles.uploadVideoBtn}>
                <Text style={styles.btnText}>Videos</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Quizzes') }}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['midnightblue', 'maroon']} style={styles.uploadVideoBtn}>
                <Text style={styles.btnText}>Quizzes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

    </View >
  )
}

export default CourseDetails

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    marginTop: 120,
    flexDirection: 'column'
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
    marginTop: 20,
    alignSelf: 'center',
    width: '90%'
  }
  ,
  uploadVideoBtn: {
    height: 100,
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
  }
})