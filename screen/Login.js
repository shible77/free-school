import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Field from '../components/Field';
import PasswordField from '../components/PasswordField';
import ColourfulText from '../components/ColorfulText';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import ColourfulButton from '../components/ColorfulButton';

const Login = (props) => {

    return (
        <KeyboardAvoidingWrapper>
            <View style={styles.container}>

                <View style={styles.innerView}>
                    <Image source={require('../assets/logo.png')} style={styles.logo} />
                    <ColourfulText text={'WELCOME BACK'} color={['aqua', 'deeppink']} style={{ fontSize: 40 }} />
                    <ColourfulText text={'Login to your account here'} color={['aqua', 'deeppink']} style={{ fontSize: 15 }} />
                    <Field placeholder="Email"
                        keyboardType={'email-address'}  />
                    <PasswordField placeholder="Password" secureTextEntry={true}/>
                    <View style={styles.innerView2}>
                        <Text style={[styles.text4, { color: 'skyblue' }]}>
                            Forgot Password ?
                        </Text>
                    </View>
                    <ColourfulButton buttonText={'Login'} color={['aqua', 'deeppink']} press={() => props.navigation.navigate("Login")}  style={{ width: '66%', marginRight: 62 }}/>


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
        marginBottom: 90
    },
    innerView3: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "center"
    },
})
