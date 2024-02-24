import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import Field from '../components/Field';
import PasswordField from '../components/PasswordField';
import ColourfulText from '../components/ColorfulText';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import ColourfulButton from '../components/ColorfulButton';
import { Feather } from '@expo/vector-icons';
import { firebase } from '../config';
import Loader from '../components/Loader';
import ShowMessage from '../components/ShowMessage';
import { MaterialIcons } from '@expo/vector-icons';
import ShowAlert from '../components/ShowAlert';

const Login = (props) => {

  const [data, setData] = useState({
    email: '',
    password: '',
    confirm_password: '',
    type: ''
  })
  const [showPass1, setShowPass1] = useState(true);
  const [showPass2, setShowPass2] = useState(true);
  const [showLoader, setShowLoader] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [perfectPass, setPerfectPass] = useState(false);
  const [passMatched, setPassMatched] = useState(false);
  const [selectType, setSelectType] = useState(false)

  const togglePass1 = () => {
    setShowPass1(!showPass1);
  }

  const togglePass2 = () => {
    setShowPass2(!showPass2);
  }

  const registerUser = async () => {
    if (data.type === '' || data.email === '' || data.password === '' || data.confirm_password === '') {
      setSelectType(true);
      setTimeout(() => {
        setSelectType(false)
      }, 5000)
      return
    }
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
              const uId = firebase.auth().currentUser.uid;
              firebase.firestore().collection('users').doc(firebase.auth().currentUser.uid).set({
                user_id: uId,
                email: data.email,
                password: data.password,
                type: data.type,
                name: "",
                division: "",
                district: "",
                upazila: "",
                dob: null,
                phone: "",
                createdAt: null,
                image: ""
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

  useEffect(() => {
    const checkEmailAvailability = async () => {
      try {
        if (data.email.trim() !== '') {
          const querySnapshot = await firebase.firestore().collection('users').where('email', '==', data.email).get();
          setEmailExists(!querySnapshot.empty);
        }
      } catch (error) {
        console.log(error);
      }
    };

    checkEmailAvailability();
  }, [data.email])

  useEffect(() => {
    const checkLength = async () => {
      setPerfectPass(data.password.length < 6 && data.password.length > 0)
    }
    checkLength();
  }, [data.password])

  useEffect(() => {
    const checkMatch = async () => {
      setPassMatched(data.password !== data.confirm_password && data.confirm_password.length > 0);
    }
    checkMatch();
  }, [data.confirm_password])

  return (
    <View style={{ flex: 1 }}>{showLoader === true ? <Loader size='large' color='black' /> :
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
            {emailExists && <ShowMessage message="This email is already in use." icon={<MaterialIcons name="error-outline" size={13} color="red" />} color='red' />}
            <PasswordField placeholder="Password" autoCapitalize="none" icon={<Feather name="lock" size={29} color="skyblue" />}
              secureTextEntry={showPass1} showPass={showPass1} togglePass={togglePass1}
              value={data.password}
              onChangeText={(text) => setData({ ...data, password: text })} />
            {perfectPass && <ShowMessage message="Password must be at least 6 characters long" icon={<MaterialIcons name="error-outline" size={13} color="red" />} color="red" />}
            <PasswordField placeholder="Confirm Password" autoCapitalize="none" icon={<Feather name="lock" size={29} color="skyblue" />}
              secureTextEntry={showPass2} showPass={showPass2} togglePass={togglePass2}
              value={data.confirm_password}
              onChangeText={(text) => setData({ ...data, confirm_password: text })} />
            {passMatched && <ShowMessage message="Both passwords didn't match" icon={<MaterialIcons name="error-outline" size={13} color="red" />} color="red" />}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
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
            {selectType && <ShowAlert message="You can't leave any field empty" icon={<MaterialIcons name="error-outline" size={18} color="white" />} color="white" positionStyle={{ position: 'absolute', top: 560, left: 40.5, right: 0 }} />}
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
    marginTop: 50, width: '100%', marginLeft: 60
  }
  ,
  innerView3: {
    display: 'flex',
    flexDirection: 'row'
  }
})
