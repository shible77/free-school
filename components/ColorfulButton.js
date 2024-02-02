import * as React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const ColourfulButton = (props) => {
    return (
        <View style={props.style}>
            <TouchableOpacity onPress={props.press}>

                <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={props.color} style={styles.gradientButton}>
                    <Text style={[styles.buttonText]}>{props.buttonText}</Text>
                </LinearGradient>

            </TouchableOpacity>
        </View>
    );
};

export default ColourfulButton

const styles = StyleSheet.create({
    gradientButton: {
        display: 'flex',
        padding: 5,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 10,
        width: "118%"
    },
    buttonText: {
        fontSize: 25,
        color: '#fff',
        fontWeight: 'bold'
    }
})
