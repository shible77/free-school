import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import Field from '../components/Field';
import PasswordField from '../components/PasswordField';
import ColourfulText from '../components/ColorfulText';
import KeyboardAvoidingWrapper from '../components/KeyboardAvoidingWrapper';
import ColourfulButton from '../components/ColorfulButton';
import { Feather } from '@expo/vector-icons';

const Login = (props) => {

  const [selectedOption, setSelectedOption] = useState(null);
  const [showPass1, setShowPass1] = useState(true);
  const [showPass2, setShowPass2] = useState(true);

  const togglePass1 = () => {
    setShowPass1(!showPass1);
  }

  const togglePass2 = () => {
    setShowPass2(!showPass2);
  }

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        <View style={styles.innerView}>
          <Image source={require('../assets/logo.png')} style={styles.logo} />
          <ColourfulText text={'SIGN UP'} color={['aqua', 'deeppink']} style={{ fontSize: 40 }} />
          <ColourfulText text={'Create your account here'} color={['aqua', 'deeppink']} style={{ fontSize: 15 }} />
          <Field placeholder="Email" autoCapitalize="none" icon={<Feather name="mail" size={30} color="skyblue" />}
            keyboardType={'email-address'} />
          <PasswordField placeholder="Password" autoCapitalize="none" icon={<Feather name="lock" size={29} color="skyblue" />}
            secureTextEntry={showPass1} showPass={showPass1} togglePass={togglePass1} />
          <PasswordField placeholder="Confirm Password" autoCapitalize="none" icon={<Feather name="lock" size={29} color="skyblue" />}
            secureTextEntry={showPass2} showPass={showPass2} togglePass={togglePass2} />
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'skyblue' }}>Signup as: </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setSelectedOption('teacher')}>
              <Radio selected={selectedOption === 'teacher'} />
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'skyblue' }}>Teacher</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setSelectedOption('student')}>
              <Radio selected={selectedOption === 'student'} />
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: 'skyblue' }}>Student</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.innerView2}>
            <ColourfulButton buttonText={'Signup'} color={['aqua', 'deeppink']} press={() => props.navigation.navigate("Login")} style={{ width: '66%', marginRight: 62 }} />
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
  );
};

const Radio = ({ selected }) => (
  <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'skyblue', margin: 5 }}>
    {selected && <View style={{ flex: 1, borderRadius: 9, backgroundColor: 'skyblue' }} />}
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


