import { StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Feather } from '@expo/vector-icons';
import { darkGreen } from './Constants';

const PasswordField = (props) => {
    // console.log(props.icon)
    return (
        <View style={styles.field}>
            <View style={{marginVertical: 7, padding:3, borderRadius: 3, marginRight: 7 }}>
                {props.icon}
            </View>
            <TextInput
                {...props}
                style={{ color: 'skyblue', width: '70%', fontSize: 18 }}
                placeholderTextColor={'skyblue'} />
            <TouchableOpacity onPress={props.togglePass}>
                <Text style={[styles.text, { color: 'skyblue' }]}>{props.showPass? <Feather name="eye" size={24} color="skyblue" /> : <Feather name="eye-off" size={24} color="skyblue" />}</Text>
            </TouchableOpacity>
        </View>

    )
}

export default PasswordField

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
    text: {
        fontSize: 12,
        marginVertical: 13,
        paddingLeft: 10
    }
})
