import React from 'react';
import {TextInput, StyleSheet} from 'react-native';
import {darkGreen} from './Constants';

const Field = (props) => {
  return (
    <TextInput
      {...props}
      style={[styles.field, {color: darkGreen}]}
      placeholderTextColor={darkGreen}></TextInput>
  );
};

export default Field;

const styles = StyleSheet.create({
    field: {
        borderRadius: 100,  
        paddingHorizontal: 10, 
        width: '78%', 
        backgroundColor: 'rgb(220,220, 220)', 
        marginVertical: 10,
        height: '6%',
        fontSize: 15
    }
})