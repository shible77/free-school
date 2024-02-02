import * as React from 'react';
import { Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import MaskedView from '@react-native-masked-view/masked-view';

const ColourfulText = (props) => {
    return (
        <MaskedView maskElement={<Text style={props.style}>{props.text}</Text>}>
            <LinearGradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} colors={props.color}>
                <Text style={[{ opacity: 0 }, props.style]}>{props.text}</Text>
            </LinearGradient>
        </MaskedView>
    );
};
export default ColourfulText;

