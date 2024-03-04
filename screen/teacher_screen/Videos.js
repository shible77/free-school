import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { Octicons } from '@expo/vector-icons';
import { firebase } from '../../config'

const Videos = ({ route }) => {
  const navigation = useNavigation()
  const courseId = route.params.courseId;
  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="black" />
        <Text style={{ fontSize: 16 }}> Go Back</Text>
      </TouchableOpacity>
      <View style={styles.heading}>
        <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
          <Octicons name="video" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Videos</Text>
        </View>
        <TouchableOpacity onPress={() => {alert('pressed')}}>
          <View style={{ flex: 1, justifyContent: 'flex-end', flexDirection: 'row', marginTop: 5 }}>
          <Feather name="upload" size={24} color="black" />
            <Text style={{ fontSize: 16, marginVertical: 2 }}>UPLOAD</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default Videos

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
})