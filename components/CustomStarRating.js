import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { FontAwesome } from '@expo/vector-icons'; 

const CustomStarRating = (props) => {
 
  const feedbackText = [
    'Very Bad',
    'Bad',
    'Average',
    'Good',
    'Very Good'
  ];

  const handleStarPress = (newRating) => {
    props.setRating(newRating);
  };

  return (
    <View>
      <View style={styles.container}>
        {[...Array(5)].map((_, index) => {
          const starNumber = index + 1;
          return (
            <TouchableOpacity
              key={starNumber}
              onPress={() => handleStarPress(starNumber)}
              disabled={props.disabled}
            >
              <FontAwesome
                name={starNumber <= props.rating ? 'star' : 'star-o'}
                size={30}
                color={starNumber <= props.rating ? 'gold' : 'gray'}
                style={{ margin: 5 }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
      <Text style={{ fontSize: 20, marginTop: 10,alignSelf : 'center' }}>
       {feedbackText[props.rating - 1]}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CustomStarRating;
