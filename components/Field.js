import React from 'react';
import {TextInput, StyleSheet, View} from 'react-native';
import {darkGreen, green} from './Constants';

const Field = (props) => {
  return (
    <View style={[styles.field, {color: 'sky blue'}]}>
      <View style={{marginVertical: 8, padding:3, borderRadius: 3, marginRight: 7 }}>{props.icon}</View>
    <TextInput
      {...props}
      style={[styles.input,{color: 'skyblue', width: '80%', fontSize: 18}]}
      placeholderTextColor={'skyblue'}></TextInput>
    </View>
  );
};

export default Field;

const styles = StyleSheet.create({
  field: {
    borderWidth: 2, 
    borderColor: 'lightskyblue',
    borderRadius: 10,
    paddingHorizontal: 5,
    width: '78%',
    marginVertical: 10,
    height: '9%',
    fontSize: 15,
    display: 'flex',
    flexDirection: 'row',
  },
  input: {
    marginVertical: 11,
    fontSize:  18,
    paddingLeft: 0
  }
  
})
