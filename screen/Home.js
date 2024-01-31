import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Background from '../components/Background';
import Btn from '../components/Btn';
import { darkGreen, purple } from '../components/Constants';

const Home = (props) => {
    return (
        <Background>
            <View style={styles.container}>
                <Text style={styles.text}>Let's start</Text>
                <Text style={styles.text1}>Teaching</Text>
                <Text style={styles.text1}>and</Text>
                <Text style={styles.text1}>Learning</Text>
                <View style={styles.btnContainer}>
                    <Btn bgColor={purple} textColor='white' btnLabel="Login" Press={() => props.navigation.navigate("Login")} />
                    <Btn bgColor='white' textColor={darkGreen} btnLabel="Signup" Press={() => props.navigation.navigate("Signup")} />
                </View>
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 100
    },
    text: {
        color: 'rgb(147, 112, 219)',
        fontSize: 64
    },
    text1: {
        color: 'rgb(147, 112, 219)',
        fontSize: 40
    },
    btnContainer: {
        marginTop: 50
    }
})

export default Home;

//change for insert in github