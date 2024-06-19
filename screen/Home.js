import React from 'react';
import { View, StyleSheet} from 'react-native';
import { StatusBar } from 'react-native';
import Background from '../components/Background';
import ColourfulText from '../components/ColorfulText';
import ColourfulButton from '../components/ColorfulButton';

const Home = (props) => {
    return (
        <>
        <StatusBar translucent backgroundColor="black" />
        <Background>
            <View style={styles.container}>
                <ColourfulText text={'Lets Start'} color={['#3CB371', 'dodgerblue']} style={{ fontSize: 64 }} />
                <ColourfulText text={'Teaching'} color={['#3CB371', 'dodgerblue']} style={{ fontSize: 50 }} />
                <ColourfulText text={'And '} color={['#3CB371', 'dodgerblue']} style={{ fontSize: 50 }} />
                <ColourfulText text={'Learning'} color={['#3CB371', 'dodgerblue']} style={{ fontSize: 50 }} />
                <View style={styles.btnContainer}>
                    <ColourfulButton buttonText={'Login'} color={['#3CB371', 'dodgerblue']} press={() => props.navigation.navigate("Login")} />
                    <ColourfulButton buttonText={'Signup'} color={['#3CB371', 'dodgerblue']} press={() => props.navigation.navigate("Signup")} />
                    <ColourfulButton buttonText={'Fun Zone'} color={['#3CB371', 'dodgerblue']} press={() => props.navigation.navigate("Detection")} />
                    <ColourfulButton buttonText={'About Us'} color={['#3CB371', 'dodgerblue']} press={() => props.navigation.navigate("About")} />
                </View>
            </View>
        </Background>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 150
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
