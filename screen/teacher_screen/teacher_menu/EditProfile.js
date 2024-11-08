import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { firebase } from '../../../config'
import Loader from '../../../components/Loader';
import { Picker } from '@react-native-picker/picker';
import { getFormatedDate } from "react-native-modern-datepicker";
import DateModal from '../../../components/DateModal';
import ToastNotification from '../../../components/Toast';
import { AntDesign } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { ApolloClient, InMemoryCache, gql, ApolloProvider } from '@apollo/client';

const client = new ApolloClient({
    uri: 'https://countries.trevorblades.com/',
    cache: new InMemoryCache()
});

const GET_COUNTRIES = gql`
  query {
    countries {
      name
      subdivisions {
        name
      }
    }
  }
`;

const CountryDataFetcher = ({ onDataFetch }) => {
    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await client.query({ query: GET_COUNTRIES });
                onDataFetch(data);
            } catch (error) {
                console.error('Error fetching country data:', error);
            }
        };

        fetchData();
    }, [onDataFetch]);

    return null;
};

const EditProfile = () => {
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const today = new Date();
    const startDate = getFormatedDate(
        today.setDate(today.getDate()),
        "YYYY/MM/DD"
    );
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [startedDate, setStartedDate] = useState(startDate);
    const [showToast, setShowToast] = useState(false);
    const [countriesData, setCountriesData] = useState(null);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [selectedSubdivision, setSelectedSubdivision] = useState(null);

    const handleDataFetch = data => {
        setCountriesData(data);
    };

    const handleCountryChange = country => {
        setSelectedCountry(country);
        setSelectedSubdivision(null); // Reset selected subdivision when country changes
    };

    function handleChangeStartDate(propDate) {
        setStartedDate(propDate);
    }

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };

    const [initialLocation, setInitialLocation] = useState({
        latitude: 23.8103,
        longitude: 90.4125,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
    });
    const [phoneError, setPhoneError] = useState('');

    useEffect(() => {
        // Validate phone number when userData changes
        if (userData && userData.phone) {
            const slicedString = userData.phone.slice(0, 3);
            if (userData.phone.length == 11 && (slicedString == '011'
                || slicedString == '013' || slicedString == '014'
                || slicedString == '015' || slicedString == '016'
                || slicedString == '017' || slicedString == '018'
                || slicedString == '019')) {
                setPhoneError('');
            }
            else {
                setPhoneError('Mobile Number is invalid');
            }
        } else {
            setPhoneError('');
        }
    }, [userData]);

    useEffect(() => {
        const fetchData = () => {
            try {
                return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).onSnapshot((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        setUserData(userData);
                        setSelectedCountry(userData.country);
                        setSelectedSubdivision(userData.sub_division);
                        userData.latitude ? setInitialLocation({ ...initialLocation, latitude: userData.latitude, longitude: userData.longitude }) : null

                        if (userData.dob) {
                            const date = new Date(userData.dob.toDate());
                            setSelectedStartDate(getFormatedDate(date, "YYYY/MM/DD"));
                        }
                    }
                }, (error) => {
                    console.error('Error fetching user data:', error);
                });
            } catch (err) {
                console.log(err.message);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        async function getPermission() {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
            }
        }
        getPermission();
    }, []);

    const userLocation = async () => {
        let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
        setInitialLocation({
            ...initialLocation,
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
        });
    };

    const handleSubmit = async () => {
        try {
            const parts = selectedStartDate.split('/');
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Months are zero-based
            const day = parseInt(parts[2], 10);

            const dateObject = new Date(year, month, day);

            const timestamp = firebase.firestore.Timestamp.fromDate(dateObject);

            await firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({
                name: userData.name,
                phone: userData.phone,
                country: selectedCountry,
                sub_division: selectedSubdivision,
                dob: timestamp,
                latitude: initialLocation.latitude,
                longitude: initialLocation.longitude
            }).then(() => {
                setShowToast(true)
                setTimeout(() => {
                    setShowToast(false);
                }, 3000);
            }).catch((err) => {
                console.log(err);
            });
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <ApolloProvider client={client}>
            <CountryDataFetcher onDataFetch={handleDataFetch} />
            <View style={styles.mainContainer}>
                {openStartDatePicker ? <DateModal openStartDatePicker={openStartDatePicker}
                    startDate={startDate} startedDate={startedDate}
                    handleChangeStartDate={handleChangeStartDate}
                    setSelectedStartDate={setSelectedStartDate}
                    handleOnPressStartDate={handleOnPressStartDate}

                /> : null}
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <FontAwesome5 name="arrow-left" size={25} color="black" />
                    {/* <Text style={{ fontSize: 16 }}> Go Back</Text> */}
                </TouchableOpacity>
                <View style={styles.heading}>
                    <View style={{ flex: 1, justifyContent: 'flex-start', flexDirection: 'row' }}>
                        <Feather name="edit" size={30} color="black" />
                        <Text style={{ fontSize: 25 }}> Edit Your Info</Text>
                    </View>
                </View>
                {userData ?
                    (
                        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
                            <ScrollView contentContainerStyle={styles.content}>
                                <View style={styles.details}>
                                    <View style={styles.inputField}>
                                        <Text style={{ fontSize: 17, marginVertical: 5 }}>Full Name:</Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholderTextColor={'dimgray'}
                                            cursorColor={'black'}
                                            value={userData.name}
                                            onChangeText={(text) => setUserData({ ...userData, name: text })}
                                        />
                                    </View>
                                    <View style={styles.inputField}>
                                        <Text style={{ fontSize: 17, marginVertical: 5 }}>Phone: </Text>
                                        <TextInput
                                            style={styles.input}
                                            placeholderTextColor={'dimgray'}
                                            cursorColor={'black'}
                                            keyboardType='number-pad'
                                            value={userData.phone}
                                            onChangeText={(text) => setUserData({ ...userData, phone: text })}
                                        />
                                        {phoneError ? (
                                            <View style={{ flexDirection: 'row' }}>
                                                <MaterialIcons name="error-outline" size={17} color="red" />
                                                <Text style={{ color: 'red' }}>{phoneError}</Text>
                                            </View>) : null}
                                    </View>
                                    <View style={styles.inputField}>
                                        <Text style={{ fontSize: 17, marginVertical: 5 }}>Date of Birth: </Text>
                                        <TouchableOpacity onPress={handleOnPressStartDate}>
                                            <TextInput
                                                style={styles.input}
                                                placeholderTextColor={'dimgray'}
                                                value={selectedStartDate || "Click to select date"}
                                                editable={false}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    <View>
                                        <Text style={{ fontSize: 17, marginVertical: 5 }}>Country:</Text>
                                        <Picker
                                            selectedValue={selectedCountry}
                                            onValueChange={(itemValue) => handleCountryChange(itemValue)}
                                            style={styles.pickerStyle}
                                        >
                                            {countriesData && countriesData.countries.map((country, index) => (
                                                <Picker.Item key={index} label={country.name} value={country.name} />
                                            ))}
                                        </Picker>
                                        <Text style={{ fontSize: 17, marginVertical: 5 }}>Subdivision:</Text>
                                        <Picker
                                            selectedValue={selectedSubdivision}
                                            onValueChange={(itemValue) => setSelectedSubdivision(itemValue)}
                                            style={styles.pickerStyle}
                                            enabled={selectedCountry !== null}
                                        >
                                            {selectedCountry && countriesData &&
                                                countriesData.countries.find(country => country.name === selectedCountry)?.subdivisions.map((subdivision, index) => (
                                                    <Picker.Item key={index} label={subdivision.name} value={subdivision.name} />
                                                ))
                                            }
                                        </Picker>
                                    </View>
                                    <View style={{ marginTop: 50 }}>
                                        <TouchableOpacity onPress={() => { userLocation() }} style={styles.locationBtn}>
                                            <Text style={{ fontSize: 15, color: 'black' }}>Get Your Current Location</Text>
                                        </TouchableOpacity>

                                        <MapView style={styles.map}
                                            provider={PROVIDER_GOOGLE}
                                            region={{
                                                latitude: initialLocation.latitude,
                                                longitude: initialLocation.longitude,
                                                latitudeDelta: 0.0922,
                                                longitudeDelta: 0.0421
                                            }}>
                                            <Marker coordinate={{
                                                latitude: initialLocation.latitude,
                                                longitude: initialLocation.longitude,
                                                latitudeDelta: 0.0922,
                                                longitudeDelta: 0.0421
                                            }} title='Your Location'></Marker>
                                        </MapView>
                                    </View>
                                    <View style={styles.btnView}>
                                        <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit()}>
                                            <Text style={{ fontSize: 20 }}>Save</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>

                            </ScrollView>
                        </KeyboardAvoidingView>) :
                    <Loader color='black' />
                }
                {showToast ? <ToastNotification
                    icon={<AntDesign name="checkcircle" size={27} color="white" />}
                    message='Your Info Updated Successfully'
                    color="green"
                    bottom={55} /> : null}
            </View>
        </ApolloProvider>
    )
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // marginTop: 120,
        flexDirection: 'column',
    },
    backButton: {
        marginLeft : 5,
        display: 'flex',
        flexDirection: 'row',
        marginTop: 45,
        width: 50,
        justifyContent: 'center',
        height : 50,
        // backgroundColor: 'rgba(255, 255, 255, 0.9)',
        alignItems : 'center',
        borderRadius : 25,
        padding : 5,  
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, 
        shadowRadius: 3.84,
        elevation: 5
    },
    heading: {
        marginTop: 20,
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
        width: '90%',
        marginBottom: 10,
    },
    content: {
        marginTop: 10,
        width: '90%',
        alignSelf: 'center',

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
        marginTop: 20,
        height: 100
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
    },
    map: {
        width: '100%',
        height: 250,
        borderRadius: 10,
        alignSelf: 'center',
        marginTop: 15
    },
    locationBtn: {
        width: '60%',
        height: 50,
        backgroundColor: 'lightgray',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5,
        borderRadius: 5,
        alignSelf: 'flex-end',
        borderWidth: 1,
        borderColor: 'black'
    }
})

export default EditProfile;
