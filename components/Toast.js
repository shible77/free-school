import React from "react";
import { View, Text } from "react-native";
import Animated, { FadeInDown, FadeOutDown} from "react-native-reanimated";


const ToastNotification = (props) => {
  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutDown}
      style={{
        bottom: props.bottom, // Set the bottom value to determine the distance from the bottom
        backgroundColor: props.color,
        width: '90%',
        position: 'absolute',
        borderRadius: 5,
        padding: 15,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#003049',
        shadowOpacity: 0.4,
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
        alignSelf : 'center'
      }}
    >
      {props.icon}
      <View>
        <Text style={{
          color: '#F6F4F4',
          fontWeight: 'bold',
          marginLeft: 10,
          fontSize: 16,
        }}>{props.message}</Text>
      </View>
    </Animated.View>
  );
};

export default ToastNotification;
