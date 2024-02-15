import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ShowAlert = (props) => {
    return (
        <View style={styles.container}>
            <View style={styles.iconContainer}>{props.icon}</View>
            <Text style={[styles.text, { color: props.color }]}>{props.message}</Text>
        </View>
    )
}

export default ShowAlert

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        border: '2px solid red',
        borderRadius: 6,
        fontSize: 15,
        backgroundColor: 'red',
        width: '78%',
        height: '5%',
        alignItems: 'center'

    },
    iconContainer:{
        marginRight: 2,
    },
    text: {
        fontSize: 15,
    }

})