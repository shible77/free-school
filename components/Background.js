import React from 'react';
import {View, ImageBackground, StyleSheet} from 'react-native';

const Background = ({ children }) => {
  return (
    <View style={styles.outerView}>
      <ImageBackground source={require("../assets/background.jpg")} style={styles.background} />
      <View style={styles.view}>
        {children}
      </View>
    </View>
  );
}

export default Background;

const styles = StyleSheet.create({
    outerView: {
        flex: 1
    },
    background : {
        height: '100%',
        width: '100%'
    },
    view: {
        position: "absolute"
    }
})

//change for insert in github