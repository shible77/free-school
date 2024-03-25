import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from '../../../config'

const EnrolledCoursesDetails = ({ route }) => {
  const {course} = route.params
  const navigation = useNavigation();
  return (
<View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="black" />
        <Text style={{ fontSize: 16 }}> Go Back</Text>
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
            <TouchableOpacity onPress={() => { navigation.navigate('Videos',{courseId : course.course_id}) }}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['midnightblue', 'maroon']} style={styles.uploadVideoBtn}>
                <Text style={styles.btnText}>Videos</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { navigation.navigate('Quizzes',{courseId : course.course_id}) }}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['midnightblue', 'maroon']} style={styles.uploadVideoBtn}>
                <Text style={styles.btnText}>Quizzes</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
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
  }
})