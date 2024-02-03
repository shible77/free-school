import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Field from '../components/Field';
import PasswordField from '../components/PasswordField';
import ColourfulText from '../components/ColorfulText';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import ColourfulButton from '../components/ColorfulButton';
import { Feather } from '@expo/vector-icons';

const Login = (props) => {
    const [showPass, setShowPass] = useState(true);
    const togglePass = () => {
        setShowPass(!showPass);
    }
    return (
        <KeyboardAvoidingWrapper>
            <View style={styles.container}>
                <View style={styles.innerView}>
                    <Image source={require('../assets/logo.png')} style={styles.logo} />
                    <ColourfulText text={'WELCOME BACK'} color={['aqua', 'deeppink']} style={{ fontSize: 40 }} />
                    <ColourfulText text={'Login to your account here'} color={['aqua', 'deeppink']} style={{ fontSize: 15, marginBottom: 20 }} />

                    <Field placeholder="Email"
                        autoCapitalize="none"
                        icon={<Feather name="mail" size={30} color="skyblue" />}
                        keyboardType={'email-address'} />
                    <PasswordField placeholder="Password" autoCapitalize="none" icon={<Feather name="lock" size={30} color="skyblue" />}
                        secureTextEntry={showPass} showPass={showPass} togglePass={togglePass} />


                    <View style={styles.innerView2}>
                        <Text style={[styles.text4, { color: 'skyblue' }]}>
                            Forgot Password ?
                        </Text>
                    </View>
                    <View style={styles.innerView4}>
                        <ColourfulButton buttonText={'Login'} color={['aqua', 'deeppink']} press={() => props.navigation.navigate("Login")} style={{ width: '66%', marginRight: 62 }} />
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
        marginBottom: 60
    },
    innerView3: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "center"
    },
    innerView4: {
        marginTop: 20, width: '100%', marginLeft: 60
    }
})
