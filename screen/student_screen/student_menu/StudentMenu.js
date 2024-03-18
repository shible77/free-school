import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import ColourfulButton from '../../../components/ColorfulButton'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from '../../../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentMenu = ({ navigation }) => {

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
  // console.log(userData)
  const logoutUser = async() => {
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
          <TouchableOpacity onPress={() => { navigation.navigate('StudentProfile') }}>
            <View style={styles.profile}>
              {userData.image ?
                <Image
                  style={styles.image}
                  source={{ uri: userData.image }}
                /> :
                <FontAwesome name="user-circle-o" size={40} color="black" />}
              {userData.name ? <Text style={{ fontSize: 21, color: 'black', marginLeft: 10,marginTop : 5}}>{userData.name}</Text> : 
              <Text style={{ fontSize: 21, color: 'black', marginLeft: 10, marginTop : 5}}>{userData.email}</Text>
              }
            </View>
          </TouchableOpacity>
        </ScrollView> : <Text style={{flex : 1}}>No Data available</Text>}
      <View style={styles.buttonView}>
        <ColourfulButton buttonText={'Logout'} color={['aqua', 'deeppink']} press={logoutUser} />
      </View>
    </View>
  )
}

export default StudentMenu

const styles = StyleSheet.create({
  mainPage: {
    flex: 1,
    // marginVertical: 80,
    flexDirection: 'column',
    width : '100%',
    alignSelf : 'center'
  },
  scrollViewContent: {
    flex : 1,
    marginVertical: 130,
    border: '2px solid red',
    width : '100%'
  },
  buttonView: {
    flex: 1,
    position: 'absolute',
    width: '80%',
    marginTop : 780,
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
})