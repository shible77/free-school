import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native'
import React, {useState} from 'react'
import { Feather } from '@expo/vector-icons';
import CourseModal from '../../components/CourseModal';


const MyCourses = () => {

  const [isModalVisible, setModalVisible] = useState(false);
  const openModal= () => {
    setModalVisible(true)
  }

  const addCourse = () => {

  }

  return (
    
    <View style={styles.mainPage}>
      {isModalVisible ? <CourseModal isModalVisible={isModalVisible} setModalVisible={setModalVisible} addCourse={addCourse}/> : 
      (<ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 10}}>
          <Feather name="book-open" size={28} color="black" style={{ marginVertical: 2 }} />
          <Text style={{ fontSize: 25 }}>Courses</Text>
          <View style={styles.myButton}>
            <TouchableOpacity onPress={openModal} >
              <Text style={styles.buttonText}>Create Course</Text>
            </TouchableOpacity>
          </View>
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
    border: '2px solid red'
  },
  myButton: {
    backgroundColor: '#7B68EE',
    border: '2px solid green',
    borderRadius: 5,
    padding: 4,
    marginLeft: 95,
    marginVertical: 2,
  },
  buttonText: {
    fontSize: 20,
    color: 'white'
  }
})