import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { firebase } from '../../config'


const EditCourseDetails = () => {
  const navigation = useNavigation();
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
      
    </View>
  )
}

export default EditCourseDetails

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
    width: '90%',
    alignSelf: 'center',
    flex: 1

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
    // width : '100%'
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
  pickerStyle: {
    height: 40,
    color: 'dimgray',
    backgroundColor: 'white',
  },
  btnView: {
    display: 'flex',
    marginTop: 70
  },
  submitBtn: {
    backgroundColor: 'seagreen',
    borderRadius: 10,
    width: '100%',
    height: 50,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center'
  },
  successMessage: {
    backgroundColor: 'cadetblue',
    borderRadius: 10,
    width: '100%',
    height: 50,
    alignSelf: "center",
    justifyContent: 'center',
    alignItems: 'center'
  }
})