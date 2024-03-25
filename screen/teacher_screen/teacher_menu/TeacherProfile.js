import { ScrollView, StyleSheet, Text, View, Image, TouchableOpacity, TextInput, } from 'react-native'
import React, { useState, useEffect } from 'react'
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { firebase } from '../../../config';
import Loader from '../../../components/Loader';
import UploadModal from '../../../components/UploadModal';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';

import axios from 'axios';

const TeacherProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false)
    const [modalVisible, setModalVisible] = useState(false)
    const [showLocation, setShowLocation] = useState(false)
    const navigation = useNavigation();

    useEffect(() => {
        const fetchData = () => {
            try {
                setLoading(true);
                const userDocRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);

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


    const openModal = () => {
        setModalVisible(!modalVisible)
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        // console.log(result)
        if (!result.canceled) {
            uploadToCloudinary(result.assets[0].uri);
        }
    };

    const takePicture = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            uploadToCloudinary(result.assets[0].uri);
        }
    };

    const uploadToCloudinary = async (uri) => {
        try {
            const data = new FormData();
            data.append('file', {
                uri,
                type: 'image/jpeg', // adjust the type based on the file type
                name: 'upload.jpg',
            });

            const preset_key = "uploadimage";
            const cloud_name = "doh71p23w";
            setUploading(true)
            const response = await axios.post(
                `https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`,
                data,
                {
                    withCredentials: false,

                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    params: {
                        upload_preset: preset_key,
                    },
                }
            );

            const result = response.data;
            //  console.log(result.secure_url)
            firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).update({ image: result.secure_url })
                .then(() => {
                    setUploading(false)
                    setModalVisible(false)
                }).catch((err) => {
                    console.log("firebase err : " + err.code)
                })

        } catch (error) {
            console.error('Error uploading to Cloudinary:', error.message);
        }
    };


    return (
        <View style={styles.mainContainer}>
            <View>
                {modalVisible ? <UploadModal isModalVisible={modalVisible} setModalVisible={setModalVisible} pickImage={pickImage} takePicture={takePicture} uploading={uploading} /> : null}
            </View>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={20} color="black" />
                <Text style={{ fontSize: 16 }}> Go Back</Text>
            </TouchableOpacity>

            <View style={styles.heading}>
                <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start', flexDirection: 'row' }}>
                    <FontAwesome6 name="circle-user" size={30} color="black" />
                    <Text style={{ fontSize: 25 }}> Profile</Text>
                </View>
                <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                    <TouchableOpacity onPress={() => { navigation.navigate('EditProfile') }} style={{ flexDirection: 'row' }}>
                        <Feather name="edit" size={24} color="black" />
                        <Text style={{ fontSize: 16, marginVertical: 2 }}> EDIT</Text>
                    </TouchableOpacity>
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
                        <TouchableOpacity style={styles.uploadBtn} onPress={openModal}>
                            <Text>Change Image</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.subHeading}>
                        <Text style={{ fontSize: 18 }}>{"YOUR PERSONAL INFORMATION"}</Text>
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
                                value={userData.district ? userData.upazila + ', ' + userData.district + ', ' + userData.division : 'Not Provided Yet'}
                                editable={false}
                            />
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => { setShowLocation(!showLocation) }} style={styles.locationBtn}>
                        {!showLocation ? <Text style={{ fontSize: 19, color: 'white' }}>Show location in map</Text> : <Text style={{ fontSize: 19, color: 'white' }}>Hide Map</Text>}
                    </TouchableOpacity>
                    <View style={{ height: 300 }}>{showLocation && <View style={{ height: 300, marginTop: 20 }}>
                        {userData.latitude ? <MapView style={styles.map}
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
                            }} title='Marker'></Marker>
                        </MapView> : <View style={[styles.map, { justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'silver' }]}><Text style={{ fontSize: 20 }}>Not provided yet</Text></View>

                        }
                    </View>}
                    </View>
                </ScrollView>) :
                <Text style={{ justifyContent: 'center', alignItems: 'center' }}>No user data available</Text>
            }
        </View>
    );
};

export default TeacherProfile;

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