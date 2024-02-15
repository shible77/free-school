import { StyleSheet, Text, View } from 'react-native'
import React from 'react'


const ShowMessage = (props) => {
    return (
        <View style={styles.view}>
            <View style={styles.iconContainer}>{props.icon}</View>
            <Text style={[styles.text, { color: props.color }]}>{props.message}</Text>
        </View>
    )
}

export default ShowMessage

const styles = StyleSheet.create({
    view: {
        margin: 1,
        display: 'flex',
        width: '78%',
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
      },
      iconContainer: {
        marginRight: 2,
      },
      text: {
        fontSize: 10,
      },
})