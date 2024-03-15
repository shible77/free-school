import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import { FontAwesome6 } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { firebase } from '../../config'
import Loader from '../../components/Loader';
import { Picker } from '@react-native-picker/picker';
import { getFormatedDate } from "react-native-modern-datepicker";
import DateModal from '../../components/DateModal';
import ToastNotification from '../../components/Toast';
import { AntDesign } from '@expo/vector-icons';



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

    function handleChangeStartDate(propDate) {
        setStartedDate(propDate);
    }

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };


    // let defaultDivision = 'Select Division';
    // let defaultDistrict = 'Select District';
    // let defaultUpazila = 'Select Upazila';
    const [selectedDivision, setSelectedDivision] = useState(null);
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [selectedUpazila, setSelectedUpazila] = useState(null);
    const [divisions, setDivisions] = useState([])
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);
    const [phoneError, setPhoneError] = useState('');
    const [showMessage, setShowMessage] = useState(false)

    useEffect(() => {
        // Validate phone number when userData changes
        if (userData && userData.phone && userData.phone.length !== 11) {
            setPhoneError('Please enter a valid phone number with 11 digits.');
        } else {
            setPhoneError('');
        }
    }, [userData]);

    useEffect(() => {
        // Fetch divisions
        const fetchDivisions = async () => {
            try {
                const response =  require('./../../assets/divisions.json');
                setDivisions(response[2].data);
            } catch (error) {
                console.error('Error reading divisions.json:', error);
            }
        };
        fetchDivisions();
    }, [])

    useEffect(() => {
        const fetchDistricts = async () => {
            try {
                if (selectedDivision) {  // Add a check here
                    const response = require('./../../assets/districts.json');
                    const selected_division = divisions.filter((division) => division.name === selectedDivision);
                    // console.log(selected_division)
                    const requiredDistricts = response[2].data.filter((district) => district.division_id === selected_division[0].id);
                    setDistricts(requiredDistricts);
                }
            } catch (err) {
                console.error('Error reading districts.json:', err);
            }
        };
        fetchDistricts();
    }, [selectedDivision]);

    useEffect(() => {
        const fetchUpazilas = async () => {
            try {
                if (selectedDistrict) {  // Add a check here
                    const response = require('./../../assets/upazilas.json');
                    const selected_district = districts.filter((district) => district.name === selectedDistrict);
                    const requiredUpazilas = response[2].data.filter((upazila) => upazila.district_id === selected_district[0].id);
                    setUpazilas(requiredUpazilas);
                }
            } catch (err) {
                console.error('Error reading upazilas.json:', err);
            }
        };
        fetchUpazilas();
    }, [selectedDistrict]);

    useEffect(() => {
        const fetchData = () => {
            try {
                return firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).onSnapshot((doc) => {
                    if (doc.exists) {
                        const userData = doc.data();
                        setUserData(userData);
                        setSelectedDivision(userData.division);
                        setSelectedDistrict(userData.district);
                        setSelectedUpazila(userData.upazila);
        
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
                division: selectedDivision,
                district: selectedDistrict,
                upazila: selectedUpazila,
                dob: timestamp
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
        <View style={styles.mainContainer}>
            {openStartDatePicker ? <DateModal openStartDatePicker={openStartDatePicker}
                startDate={startDate} startedDate={startedDate}
                handleChangeStartDate={handleChangeStartDate}
                setSelectedStartDate={setSelectedStartDate}
                handleOnPressStartDate={handleOnPressStartDate}

            /> : null}
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                <FontAwesome5 name="arrow-left" size={20} color="black" />
                <Text style={{ fontSize: 16 }}> Go Back</Text>
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
                                        keyboardType='phone-pad'
                                        value={userData.phone}
                                        onChangeText={(text) => setUserData({ ...userData, phone: text })}
                                    />
                                    {phoneError ? (
                                        <Text style={{ color: 'red' }}>{phoneError}</Text>
                                    ) : null}
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
                                    {/* Division Dropdown */}
                                    <Text style={{ fontSize: 17, marginVertical: 5 }}>Select Division: </Text>
                                    <Picker
                                        selectedValue={selectedDivision}
                                        onValueChange={(itemValue) => setSelectedDivision(itemValue)}
                                        style={styles.pickerStyle}
                                    >
                                        {[{name: 'Select Division'},...divisions].map((division, index) => (
                                            <Picker.Item
                                                key={index}
                                                label={division.name}
                                                value={division.name} 
                                                enabled={index !== 0} />
                                        ))}
                                    </Picker>

                                    <Text style={{ fontSize: 17, marginVertical: 5 }}>Select District: </Text>
                                    <Picker
                                        selectedValue={selectedDistrict}
                                        onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
                                        style={styles.pickerStyle}
                                    >
                                        {[{name: 'Select District'},...districts].map((district, index) => (
                                            <Picker.Item
                                                key={index}
                                                label={district.name}
                                                value={district.name}
                                                enabled={index !== 0}
                                            />
                                        ))}
                                    </Picker>

                                    <Text style={{ fontSize: 17, marginVertical: 5 }}>Select Upazila: </Text>
                                    <Picker
                                        selectedValue={selectedUpazila}
                                        onValueChange={(itemValue) => setSelectedUpazila(itemValue)}
                                        style={styles.pickerStyle}
                                    >
                                        {[{name: 'Select Upazila'},...upazilas].map((upazila, index) => (
                                            <Picker.Item
                                                key={index}
                                                label={upazila.name}
                                                value={upazila.name}
                                                enabled={index !== 0}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                                <View style={styles.btnView}>
                                    <TouchableOpacity style={styles.submitBtn} onPress={() => handleSubmit()}>
                                        <Text style={{ fontSize: 20 }}>Update</Text>
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
    )
}

export default EditProfile

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
        display: 'flex',
        flexDirection: 'row',
        alignSelf: 'center',
        width: '90%'
    },
    content: {
        marginTop: 10,
        width: '90%',
        alignSelf: 'center',
        flex: 1

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
        marginTop: 70
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
    }
})