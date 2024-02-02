import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {darkGreen, green} from './Constants';

const Field = (props) => {
  return (
    <TextInput
      {...props}
      style={[styles.field,{color: 'skyblue'}]}
      placeholderTextColor={'skyblue'}></TextInput>
  );
};

export default Field;

const styles = StyleSheet.create({
  field: {
    borderWidth: 2, 
    borderColor: 'lightskyblue',
    borderRadius: 10,
    paddingHorizontal: 10,
    width: '78%',
    marginVertical: 10,
    height: '9%',
    fontSize: 15
  }
  
})
