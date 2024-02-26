import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native'
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


const EditProfile = () => {
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation();

    const [openStartDatePicker, setOpenStartDatePicker] = useState(false);
    const today = new Date();
    const startDate = getFormatedDate(
        today.setDate(today.getDate() + 1),
        "YYYY/MM/DD"
    );
    const [selectedStartDate, setSelectedStartDate] = useState("");
    const [startedDate, setStartedDate] = useState(startDate);

    function handleChangeStartDate(propDate) {
        setStartedDate(propDate);
    }

    const handleOnPressStartDate = () => {
        setOpenStartDatePicker(!openStartDatePicker);
    };


    const defaultDivision = { id: null, name: 'Select Division' };
    const defaultDistrict = { id: null, name: 'Select District' };
    const defaultUpazila = { id: null, name: 'Select Upazila' };
    const [selectedDivision, setSelectedDivision] = useState(defaultDivision);
    const [selectedDistrict, setSelectedDistrict] = useState(defaultDistrict);
    const [selectedUpazila, setSelectedUpazila] = useState(defaultUpazila);
    const [divisions, setDivisions] = useState([])
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    useEffect(() => {
        // Fetch divisions
        const fetchDivisions = async () => {
            try {
                const response = require('./../../assets/divisions.json');
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
                    const requiredDistricts = response[2].data.filter((district) => district.division_id === selectedDivision.id);
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
                    const requiredUpazilas = response[2].data.filter((upazila) => upazila.district_id === selectedDistrict.id);
                    setUpazilas(requiredUpazilas);
                }
            } catch (err) {
                console.error('Error reading upazilas.json:', err);
            }
        };
        fetchUpazilas();
    }, [selectedDivision, selectedDistrict]);

    useEffect(() => {
        const fetchData = () => {
            try {
                const userDocRef = firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid);
                const unsubscribe = userDocRef.onSnapshot((doc) => {
                    setUserData(doc.data());
                });
                return () => {
                    unsubscribe();
                };
            } catch (err) {
                console.log(err.message);
            }
        };

        fetchData();
    }, []);



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
                    <Text style={{ fontSize: 25 }}> Edit Profile</Text>
                </View>
            </View>
            {userData ?
                (<ScrollView contentContainerStyle={styles.content}>
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
                                value={userData.phone}

                            />
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
                                {[defaultDivision, ...divisions].map((division, index) => (
                                    <Picker.Item key={index} label={division.name} value={division} />
                                ))}
                            </Picker>

                            <Text style={{ fontSize: 17, marginVertical: 5 }}>Select District: </Text>
                            <Picker
                                selectedValue={selectedDistrict}
                                onValueChange={(itemValue) => setSelectedDistrict(itemValue)}
                                style={styles.pickerStyle}
                            >
                                {[defaultDistrict, ...districts].map((district, index) => (
                                    <Picker.Item
                                        key={index}
                                        label={district.name}
                                        value={district}
                                    />
                                ))}
                            </Picker>

                            <Text style={{ fontSize: 17, marginVertical: 5 }}>Select Upazila: </Text>
                            <Picker
                                selectedValue={selectedUpazila}
                                onValueChange={(itemValue) => setSelectedUpazila(itemValue)}
                                style={styles.pickerStyle}
                            >
                                {[defaultUpazila, ...upazilas].map((upazila, index) => (
                                    <Picker.Item
                                        key={index}
                                        label={upazila.name}
                                        value={upazila}
                                    />
                                ))}
                            </Picker>
                        </View>
                        <View style={styles.btnView}>
                            <TouchableOpacity style={styles.submitBtn}>
                                <Text style={{fontSize : 20}}>Submit</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </ScrollView>) :
                <Loader color='black' />
            }
        </View>
    )
}

export default EditProfile

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
        display : 'flex',
        marginTop : 60
    },
    submitBtn : {
        backgroundColor : 'seagreen',
        borderRadius : 10,
        width : '100%',
        height : 50,
        alignSelf : "center",
        justifyContent : 'center',
        alignItems : 'center'
    }
})