import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

export default function Btn({bgColor, btnLabel, textColor, Press}) {
  return (
    <TouchableOpacity
    onPress={Press}
      style={[styles.button, {backgroundColor: bgColor}]}>
      <Text style={[styles.btnLevel, {color: textColor}]}>
        {btnLabel}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
    button: {
        borderRadius: 100,
        alignItems: 'center',
        width: 350,
        paddingVertical: 5,
        marginVertical: 10
    },
    btnLevel:{ 
        fontSize: 25, 
        fontWeight: 'bold'
    }
})