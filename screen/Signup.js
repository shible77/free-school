import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Field from '../components/Field';
import PasswordField from '../components/PasswordField';
import ColourfulText from '../components/ColorfulText';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import ColourfulButton from '../components/ColorfulButton';
import { Feather } from '@expo/vector-icons';
import { firebase } from '../config';
import Loader from '../components/Loader';

const Login = (props) => {

  const [data, setData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    type: ''
  })
  const [showPass1, setShowPass1] = useState(true);
  const [showPass2, setShowPass2] = useState(true);
  const [showLoader, setShowLoader] = useState(false)

  const togglePass1 = () => {
    setShowPass1(!showPass1);
  }

  const togglePass2 = () => {
    setShowPass2(!showPass2);
  }

  const registerUser = async () => {
    try {
      setShowLoader(true)
      await firebase.auth().createUserWithEmailAndPassword(data.email, data.password)
        .then(() => {
          firebase.auth().currentUser.sendEmailVerification({
            handleCodeInApp: true,
            url: 'https://mymobileapp-85398.firebaseapp.com',
          })
            .then(() => {
              setShowLoader(false)
              alert('Verification email sent')
              setData({
                ...data, email: '',
                password: '',
                confirm_password: '',
                type: ''
              })
              props.navigation.navigate("Login")
            }).catch((err) => {
              console.log(err)
            })
            .then(() => {
              firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
                email: data.email,
                password: data.password,
                type: data.type
              })
            }).catch((err) => {
              console.log(err)
            })
        }).catch((err) => {
          console.log(err)
        })
    } catch (err) {
      console.log(err)
    }
  }

  return (
    <View style={{flex: 1}}>{showLoader===true ? <Loader size='large' color='black' /> :
      (<KeyboardAvoidingWrapper>
        <View style={styles.container}>
          <View style={styles.innerView}>
            <Image source={require('../assets/logo.png')} style={styles.logo} />
            <ColourfulText text={'SIGN UP'} color={['aqua', 'deeppink']} style={{ fontSize: 40 }} />
            <ColourfulText text={'Create your account here'} color={['aqua', 'deeppink']} style={{ fontSize: 15 }} />
            <Field placeholder="Email" autoCapitalize="none" icon={<Feather name="mail" size={30} color="skyblue" />}
              keyboardType={'email-address'}
              value={data.email}
              onChangeText={(text) => setData({ ...data, email: text })} />
            <PasswordField placeholder="Password" autoCapitalize="none" icon={<Feather name="lock" size={29} color="skyblue" />}
              secureTextEntry={showPass1} showPass={showPass1} togglePass={togglePass1}
              value={data.password}
              onChangeText={(text) => setData({ ...data, password: text })} />
            <PasswordField placeholder="Confirm Password" autoCapitalize="none" icon={<Feather name="lock" size={29} color="skyblue" />}
              secureTextEntry={showPass2} showPass={showPass2} togglePass={togglePass2}
              value={data.confirm_password}
              onChangeText={(text) => setData({ ...data, confirm_password: text })} />
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'skyblue' }}>Signup as: </Text>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setData({ ...data, type: 'teacher' })}>
                <Radio selected={data.type === 'teacher'} />
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'skyblue' }}>Teacher</Text>
              </TouchableOpacity>

              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setData({ ...data, type: 'student' })}>
                <Radio selected={data.type === 'student'} />
                <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'skyblue' }}>Student</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.innerView2}>
              <ColourfulButton buttonText={'Signup'} color={['aqua', 'deeppink']} press={registerUser} style={{ width: '66%', marginRight: 62 }} />
            </View>

            <View style={styles.innerView3}>
              <Text style={styles.text5}>Already have an account? </Text>
              <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
                <Text style={[styles.text6, { color: 'skyblue' }]}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingWrapper>
    )}</View>
  );
};

const Radio = ({ selected }) => (
  <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'skyblue', margin: 5 }}>
    {selected && <View style={{ flex: 1, borderRadius: 11, backgroundColor: 'skyblue' }} />}
  </View>
);

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
    marginTop: 60, width: '100%', marginLeft: 60
  }
  ,
  innerView3: {
    display: 'flex',
    flexDirection: 'row'
  }
})


