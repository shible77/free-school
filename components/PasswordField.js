import { StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { darkGreen } from './Constants';

const PasswordField = (props) => {
    return (
        <View style = {styles.field}>
            <TextInput
                {...props}
                style={{ color: darkGreen, width: '85%' }}
                placeholderTextColor={darkGreen} />
            <TouchableOpacity onPress={() => {alert('pressed')}}>
                <Text style={[styles.text, {color: darkGreen}]}>Show</Text>
            </TouchableOpacity>
        </View>

    )
}

export default PasswordField

const styles = StyleSheet.create({
    field: {
        borderRadius: 100,
        paddingHorizontal: 10,
        width: '78%',
        backgroundColor: 'rgb(220,220, 220)',
        marginVertical: 10,
        height: '6%',
        fontSize: 15,
        display: 'flex',
        flexDirection: 'row',
    },
    text: {
        fontSize: 13,
        marginVertical: 10
    }
})

//change for insert in github