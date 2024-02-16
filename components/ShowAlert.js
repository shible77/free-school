import { StyleSheet, Text, View } from 'react-native';
import React, { useRef, useEffect } from 'react';
import Animated, { Easing, useSharedValue, withSpring, withTiming, interpolate, Extrapolate } from 'react-native-reanimated';


const ShowAlert = (props) => {
    const showAlertOpacity = useSharedValue(0);

    useEffect(() => {
        showAlertOpacity.value = withSpring(1, { damping: 10, stiffness: 80 });
        setTimeout(() => {
            showAlertOpacity.value = withTiming(0, { duration: 500, easing: Easing.ease });
        }, 3000);
    }, []);

    const translateY = interpolate(showAlertOpacity.value, [0, 1], [-100, 0], Extrapolate.CLAMP);

    return (
        <Animated.View style={[styles.container, { opacity: showAlertOpacity, transform: [{ translateY }] }, props.positionStyle]}>
            <View style={styles.iconContainer}>{props.icon}</View>
            <Text style={[styles.text, { color: props.color }]}>{props.message}</Text>
        </Animated.View>
    );
};

export default ShowAlert;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        borderRadius: 6,
        fontSize: 15,
        backgroundColor: 'red',
        width: '78%',
        height: '7%',
        alignItems: 'center',
        position: 'absolute',
    },
    iconContainer: {
        marginRight: 2,
    },
    text: {
        fontSize: 15,
    },
});
