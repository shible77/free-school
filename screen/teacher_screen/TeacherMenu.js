import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ColourfulButton from '../../components/ColorfulButton'
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { firebase } from './../../config';

const Menu = ({ navigation }) => {

  const [userEmail, setUserEmail] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userSnapshot = await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).get();
        const userData = userSnapshot.data();
        setUserEmail(userData.email);
      } catch (err) {
        console.log(err.message);
      }
    };
    fetchData();
  }, []);

  const logoutUser = () => {
    firebase.auth().signOut();
  }

  return (
    <View style={styles.mainPage}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={{ display: 'flex', flexDirection: 'row', marginLeft: 20 }}>
          <Ionicons name="menu" size={30} color="black" />
          <Text style={{ fontSize: 25 }}>Menu</Text>
        </View>
        <TouchableOpacity onPress={() => {navigation.navigate('TeacherProfile')}}>
          <View style={styles.profile}>
            <FontAwesome name="user-circle-o" size={24} color="white" />
            <Text style={{ fontSize: 18, color: 'white' }}>{' ' + userEmail}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
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
    backgroundColor: 'dimgray'
  }
})