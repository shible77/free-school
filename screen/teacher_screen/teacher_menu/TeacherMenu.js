import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import ColourfulButton from '../../../components/ColorfulButton'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';

const Menu = ({ navigation }) => {

  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection('users')
      .doc(firebase.auth().currentUser.uid)
      .onSnapshot((snapshot) => {
        if (snapshot.exists) {
          setUserData(snapshot.data());
        } else {
          // Handle the case when the document doesn't exist
          setUserData(null);
        }
      });

    // Cleanup function to unsubscribe from the listener when the component unmounts
    return () => {
      unsubscribe();
    };
  }, []);


  const logoutUser = async () => {
    await AsyncStorage.removeItem('user')
    firebase.auth().signOut();
  }

  return (
    <View style={styles.mainPage}>
      {userData ?
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 20 }}>
            <Ionicons name="menu" size={30} color="black" />
            <Text style={{ fontSize: 25 }}>Menu</Text>
          </View>
          <TouchableOpacity onPress={() => { navigation.navigate('TeacherProfile') }}>
            <View style={styles.profile}>
              {userData.image ?
                <Image
                  style={styles.image}
                  source={{ uri: userData.image }}
                /> :
                <FontAwesome name="user-circle-o" size={40} color="black" />}
              <Text style={{ fontSize: 21, color: 'black', marginLeft: 10, marginTop: 5 }}>{' ' + userData.name ? userData.name : userData.email}</Text>
            </View>
          </TouchableOpacity>
          <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 25, display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
            <Pressable onPress={() => navigation.navigate('CoursesNavigation', {screen : 'MyCourses'})}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['royalblue', 'maroon']} style={styles.gridContainer}>
                <Text style={styles.gridText}>Your Courses</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('MyVideos')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['royalblue', 'maroon']} style={styles.gridContainer}>
                <Text style={styles.gridText}>Your Videos</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => navigation.navigate('MyQuizzes')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['royalblue', 'maroon']} style={styles.gridContainer}>
                <Text style={styles.gridText}>Your Quizzes</Text>
              </LinearGradient>
            </Pressable>
            <Pressable onPress={() => alert('pressed')}>
              <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={['royalblue', 'maroon']} style={styles.gridContainer}>
                <Text style={styles.gridText}>Report</Text>
              </LinearGradient>
            </Pressable>
          </View>
        </ScrollView> : <Text style={{ flex: 1 }}>No Data available</Text>}
      <View style={styles.buttonView}>
        <ColourfulButton buttonText={'Logout'} color={['aqua', 'deeppink']} press={logoutUser} />
      </View>
    </View>
  )
}

export default Menu

const styles = StyleSheet.create({
  mainPage: {
    flex: 1,
    // marginVertical: 80,
    flexDirection: 'column',
    width: '100%',
    alignSelf: 'center'
  },
  scrollViewContent: {
    marginVertical: 130,
    width: '100%'
  },
  buttonView: {
    flex: 1,
    position: 'absolute',
    width: '80%',
    marginTop: 780,
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    // borderWidth : 1,
    // borderColor : 'black',
    borderRadius: 15,
    width: '90%',
    padding: 10,
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: 'darkgray'
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // alignSelf: 'center'
  },
  gridContainer: {
    height: 120,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    margin: 5
  },
  gridText: {
    fontSize: 20,
    color: 'white'
  }
})