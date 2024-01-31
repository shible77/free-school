import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Background from '../components/Background';
import Btn from '../components/Btn';
import { darkGreen } from '../components/Constants';
import Field from '../components/Field';
import PasswordField from '../components/PasswordField';

const Login = (props) => {

  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <Background>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.innerView}>
          <Text style={[styles.text2, { color: darkGreen }]}>
            Create Your Account
          </Text>

          <Field
            placeholder="Full Name"
            keyboardType={'default'}
          />

          <Field
            placeholder="Email"
            keyboardType={'email-address'}
          />

          <Field
            placeholder="Username"
            keyboardType={'default'}
          />

          <Field
            placeholder="Phone Number"
            keyboardType={'phone-pad'}
          />

          <Field
            placeholder="Address"
            keyboardType={'default'}
          />

          <PasswordField placeholder="Password" secureTextEntry={true} />
          <PasswordField placeholder="Confirm Password" secureTextEntry={true} />

          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 15, color: darkGreen }}>Signup as: </Text>
            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setSelectedOption('teacher')}>
              <Radio selected={selectedOption === 'teacher'} />
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: darkGreen }}>Teacher</Text>
            </TouchableOpacity>

            <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => setSelectedOption('student')}>
              <Radio selected={selectedOption === 'student'} />
              <Text style={{ fontWeight: 'bold', fontSize: 15, color: darkGreen }}>Student</Text>
            </TouchableOpacity>
          </View>
          <Btn textColor='white' bgColor={darkGreen} btnLabel="Signup" Press={() => alert("Logged In")} />
          <View style={styles.innerView3}>
            <Text style={styles.text5}>Already have an account ? </Text>
            <TouchableOpacity onPress={() => props.navigation.navigate("Login")}>
              <Text style={[styles.text6, { color: darkGreen }]}>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </Background>
  );
};

const Radio = ({ selected }) => (
  <View style={{ width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: darkGreen, margin: 5 }}>
    {selected && <View style={{ flex: 1, borderRadius: 9, backgroundColor: darkGreen }} />}
  </View>
);

export default Login;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    width: 460,
    flex: 1
  },
  text1: {
    fontSize: 50,
    fontWeight: 'bold',
    marginVertical: 20,
    marginRight: 75
  },
  text2: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10
  },
  text3: {
    color: 'grey',
    fontSize: 19,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text4: {
    fontWeight: 'bold',
    fontSize: 16
  },
  text5: {
    fontSize: 16,
    fontWeight: "bold"
  },
  text6: {
    fontWeight: 'bold',
    fontSize: 16
  },
  innerView: {
    backgroundColor: 'white',
    height: 700,
    width: 400,
    borderTopLeftRadius: 130,
    paddingTop: 60,
    alignItems: 'center',
    marginRight: 75,
    marginVertical: 60
  },
  innerView2: {
    alignItems: 'flex-end',
    width: '78%',
    paddingRight: 16,
    marginBottom: 200
  },
  innerView3: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: "center"
  },
})