import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import ColourfulButton from '../../components/ColorfulButton'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from './../../config';

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
  

  const logoutUser = () => {
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
                <FontAwesome name="user-circle-o" size={30} color="black" />}
              <Text style={{ fontSize: 21, color: 'black', marginLeft: 10, marginTop: 5 }}>{' ' + userData.name ? userData.name : userData.email}</Text>
            </View>
          </TouchableOpacity>
        </ScrollView> : <Text>No Data available</Text>}
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
    marginVertical: 80,
    flexDirection: 'column'
  },
  scrollViewContent: {
    flex: 3,
    marginVertical: 50,
    border: '2px solid red'
  },
  buttonView: {
    flex: 1,
    position: 'absolute',
    top: 700,
    justifyContent: 'flex-end',
    width: '66%',
    left: 35
  },
  profile: {
    display: 'flex',
    flexDirection: 'row',
    // borderWidth : 1,
    // borderColor : 'black',
    borderRadius: 10,
    width: '90%',
    padding: 10,
    alignSelf: 'center',
    marginTop: 10,
    backgroundColor: 'white'
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    // alignSelf: 'center'
  },
})