import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { firebase } from '../../../config';
import Loader from '../../../components/Loader';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const InstructorInfo = ({ route }) => {
  const teacherId = route.params.teacherId;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();


  useEffect(() => {
    const fetchData = () => {
      try {
        setLoading(true);
        const userDocRef = firebase.firestore().collection('users').doc(teacherId);

        // Use onSnapshot to listen for real-time updates
        const unsubscribe = userDocRef.onSnapshot((doc) => {
          if (doc.exists) {

            setUserData(doc.data());
            setLoading(false);
          } else {
            // Handle the case where the document doesn't exist
            setUserData(null);
            setLoading(false);
          }
        });

        // Clean up the listener when the component unmounts or changes
        return () => {
          unsubscribe();
        };
      } catch (err) {
        console.log(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.mainContainer}>
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <FontAwesome5 name="arrow-left" size={20} color="black" />
        <Text style={{ fontSize: 16 }}> Go Back</Text>
      </TouchableOpacity>

      <View style={styles.heading}>
        <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row' }}>
          <FontAwesome6 name="circle-user" size={30} color="black" />
          <Text style={{ fontSize: 25 }}> Instructor Profile</Text>
        </View>
      </View>
      {loading === true ? (
        <Loader color='black' />
      ) : userData ? (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.profilePic}>
            <Image
              style={styles.image}
              source={!userData.image ? require('../../../assets/dummyUser.png') : { uri: userData.image }}
            />
          </View>
          <View style={styles.subHeading}>
            <Text style={{ fontSize: 18 }}>{"INSTRUCTOR INFORMATION"}</Text>
          </View>

          <View style={styles.details}>
            <View style={styles.inputField}>
              <Text style={{ fontSize: 17, marginVertical: 5 }}>Full Name:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={'dimgray'}
                value={userData.name ? userData.name : 'Not Provided Yet'}
                editable={false}
              />
            </View>
            <View style={styles.inputField}>
              <Text style={{ fontSize: 17, marginVertical: 5 }}>Email:</Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={'dimgray'}
                value={userData.email ? userData.email : 'Not Provided Yet'}
                editable={false}
              />
            </View>
            <View style={styles.inputField}>
              <Text style={{ fontSize: 17, marginVertical: 5 }}>Phone: </Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={'dimgray'}
                value={userData.phone ? userData.phone : 'Not Provided Yet'}
                editable={false}
              />
            </View>
            <View style={styles.inputField}>
              <Text style={{ fontSize: 17, marginVertical: 5 }}>Date of Birth: </Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={'dimgray'}
                value={userData.dob
                  ? userData.dob.toDate().toLocaleDateString('en-CA', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                  }).split('/').reverse().join('/') : 'Not Provided Yet'}
                editable={false}
              />
            </View>
            <View style={styles.inputField}>
              <Text style={{ fontSize: 17, marginVertical: 5 }}>Address: </Text>
              <TextInput
                style={styles.input}
                placeholderTextColor={'dimgray'}
                value={userData.country ? userData.sub_division + ', ' + userData.country : 'Not Provided Yet'}
                editable={false}
              />
            </View>
          </View>
          <Text style={{ fontSize: 17, marginTop: 5, width: '90%', alignSelf: 'center' }}>Location in Map:</Text>
                    <View style={{ height: 300 }}>
                        <View style={{ height: 300, marginTop: 10 }}>
                            {userData.latitude ? <MapView style={styles.map}
                                provider={PROVIDER_GOOGLE}
                                region={{
                                    latitude: userData.latitude,
                                    longitude: userData.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421
                                }}>
                                <Marker coordinate={{
                                    latitude: userData.latitude,
                                    longitude: userData.longitude,
                                    latitudeDelta: 0.0922,
                                    longitudeDelta: 0.0421
                                }} title='Your Location'></Marker>
                            </MapView> : <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'silver' }]}><Text style={{ fontSize: 20 }}>Not provided yet</Text></View>

                            }
                        </View>
          </View>
        </ScrollView>) :
        <Text style={{ justifyContent: 'center', alignItems: 'center' }}>No user data available</Text>
      }
    </View>
  )
}

export default InstructorInfo

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
    width: '90%',
    alignSelf: 'center',
    display: 'flex',
    flexDirection: 'row',
    marginBottom: 10
  },
  content: {
    marginTop: 10,
    width: '90%',
    alignSelf: 'center',
    marginBottom: 10

  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center'
  },

  profilePic: {
    display: 'flex',
    flexDirection: 'column'
  },
  uploadBtn: {
    width: '35%',
    backgroundColor: 'cadetblue',
    alignItems: 'center',
    padding: 8,
    borderRadius: 10,
    margin: 5,
    alignSelf: 'center'
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
    marginTop: 20,
    fontSize: 20,
    borderBottomWidth: 2,
    borderColor: 'silver',
    padding: 10,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    display: 'flex',
    flexDirection: 'column',
    // width : '100%'
  },
  input: {
    height: 50,
    fontSize: 17,
    padding: 5,
    color: 'dimgray',
    backgroundColor: 'white',
    paddingLeft: 15
  },
  locationBtn: {
    width: '90%',
    height: 50,
    backgroundColor: 'blueviolet',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 5,
    marginTop: 25,
    alignSelf: 'center'
  },
  map: {
    width: '90%',
    height: 250,
    borderRadius: 10,
    alignSelf: 'center',
    borderRadius: 10
  }
})