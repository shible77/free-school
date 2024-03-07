import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ColourfulButton from '../../components/ColorfulButton'
import { Ionicons } from '@expo/vector-icons';
import {firebase} from './../../config'
import AsyncStorage from '@react-native-async-storage/async-storage';

const Menu = () => {

  const logoutUser = async() => {
    await  AsyncStorage.removeItem('user')
    firebase.auth().signOut();
  }

  return (
    <View style={styles.mainPage}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={{display: 'flex', flexDirection: 'row'}}>
        <Ionicons name="menu" size={30} color="black" />
          <Text style={{fontSize: 25}}>Menu</Text>
        </View>
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
  }
})