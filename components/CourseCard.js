import { StyleSheet, Text, View, Touchable } from 'react-native'
import React from 'react'

const CourseCard = () => {
  return (
    <View style={styles.container}>
            <Touchable onPress={props.press}>
                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={props.color} style={styles.gradientButton}>
                    <Text style={[styles.buttonText]}>{props.buttonText}</Text>
                </LinearGradient>
            </Touchable>
        </View>
  )
}

export default CourseCard

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        padding: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        width: "30%",
        height: '50%'
    },
    gradientButton: { 
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold'
    }
})