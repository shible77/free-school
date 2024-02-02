import { StyleSheet, TextInput, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { darkGreen } from './Constants';

const PasswordField = (props) => {
    return (
        <View style={styles.field}>
            <TextInput
                {...props}
                style={{ color: 'skyblue', width: '85%' }}
                placeholderTextColor={'skyblue'} />
            <TouchableOpacity onPress={() => { alert('pressed') }}>
                <Text style={[styles.text, { color: 'skyblue' }]}>Show</Text>
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
        paddingHorizontal: 10,
        width: '78%',
        marginVertical: 10,
        height: '9%',
        fontSize: 15,
        display: 'flex',
        flexDirection: 'row',
    },
    text: {
        fontSize: 12,
        marginVertical: 13
    }
})
