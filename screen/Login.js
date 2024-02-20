import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Field from '../components/Field';
import PasswordField from '../components/PasswordField';
import ColourfulText from '../components/ColorfulText';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import ColourfulButton from '../components/ColorfulButton';
import { Feather } from '@expo/vector-icons';
import { firebase } from '../config'
import ShowAlert from '../components/ShowAlert'
import { MaterialIcons } from '@expo/vector-icons';
// import Loader from '../components/Loader';

const Login = (props) => {
    const [data, setData] = useState({
        email: '',
        password: '',
    })
    const [showPass, setShowPass] = useState(true);
    const [isCorrect, setIsCorrect] = useState(false)
    const [isFillUpAll, setIsFillUpAll] = useState(false)
    const [isValidEmail, setIsValidEmail] = useState(false)

    const togglePass = () => {
        setShowPass(!showPass);
    }

    const loginUser = async () => {
        if (data.email === "" || data.password === "") {
            setIsFillUpAll(true)
            setTimeout(() => {
                setIsFillUpAll(false)
            }, 5000)
            return;
        }
        try {
            await firebase.auth().signInWithEmailAndPassword(data.email, data.password)
                .then(() => {

                }).catch((err) => {
                    console.log(err.message)
                })
        } catch (error) {
            if (error.message === 'auth/invalid-email') {
                setIsValidEmail(true);
                setTimeout(() => {
                    setIsValidEmail(false)
                }, 5000)
            }
            else if (error.message === 'auth/invalid-login-credentials') {
                setIsCorrect(true);
                setTimeout(() => {
                    setIsCorrect(false)
                }, 5000)
            }
            else {
                console.error(error.message);
            }

        }
    }

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingWrapper>
                <View style={styles.container}>
                    <View style={styles.innerView}>
                        <Image source={require('../assets/logo.png')} style={styles.logo} />
                        <ColourfulText text={'WELCOME BACK'} color={['aqua', 'deeppink']} style={{ fontSize: 40 }} />
                        <ColourfulText text={'Login to your account here'} color={['aqua', 'deeppink']} style={{ fontSize: 15, marginBottom: 20 }} />

                        <Field placeholder="Email"
                            autoCapitalize="none"
                            icon={<Feather name="mail" size={30} color="skyblue" />}
                            keyboardType={'email-address'}
                            value={data.email}
                            onChangeText={(text) => setData({ ...data, email: text })} />
                        <PasswordField placeholder="Password" autoCapitalize="none" icon={<Feather name="lock" size={30} color="skyblue" />}
                            secureTextEntry={showPass} showPass={showPass} togglePass={togglePass}
                            value={data.password}
                            onChangeText={(text) => setData({ ...data, password: text })}
                        />


                        <View style={styles.innerView2}>
                            <Text style={[styles.text4, { color: 'skyblue' }]}>
                                Forgot Password ?
                            </Text>
                        </View>
                        {isCorrect && <ShowAlert message="Invalid login credentials" icon={<MaterialIcons name="error-outline" size={18} color="white" />} color="white" positionStyle={{ position: 'absolute', top: 525, left: 42.5, right: 0 }} />}
                        {isFillUpAll && <ShowAlert message="You can't leave any field empty" icon={<MaterialIcons name="error-outline" size={18} color="white" />} color="white" positionStyle={{ position: 'absolute', top: 525, left: 42.5, right: 0 }} />}
                        {isValidEmail && <ShowAlert message="Give a valid email address" icon={<MaterialIcons name="error-outline" size={18} color="white" />} color="white" positionStyle={{ position: 'absolute', top: 525, left: 42.5, right: 0 }} />}
                        <View style={styles.innerView4}>
                            <ColourfulButton buttonText={'Login'} color={['aqua', 'deeppink']} press={loginUser} style={{ width: '66%', marginRight: 62 }} />
                        </View>
                        <View style={styles.innerView3}>
                            <Text style={styles.text5}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => props.navigation.navigate("Signup")}>
                                <Text style={[styles.text6, { color: 'skyblue' }]}>Signup</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingWrapper>
        </View>
    );
};
export default Login;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white'
    },
    innerView: {
        display: 'flex',
        height: '95%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 60

    },
    logo: {
        height: 120,
        width: 160
    },
    innerView2: {
        alignItems: 'flex-end',
        width: '78%',
        paddingRight: 16,
        marginBottom: 10
    },
    innerView3: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "center",
    },
    innerView4: {
        marginTop: 50, width: '100%', marginLeft: 65
    }
})
